import os
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class SimulatorConfig:
	timezone: str = "UTC"
	interval_seconds: int = 300  # deprecated in favor of wall_interval_seconds + step_minutes
	# Real-time cadence (wall clock) and simulated data step size
	wall_interval_seconds: int = 5
	step_minutes: int = 15
	random_seed: Optional[int] = None
	output_mode: str = "csv"  # csv | supabase | both
	csv_output_dir: str = "data"
	# Supabase
	supabase_url: Optional[str] = None
	supabase_key: Optional[str] = None
	# Tables
	table_co2_intensity: str = "co2_intensity"
	table_generation_mix: str = "generation_mix"
	table_netzero_alignment: str = "netzero_alignment"


def load_config_from_env() -> SimulatorConfig:
	from dotenv import load_dotenv
	load_dotenv(override=False)

	return SimulatorConfig(
		timezone=os.getenv("SIM_TIMEZONE", "UTC"),
		interval_seconds=int(os.getenv("SIM_INTERVAL_SECONDS", "300")),
		wall_interval_seconds=int(os.getenv("SIM_WALL_INTERVAL_SECONDS", os.getenv("WALL_INTERVAL_SECONDS", "5"))),
		step_minutes=int(os.getenv("SIM_STEP_MINUTES", os.getenv("STEP_MINUTES", "15"))),
		random_seed=int(os.getenv("SIM_RANDOM_SEED")) if os.getenv("SIM_RANDOM_SEED") else None,
		output_mode=os.getenv("OUTPUT_MODE", "csv"),
		csv_output_dir=os.getenv("CSV_OUTPUT_DIR", "data"),
		supabase_url=os.getenv("SUPABASE_URL") or None,
		supabase_key=os.getenv("SUPABASE_KEY") or None,
		table_co2_intensity=os.getenv("TABLE_CO2_INTENSITY", "co2_intensity"),
		table_generation_mix=os.getenv("TABLE_GENERATION_MIX", "generation_mix"),
		table_netzero_alignment=os.getenv("TABLE_NETZERO_ALIGNMENT", "netzero_alignment"),
	)

