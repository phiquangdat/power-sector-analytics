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

// New intelligence features
export const fetchCo2Forecast = () => apiFetch("/api/forecast/co2");
export const runScenario = (params: {
  solar_boost?: number;
  wind_boost?: number;
  fossil_reduction?: number;
  nuclear_outage?: boolean;
  duration_hours?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params.solar_boost !== undefined) searchParams.set('solar_boost', params.solar_boost.toString());
  if (params.wind_boost !== undefined) searchParams.set('wind_boost', params.wind_boost.toString());
  if (params.fossil_reduction !== undefined) searchParams.set('fossil_reduction', params.fossil_reduction.toString());
  if (params.nuclear_outage !== undefined) searchParams.set('nuclear_outage', params.nuclear_outage.toString());
  if (params.duration_hours !== undefined) searchParams.set('duration_hours', params.duration_hours.toString());
  
  return apiFetch(`/api/scenario/?${searchParams.toString()}`);
};
export const fetchInsights = () => apiFetch("/api/insights/");
