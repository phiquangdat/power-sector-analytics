import sys
from pathlib import Path

# Ensure imports work whether run via `streamlit run` or direct python
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
try:
	from streamlit_app.lib import fetch_table
except ModuleNotFoundError:
	sys.path.insert(0, str(Path(__file__).resolve().parent))
	from lib import fetch_table  # type: ignore

# Also expose analysis helpers
try:
	from analysis.goal_tracker import compute_goal_tracker  # type: ignore
except ModuleNotFoundError:
	sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'analysis'))
	from goal_tracker import compute_goal_tracker  # type: ignore

import streamlit as st
import plotly.express as px

st.set_page_config(page_title="Sustainability Intelligence", layout="wide")
st.title("Sustainability Intelligence Dashboard")
st.write(
	"This prototype addresses the WISE Sustainability Intelligence challenge: an explorable, real‑time view of key power‑sector metrics "
	"to support reporting, analysis, and progress toward net‑zero by 2050 (IPCC 1.5°C). "
	"It illustrates how integrated metrics can improve transparency and compliance readiness (CSRD/ESRS, EU ETS MRV)."
)

# Context panel
st.sidebar.title("About this prototype")
st.sidebar.markdown(
	"- **Objective**: Integrate sustainability metrics for electricity/heat, enabling clear reporting and analysis.\n"
	"- **What you see**: CO₂ intensity, generation mix, and net‑zero alignment, updated in near‑real time.\n"
	"- **Why it matters**: These KPIs underpin disclosures (e.g., CSRD/ESRS) and operational MRV (EU ETS).\n"
	"- **Status**: Simulated data for demo. Architecture supports scaling to live sources and APIs.\n"
)

range_choice = st.selectbox("Range", ["24h", "7d"], index=0, help="How much history to show on charts")
limit = 96 if range_choice == "24h" else 96 * 7

col1, col2, col3 = st.columns(3)

try:
	co2 = fetch_table("co2_intensity", limit=limit, order="timestamp")
	gen = fetch_table("generation_mix", limit=limit, order="timestamp")
	nz = fetch_table("netzero_alignment", limit=100, order="year")

	# Goal Tracker block (only if data available)
	gt = {}
	if not co2.empty and not gen.empty:
		gt = compute_goal_tracker(co2, gen, nz)
		if not gt.get("error"):
			st.subheader("Goal Tracker (1.5°C / Net‑zero 2050)")
			m1, m2, m3 = st.columns(3)
			# RAI
			rai = gt.get("rai_pct")
			if rai is not None:
				m1.metric("Real‑time Alignment Index", f"{rai}%", help="Target intensity vs current intensity. 100% means on target.")
			# Budget
			budget = gt.get("budget") or {}
			if budget:
				m2.metric("YTD Carbon Budget", f"{int(budget.get('ytd_tons', 0)):,} t / {int(budget.get('ytd_budget_tons', 0)):,} t",
					f"{budget.get('days_ahead', 0)} days ahead", help="Cumulative emissions vs proportional YTD budget.")
			# Velocity
			vel = gt.get("velocity") or {}
			if vel:
				status = "On track" if vel.get("on_track") else "Behind"
				m3.metric("Decarbonization Velocity", status,
					help=f"Actual: {vel.get('v_actual_g_per_kwh_per_yr', 0)} g/kWh/yr vs Required: {vel.get('v_required_g_per_kwh_per_yr', 0)} g/kWh/yr")
			with st.expander("How the Goal Tracker works"):
				st.markdown(
					"- **Alignment Index**: compares current CO₂ intensity to this year's target intensity derived from annual targets.\n"
					"- **Budget**: integrates emissions from power output and intensity vs a proportional year‑to‑date budget.\n"
					"- **Velocity**: compares observed intensity decline rate vs the rate needed to meet this year's target."
				)

			# 2050 pathway section (overall target)
			st.subheader("2050 Pathway (Net‑zero trajectory)")
			p1, p2 = st.columns([1, 2])
			# Current-year alignment against target emissions (from netzero_alignment)
			align_2050 = None
			row_curr = nz.loc[nz["year"] == nz["year"].max()] if not nz.empty else None
			if row_curr is not None and not row_curr.empty and "target_emissions_mt" in nz.columns and "actual_emissions_mt" in nz.columns:
				act = float(row_curr.iloc[0]["actual_emissions_mt"]) or 0.0
				tar = float(row_curr.iloc[0]["target_emissions_mt"]) or 0.0
				if act > 0:
					align_2050 = min(100.0, 100.0 * tar / act)
			if align_2050 is not None:
				p1.metric("2050 Pathway Alignment", f"{align_2050:.0f}%", help="Annual actual vs annual target (cap at 100%).")
			# ETA and sparkline of target series
			path = gt.get("pathway") or {}
			eta = path.get("eta_year")
			if eta:
				p1.metric("ETA to near‑zero", f"{int(eta)}", help="Year when current decline rate would reach near‑zero intensity.")
			series = path.get("series")
			if series:
				import pandas as _pd
				_s = _pd.DataFrame(series)
				_figp = px.line(_s.sort_values("year"), x="year", y="target_emissions_mt", title="Target emissions pathway (to 2050)")
				p2.plotly_chart(_figp, use_container_width=True)
			with st.expander("How to read this (2050)"):
				st.markdown(
					"- **Alignment**: how current annual emissions compare to the pathway target.\n"
					"- **ETA**: illustrative year to hit near‑zero if today’s improvement rate persisted.\n"
					"- **Pathway**: annual targets to 2050 (0 Mt)."
				)

	# KPI cards
	if not co2.empty:
		current_co2 = co2.sort_values("timestamp").iloc[-1]["co2_intensity_g_per_kwh"]
		col1.metric("CO₂ intensity (g/kWh)", f"{current_co2:.1f}")
	if not gen.empty:
		current_share = gen.sort_values("timestamp").iloc[-1]["renewable_share_pct"]
		col2.metric("Renewable share (%)", f"{current_share:.1f}")
	if not nz.empty:
		latest_align = nz.sort_values("year").iloc[-1]["alignment_pct"]
		col3.metric("Net-zero alignment (%)", f"{latest_align:.0f}")

	# Time series
	if not co2.empty:
		fig = px.line(co2.sort_values("timestamp"), x="timestamp", y="co2_intensity_g_per_kwh", title="CO₂ intensity over time")
		st.plotly_chart(fig, use_container_width=True)
		st.caption("Lower is better. Expect dips when wind/solar/hydro output is high; spikes during outages or low renewables. Useful for trend disclosures and operational decarbonization tracking.")
		with st.expander("What this shows (CO₂ intensity)"):
			st.markdown(
				"- **Y‑axis**: gCO₂ per kWh.\n"
				"- **X‑axis**: time (15‑minute simulated steps).\n"
				"- **Drivers**: renewable availability, outages/maintenance, fossil dispatch.\n"
				"- **Read it**: downward trend = decarbonization; spikes = operational events.\n"
				"- **Why it matters**: core emissions intensity indicator for CSRD/ESRS climate metrics."
			)

	if not gen.empty:
		g = gen.sort_values("timestamp")
		fig2 = px.area(g, x="timestamp", y=["hydro_mw","wind_mw","solar_mw","nuclear_mw","fossil_mw"], title="Generation mix (MW)")
		st.plotly_chart(fig2, use_container_width=True)
		st.caption("Stacked by technology (MW). Weather, maintenance, and price signals drive shifts. Supports narrative on energy mix and renewable penetration.")
		with st.expander("What this shows (generation mix)"):
			st.markdown(
				"- **Stacked area**: MW by source (hydro, wind, solar, nuclear, fossil).\n"
				"- **Total**: top of the stack ≈ demand served.\n"
				"- **Read it**: larger renewable area → expect lower CO₂ intensity above.\n"
				"- **Why it matters**: supports ESRS disclosures on energy mix and renewable share."
			)

	# Current mix
	if not gen.empty:
		last = gen.sort_values("timestamp").iloc[-1]
		mix = last[["hydro_mw","wind_mw","solar_mw","nuclear_mw","fossil_mw"]]
		fig3 = px.pie(values=mix.values, names=mix.index, title="Current generation mix")
		st.plotly_chart(fig3, use_container_width=True)
		st.caption("Current mix snapshot. Higher renewable share typically correlates with lower CO₂ intensity.")
		with st.expander("What this shows (current mix)"):
			st.markdown(
				"- **Slices**: share of output by technology right now.\n"
				"- **Read it**: bigger renewable slices → lower expected CO₂ intensity.\n"
				"- **Why it matters**: quick status for operations and stakeholder reporting."
			)

	st.info("Prototype note: Data are simulated to demonstrate flows and visuals. In production, data integrate from plant SCADA, fuel/efficiency logs, and emissions inventories.")

except Exception as e:
	st.error(f"Error fetching data: {e}")
