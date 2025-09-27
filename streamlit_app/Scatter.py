import sys
from pathlib import Path

# Ensure imports work whether run via `streamlit run` or direct python
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
try:
	from streamlit_app.lib import fetch_table
except ModuleNotFoundError:
	sys.path.insert(0, str(Path(__file__).resolve().parent))
	from lib import fetch_table  # type: ignore

import streamlit as st
import plotly.express as px
import pandas as pd

st.set_page_config(page_title="Renewables vs CO₂", layout="wide")
st.title("Renewables vs CO₂ intensity")
st.write("As renewable share increases, CO₂ intensity tends to fall. This view tests the expected decarbonization signal and supports disclosures linking energy mix to emissions outcomes.")
with st.expander("How to read this"):
	st.markdown(
		"- **X‑axis**: renewable share (%).\n"
		"- **Y‑axis**: CO₂ intensity (g/kWh).\n"
		"- **Trendline**: expected negative slope; deviations may indicate data quality issues or unusual operations.\n"
		"- **Why it matters**: evidence that renewable integration lowers emissions, supporting climate strategy narratives."
	)

range_choice = st.selectbox("Range", ["24h", "7d"], index=0)
limit = 96 if range_choice == "24h" else 96 * 7

try:
	co2 = fetch_table("co2_intensity", limit=limit, order="timestamp")
	gen = fetch_table("generation_mix", limit=limit, order="timestamp")
	if co2.empty or gen.empty:
		st.info("Not enough data yet.")
		st.stop()
	# Join on timestamp
	df = pd.merge(gen, co2, on="timestamp", how="inner")
	fig = px.scatter(
		df,
		x="renewable_share_pct",
		y="co2_intensity_g_per_kwh",
		title="Inverse relationship: higher renewables → lower CO₂ intensity",
		trendline="ols",
	)
	st.plotly_chart(fig, use_container_width=True)
except Exception as e:
	st.error(f"Error: {e}")
