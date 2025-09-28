const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://nexus-sustainability-api.onrender.com";

export interface Co2Row {
  timestamp: string;
  co2_intensity_g_per_kwh: number;
}

export interface MixRow {
  timestamp: string;
  hydro_mw: number;
  wind_mw: number;
  solar_mw: number;
  nuclear_mw: number;
  fossil_mw: number;
  total_mw: number;
  renewable_share_pct: number;
  co2_intensity_g_per_kwh: number;
}

export interface NetZeroRow {
  year: number;
  actual_emissions_mt: number;
  target_emissions_mt: number;
  alignment_pct: number;
}

export interface ForecastRow {
  timestamp: string;
  co2_intensity_g_per_kwh: number;
  forecast_type: string;
  forecast_horizon_hours: number;
  created_at: string;
}

async function apiFetch<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Fetching from: ${url}`);
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch from ${endpoint}: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export const fetchCo2 = (limit = 96) => apiFetch<Co2Row[]>("/api/co2/");
export const fetchMix = (limit = 96) => apiFetch<MixRow[]>("/api/mix/");
export const fetchNetZero = (limit = 100) =>
  apiFetch<NetZeroRow[]>("/api/netzero/");
export const fetchGoalTracker = () => apiFetch("/api/analytics/goal_tracker");
export const fetchDashboard = () => apiFetch("/api/analytics/dashboard");
export const fetchForecasts = (limit = 96) =>
  apiFetch<ForecastRow[]>("/api/forecasts");
