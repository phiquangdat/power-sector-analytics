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

st.set_page_config(page_title="Net-zero trajectory", layout="wide")
st.title("Net-zero trajectory")
st.write("Annual actual vs target emissions for alignment with a 2050 net‑zero pathway. Supports CSRD/ESRS narrative on progress, with room to add confidence intervals and scenario overlays.")
with st.expander("How to read this"):
	st.markdown(
		"- **Lines**: actual emissions vs target pathway (Mt).\n"
		"- **Gap**: actual above target → behind; below target → ahead of plan.\n"
		"- **Why it matters**: aligns with ESRS climate metrics and long‑term decarbonization plans; can tie to EU ETS MRV baselines."
	)

try:
	nz = fetch_table("netzero_alignment", limit=200, order="year")
	if nz.empty:
		st.info("No yearly data yet.")
	else:
		fig = px.line(nz.sort_values("year"), x="year", y=["actual_emissions_mt","target_emissions_mt"], markers=True, title="Actual vs target emissions")
		st.plotly_chart(fig, use_container_width=True)
except Exception as e:
	st.error(f"Error: {e}")
