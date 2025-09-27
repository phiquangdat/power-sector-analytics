// Data types for the Sustainability Intelligence Dashboard

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
  renewable_share_pct: number;
}

export interface NetZeroRow {
  year: number;
  actual_emissions_mt: number;
  target_emissions_mt: number;
  alignment_pct: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  database: 'connected' | 'disconnected';
}

export interface ErrorResponse {
  success: false;
  error: string;
  timestamp: string;
  path: string;
}
