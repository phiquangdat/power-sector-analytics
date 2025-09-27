# Sustainability Intelligence Platform (Prototype)

This repository contains a real-time prototype for sustainability intelligence in the electricity & heat sector. It simulates, stores, and visualizes key metrics that support reporting, analysis, and progress toward net-zero by 2050.

## Goals
- Align with the hackathon brief (WISE ecosystem): integrate sustainability metrics to support compliance and better decision-making.
- Show real-time KPIs and their relation to annual targets and the 2050 net‑zero pathway (IPCC 1.5°C).
- Provide a clear path for a full-stack handoff (APIs, frontend dashboard).

## Architecture
- Data generation: Python simulator producing realistic time-series with diurnal/weather/outage effects.
- Storage: Supabase (PostgREST) with tables: `co2_intensity`, `generation_mix`, `netzero_alignment`.
- Analysis: Python analysis package with summaries and Goal Tracker metrics.
- UI: Streamlit prototype with Plotly charts; acts as a guide for a production frontend.

```
(simulator) → Supabase (REST) → (analysis + Streamlit) → end-users
```

## Data schema
- `co2_intensity`: id, timestamp (timestamptz), co2_intensity_g_per_kwh (numeric)
- `generation_mix`: id, timestamp, hydro_mw, wind_mw, solar_mw, nuclear_mw, fossil_mw, total_mw, renewable_share_pct
- `netzero_alignment`: year (PK), actual_emissions_mt, target_emissions_mt, alignment_pct

SQL files: `supabase/sql/01_schema_tables.sql`, `02_indexes.sql`, `03_rls_policies.sql`, `04_realtime.sql`

## Setup
1) Python deps
```
python -m pip install -r requirements.txt
```

2) Environment (.env)
```
OUTPUT_MODE=supabase
SUPABASE_URL=...your url...
SUPABASE_KEY=...your anon key...
SIM_WALL_INTERVAL_SECONDS=5
SIM_STEP_MINUTES=15
SIM_TIMEZONE=UTC
```

3) Supabase tables
- Run the SQL files in order via Supabase SQL editor: 01 → 02 → 03 → 04 (optional).
- If `03_rls_policies.sql` errors on IF NOT EXISTS, use the DROP/CREATE variant shared earlier.

## Simulator
- One-off insert:
```
python scripts/simulate.py once --seed 7 --wall 5 --step 15 --output supabase
```
- Continuous (5s wall, 15m simulated):
```
python scripts/simulate.py continuous --wall 5 --step 15 --output supabase
```
- CSV mode:
```
python scripts/simulate.py continuous --wall 5 --step 15 --output csv
```

Notes:
- The simulator writes to Supabase `rest/v1` with anon key; drop None fields and serialize datetimes.
- `netzero_alignment` uses upsert ignore for duplicate years.

## Analysis
- CLI summary from Supabase:
```
python -c "from analysis.cli import main; import sys; sys.argv=['', 'supabase']; main()"
```
- Goal Tracker metrics: see `analysis/goal_tracker.py`.

## Streamlit prototype
- Launch:
```
streamlit run streamlit_app/Home.py
```
- Pages:
  - Home: KPI cards, Goal Tracker (Alignment Index, YTD Budget, Velocity), CO₂ intensity line, stacked generation mix, current mix donut, 2050 Pathway (alignment, ETA, target sparkline).
  - Scatter: renewables share vs CO₂ intensity with trendline.
  - NetZero: actual vs target emissions (annual) line.

### Goal Tracker math (simplified)
- Real‑time Alignment Index: `RAI = 100 × I_target(year) / I_current` (gCO₂/kWh).
- YTD Budget: integrate `tons = total_mw × Δt_hours × intensity_g_per_kWh × 1e−3`; compare to `annual_target_tons × (elapsed_days/365)`; display days ahead/behind.
- Velocity: fit trailing intensity decline (g/kWh/yr) vs required to hit year-end target.
- 2050 Pathway: alignment (annual actual vs target), ETA to near‑zero from current decline rate, target sparkline to 2050.

Assumptions:
- Base year = earliest year in available data.
- Target series read from `netzero_alignment`; 2050 target = 0 Mt.
- Projection and ETA are illustrative.

## For the full-stack developer
- Backend API
  - Define endpoints to surface KPIs and Goal Tracker (e.g., `/kpi/current`, `/goal-tracker`, `/timeseries?range=24h`).
  - Optionally use Supabase edge functions or a lightweight Python/Node service.
- Frontend dashboard (React, Plotly/Chart.js)
  - Port Streamlit pages into routed views with shared layout.
  - Add range controls, scenario selector, and realtime subscriptions.
- Realtime
  - Enable publication for tables (`04_realtime.sql`) and subscribe.
- Security & compliance
  - Tighten RLS: restrict inserts to service role, reads to authorized users.
  - Map KPIs to CSRD/ESRS climate metrics and EU ETS MRV context in UI documentation.

## Project structure
- `simulator/`: data generation and Supabase client
- `analysis/`: data access, metrics, goal tracker
- `streamlit_app/`: prototype UI
- `supabase/sql/`: schema and policies
- `data/`: CSV outputs (gitignored)

## Next steps
- Add pathway selector (NZE/custom), and 2050 alignment gauge in production UI.
- Harden RLS and move inserts to service role key.
- Replace simulation with real data sources (SCADA, fuel, verified emissions).
- Package APIs for the frontend (OpenAPI).
