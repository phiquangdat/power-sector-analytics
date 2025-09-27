from __future__ import annotations

from datetime import datetime, timezone
from typing import Dict
import numpy as np
import pandas as pd


def _to_utc(dt: pd.Series) -> pd.Series:
	if np.issubdtype(dt.dtype, np.datetime64):
		return pd.to_datetime(dt, utc=True)
	return pd.to_datetime(dt, utc=True, errors="coerce")


def compute_goal_tracker(
	df_co2: pd.DataFrame,
	df_gen: pd.DataFrame,
	df_nz: pd.DataFrame,
	base_year_from_data: bool = True,
) -> Dict[str, object]:
	"""
	Returns a dict with:
	- rai_pct: Real-time Alignment Index (%)
	- budget: { ytd_tons, ytd_budget_tons, days_ahead }
	- velocity: { v_actual_g_per_kwh_per_yr, v_required_g_per_kwh_per_yr, on_track }
	"""
	res: Dict[str, object] = {}
	if df_co2.empty or df_gen.empty:
		return {"error": "insufficient_data"}

	# Timestamps
	df_co2 = df_co2.copy()
	df_gen = df_gen.copy()
	df_co2["timestamp"] = _to_utc(df_co2["timestamp"])  # type: ignore[index]
	df_gen["timestamp"] = _to_utc(df_gen["timestamp"])  # type: ignore[index]

	# Current context
	now = datetime.now(timezone.utc)
	current_year = now.year

	# Base year
	if base_year_from_data:
		if not df_nz.empty and "year" in df_nz:
			base_year = int(df_nz["year"].min())
		else:
			base_year = int(min(df_co2["timestamp"].min(), df_gen["timestamp"].min()).year)
	else:
		base_year = current_year

	# Target emissions (tons) for current year from netzero_alignment
	annual_target_tons = None
	if not df_nz.empty and "year" in df_nz and "target_emissions_mt" in df_nz:
		row = df_nz.loc[df_nz["year"] == current_year]
		if not row.empty:
			annual_target_tons = float(row.iloc[0]["target_emissions_mt"]) * 1_000_000.0

	# Compute trailing intensity stats
	co2_sorted = df_co2.sort_values("timestamp")
	I_latest = float(co2_sorted.iloc[-1]["co2_intensity_g_per_kwh"])  # g/kWh

	# Estimate base intensity from base_year window
	I_base = I_latest
	mask_base = co2_sorted["timestamp"].dt.year == base_year
	if mask_base.any():
		I_base = float(co2_sorted.loc[mask_base, "co2_intensity_g_per_kwh"].median())

	# Estimate target intensity for current year from annual targets (proportional assumption)
	I_target = None
	if annual_target_tons is not None:
		# Need a scaling between emissions target and intensity; assume demand roughly constant vs base year
		# Use proportional scaling from base year actual to target emissions
		actual_base_mt = None
		if not df_nz.empty and "actual_emissions_mt" in df_nz.columns:
			row_base = df_nz.loc[df_nz["year"] == base_year]
			if not row_base.empty:
				actual_base_mt = float(row_base.iloc[0]["actual_emissions_mt"])
		if actual_base_mt and actual_base_mt > 0:
			I_target = I_base * (annual_target_tons / (actual_base_mt * 1_000_000.0))

	# Real-time Alignment Index (higher is better when current <= target)
	rai_pct = None
	if I_target and I_latest > 0:
		rai_pct = 100.0 * I_target / I_latest
	res["rai_pct"] = None if rai_pct is None else round(rai_pct, 1)

	# YTD Carbon Budget Tracker
	this_year_mask = df_gen["timestamp"].dt.year == current_year
	df_gen_y = df_gen.loc[this_year_mask].sort_values("timestamp")
	if len(df_gen_y) >= 2 and annual_target_tons:
		# Integrate emissions using pairwise time deltas
		merged = pd.merge_asof(
			left=df_gen_y[["timestamp", "total_mw"]].sort_values("timestamp"),
			right=co2_sorted[["timestamp", "co2_intensity_g_per_kwh"]].sort_values("timestamp"),
			on="timestamp",
			direction="nearest",
			tolerance=pd.Timedelta("20min"),
		)
		merged = merged.dropna(subset=["co2_intensity_g_per_kwh", "total_mw"]).copy()
		if len(merged) >= 2:
			merged["dt_hours"] = merged["timestamp"].diff().dt.total_seconds().fillna(0) / 3600.0
			# Replace first 0 with median step if present
			if (merged["dt_hours"] == 0).any():
				step = merged["dt_hours"].replace(0, np.nan).median()
				merged.loc[merged["dt_hours"] == 0, "dt_hours"] = step if pd.notnull(step) else 0.25
			merged["mwh"] = merged["total_mw"] * merged["dt_hours"]
			merged["tons"] = merged["mwh"] * merged["co2_intensity_g_per_kwh"] * 1e-3
			co2_ytd_tons = float(merged["tons"].sum())
			# Linear budget allocation over year
			start_year = pd.Timestamp(year=current_year, month=1, day=1, tz="UTC")
			days_elapsed = max(1.0, (pd.Timestamp.now(tz="UTC") - start_year).total_seconds() / 86400.0)
			ytd_budget_tons = float(annual_target_tons * (days_elapsed / 365.0))
			daily_avg_tons = co2_ytd_tons / days_elapsed
			days_ahead = (ytd_budget_tons - co2_ytd_tons) / daily_avg_tons if daily_avg_tons > 0 else 0.0
			res["budget"] = {
				"ytd_tons": round(co2_ytd_tons, 0),
				"ytd_budget_tons": round(ytd_budget_tons, 0),
				"days_ahead": round(days_ahead, 1),
			}

	# Decarbonization velocity vs required (to hit this year's target by year-end)
	vel = {}
	if len(co2_sorted) >= 10 and I_target:
		# Fit slope over trailing window (last 7 days or all if shorter)
		end_time = co2_sorted["timestamp"].max()
		start_time = end_time - pd.Timedelta("7D")
		w = co2_sorted[co2_sorted["timestamp"] >= start_time]
		if len(w) >= 10:
			# Convert time to days since start
			t_days = (w["timestamp"] - w["timestamp"].min()).dt.total_seconds() / 86400.0
			y = w["co2_intensity_g_per_kwh"].astype(float)
			slope_per_day = float(np.polyfit(t_days, y, 1)[0])  # g/kWh per day
			v_actual = -slope_per_day * 365.0  # g/kWh per year (positive means decreasing)
			# Required drop to reach I_target by year-end
			days_left = max(1.0, (pd.Timestamp(year=current_year + 1, month=1, day=1, tz="UTC") - end_time).total_seconds() / 86400.0)
			v_required = max(0.0, (I_latest - I_target) * (365.0 / days_left))
			vel = {
				"v_actual_g_per_kwh_per_yr": round(v_actual, 1),
				"v_required_g_per_kwh_per_yr": round(v_required, 1),
				"on_track": bool(v_actual >= v_required),
			}
			res["velocity"] = vel

	# 2050 pathway ETA and series for UI
	pathway: Dict[str, object] = {}
	# ETA to near-zero intensity with linear decline approximation
	if "velocity" in res:
		v_act = float(res["velocity"]["v_actual_g_per_kwh_per_yr"])  # type: ignore[index]
		if v_act > 0:
			years_to_zero = max(0.0, I_latest / v_act)
			eta_year = int(current_year + years_to_zero)
			pathway["eta_year"] = eta_year

	# Build target series to 2050 for small sparkline
	if not df_nz.empty and "year" in df_nz and "target_emissions_mt" in df_nz:
		series = df_nz[["year", "target_emissions_mt"]].dropna().copy()
		if (series["year"] == 2050).sum() == 0:
			series = pd.concat([series, pd.DataFrame({"year": [2050], "target_emissions_mt": [0.0]})], ignore_index=True)
		series = series.drop_duplicates(subset=["year"]).sort_values("year")
		pathway["series"] = series.to_dict(orient="records")  # list[{year, target_emissions_mt}]

	if pathway:
		res["pathway"] = pathway

	return res

