from __future__ import annotations

import argparse
import math
import random
from dataclasses import asdict
from datetime import datetime, timedelta, timezone
from typing import List, Tuple

from .bias import diurnal_profile, weather_variation, planned_outage_factor, fossil_price_shock_factor, compute_co2_intensity, bounded_normal
from .config import SimulatorConfig, load_config_from_env
from .models import Co2IntensityRecord, GenerationMixRecord, NetZeroAlignmentRecord
from .storage import append_csv
from .supabase_client import SupabaseClient


def _now_tz(tz_name: str) -> datetime:
	try:
		import zoneinfo  # Python 3.9+
		tz = zoneinfo.ZoneInfo(key=tz_name)
	except Exception:
		tz = timezone.utc
	return datetime.now(tz)


def _seed_random(seed: int | None) -> None:
	if seed is not None:
		random.seed(seed)


def simulate_generation_mix(ts: datetime, base_total_mw: float = 7000.0) -> GenerationMixRecord:
	# Demand diurnal shape
	load_factor = diurnal_profile(ts.hour, 0.85, 1.15)
	wind_f, solar_f, hydro_f = weather_variation()
	planned_factor = planned_outage_factor()
	price_shock = fossil_price_shock_factor()

	# Baseline capacities (MW) roughly aligned to doc table totals
	# DRAMATIC variation for testing - much more extreme changes
	base_hydro = 950.0 * bounded_normal(1.0, 0.5, 0.2, 2.0)
	base_wind = 1800.0 * bounded_normal(1.0, 0.8, 0.1, 3.0)
	base_solar = (150.0 if 8 <= ts.hour <= 18 else 10.0) * bounded_normal(1.0, 1.0, 0.05, 4.0)
	base_nuclear = 2700.0 * bounded_normal(1.0, 0.3, 0.5, 1.5)
	base_fossil = max(1200.0, 1600.0 * load_factor) * bounded_normal(1.0, 0.5, 0.3, 2.0)

	# Apply multiplicative factors and ensure non-negative
	hydro = max(0.0, base_hydro * hydro_f)
	wind = max(0.0, base_wind * wind_f)
	solar = max(0.0, base_solar * solar_f)
	nuclear = max(0.0, base_nuclear * planned_factor)
	fossil = max(0.0, base_fossil * price_shock)

	# Adjust total to reflect demand
	raw_total = hydro + wind + solar + nuclear + fossil
	scale = (base_total_mw * load_factor) / raw_total if raw_total > 0 else 1.0
	hydro *= scale
	wind *= scale
	solar *= scale
	nuclear *= scale
	fossil *= scale
	total = hydro + wind + solar + nuclear + fossil
	renewables = hydro + wind + solar
	renew_pct = 100.0 * renewables / total if total > 0 else 0.0

	return GenerationMixRecord(
		id=None,
		timestamp=ts,
		hydro_mw=round(hydro, 1),
		wind_mw=round(wind, 1),
		solar_mw=round(solar, 1),
		nuclear_mw=round(nuclear, 1),
		fossil_mw=round(fossil, 1),
		total_mw=round(total, 1),
		renewable_share_pct=round(renew_pct, 1),
	)


def simulate_co2_intensity(ts: datetime, generation: GenerationMixRecord) -> Co2IntensityRecord:
	intensity = compute_co2_intensity(generation.renewable_share_pct, base_range=(100, 300))
	return Co2IntensityRecord(id=None, timestamp=ts, co2_intensity_g_per_kwh=round(intensity, 1))


def simulate_netzero_alignment(year: int) -> NetZeroAlignmentRecord:
	# Targets per doc example: 2020=30, 2021=29, ..., 2025=25
	base_targets = {2020: 30, 2021: 29, 2022: 28, 2023: 27, 2024: 26, 2025: 25}
	target = base_targets.get(year, max(10, 30 - (year - 2020)))
	# Actual with noise and potential setbacks
	actual = bounded_normal(base=float(target) * 1.02, std_dev=1.0, lower=target * 0.8, upper=target * 1.2)
	alignment = 100.0 * target / actual if actual > 0 else 0.0
	return NetZeroAlignmentRecord(year=year, actual_emissions_mt=round(actual, 1), target_emissions_mt=float(target), alignment_pct=round(alignment, 0))


def to_row_dicts(records) -> List[dict]:
	return [asdict(r) for r in records]


def write_outputs(cfg: SimulatorConfig, sb: SupabaseClient, co2_rows, gen_rows, nz_rows) -> None:
	if cfg.output_mode in ("csv", "both"):
		append_csv(f"{cfg.csv_output_dir}/co2_intensity.csv", co2_rows)
		append_csv(f"{cfg.csv_output_dir}/generation_mix.csv", gen_rows)
		append_csv(f"{cfg.csv_output_dir}/netzero_alignment.csv", nz_rows)
	if cfg.output_mode in ("supabase", "both") and sb.enabled():
		sb.insert_rows(cfg.table_co2_intensity, co2_rows)
		sb.insert_rows(cfg.table_generation_mix, gen_rows)
		# Upsert yearly alignment to avoid duplicate key conflicts
		sb.insert_rows(cfg.table_netzero_alignment, nz_rows, on_conflict="year", resolution="ignore-duplicates")


def run_once(cfg: SimulatorConfig, anchor: datetime | None = None) -> datetime:
	"""Generate one step. If anchor not provided, compute from current time.

	Returns the timestamp used so caller can advance consistently.
	"""
	if anchor is None:
		_now = _now_tz(cfg.timezone)
		# Compute a default anchor rounded to step_minutes
		step_seconds = int(cfg.step_minutes * 60)
		anchor = _now - timedelta(seconds=int(_now.timestamp()) % step_seconds)

	gen = simulate_generation_mix(anchor)
	co2 = simulate_co2_intensity(anchor, gen)
	# Yearly record updated once per run for simplicity
	nz = simulate_netzero_alignment(anchor.year)
	co2_rows = to_row_dicts([co2])
	gen_rows = to_row_dicts([gen])
	nz_rows = to_row_dicts([nz])
	sb = SupabaseClient(cfg.supabase_url, cfg.supabase_key)
	write_outputs(cfg, sb, co2_rows, gen_rows, nz_rows)
	return anchor


def run_continuous(cfg: SimulatorConfig) -> None:
	import time
	# Initialize anchor at the rounded current step
	step = timedelta(minutes=cfg.step_minutes)
	anchor = run_once(cfg)
	while True:
		# Advance simulated time by step for each wall-clock tick
		anchor = anchor + step
		run_once(cfg, anchor=anchor)
		time.sleep(cfg.wall_interval_seconds)


def main() -> None:
	parser = argparse.ArgumentParser(description="Sustainability Intelligence data simulator")
	parser.add_argument("mode", choices=["once", "continuous"], nargs="?", default="once")
	parser.add_argument("--seed", type=int, default=None, help="Random seed for reproducibility")
	parser.add_argument("--output", choices=["csv", "supabase", "both"], default=None, help="Override output mode")
	parser.add_argument("--wall", type=int, default=None, help="Wall-clock interval seconds (e.g., 5)")
	parser.add_argument("--step", type=int, default=None, help="Simulated step minutes (e.g., 15)")
	args = parser.parse_args()

	cfg = load_config_from_env()
	if args.seed is not None:
		cfg = type(cfg)(
			timezone=cfg.timezone,
			interval_seconds=cfg.interval_seconds,
			wall_interval_seconds=cfg.wall_interval_seconds,
			step_minutes=cfg.step_minutes,
			random_seed=args.seed,
			output_mode=args.output or cfg.output_mode,
			csv_output_dir=cfg.csv_output_dir,
			supabase_url=cfg.supabase_url,
			supabase_key=cfg.supabase_key,
			table_co2_intensity=cfg.table_co2_intensity,
			table_generation_mix=cfg.table_generation_mix,
			table_netzero_alignment=cfg.table_netzero_alignment,
		)
	else:
		if args.output:
			cfg = type(cfg)(
				timezone=cfg.timezone,
				interval_seconds=cfg.interval_seconds,
				wall_interval_seconds=cfg.wall_interval_seconds,
				step_minutes=cfg.step_minutes,
				random_seed=cfg.random_seed,
				output_mode=args.output,
				csv_output_dir=cfg.csv_output_dir,
				supabase_url=cfg.supabase_url,
				supabase_key=cfg.supabase_key,
				table_co2_intensity=cfg.table_co2_intensity,
				table_generation_mix=cfg.table_generation_mix,
				table_netzero_alignment=cfg.table_netzero_alignment,
			)

	_seed_random(cfg.random_seed)
	# Allow overriding cadence from CLI
	if args.wall is not None or args.step is not None:
		cfg = type(cfg)(
			timezone=cfg.timezone,
			interval_seconds=cfg.interval_seconds,
			wall_interval_seconds=args.wall if args.wall is not None else cfg.wall_interval_seconds,
			step_minutes=args.step if args.step is not None else cfg.step_minutes,
			random_seed=cfg.random_seed,
			output_mode=cfg.output_mode,
			csv_output_dir=cfg.csv_output_dir,
			supabase_url=cfg.supabase_url,
			supabase_key=cfg.supabase_key,
			table_co2_intensity=cfg.table_co2_intensity,
			table_generation_mix=cfg.table_generation_mix,
			table_netzero_alignment=cfg.table_netzero_alignment,
		)

	if args.mode == "continuous":
		run_continuous(cfg)
	else:
		run_once(cfg)


if __name__ == "__main__":
	main()

