from __future__ import annotations

import pandas as pd


def summarize_co2(df: pd.DataFrame) -> dict:
	if df.empty:
		return {"count": 0}
	return {
		"count": int(len(df)),
		"min_gco2_kwh": float(df["co2_intensity_g_per_kwh"].min()),
		"max_gco2_kwh": float(df["co2_intensity_g_per_kwh"].max()),
		"avg_gco2_kwh": float(df["co2_intensity_g_per_kwh"].mean()),
	}


def summarize_generation_mix(df: pd.DataFrame) -> dict:
	if df.empty:
		return {"count": 0}
	renewable = df[["hydro_mw", "wind_mw", "solar_mw"]].sum(axis=1)
	share = 100.0 * renewable / df["total_mw"].replace(0, pd.NA)
	return {
		"count": int(len(df)),
		"avg_total_mw": float(df["total_mw"].mean()),
		"avg_renewable_share_pct": float(share.mean(skipna=True)),
	}


def summarize_netzero(df: pd.DataFrame) -> dict:
	if df.empty:
		return {"count": 0}
	return {
		"count": int(len(df)),
		"latest_alignment_pct": float(df.sort_values("year")["alignment_pct"].iloc[-1]),
	}



