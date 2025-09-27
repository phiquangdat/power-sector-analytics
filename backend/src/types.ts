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

// Request types for POST/PUT operations
export interface CreateCo2Request {
  timestamp: string;
  co2_intensity_g_per_kwh: number;
}

export interface UpdateCo2Request {
  co2_intensity_g_per_kwh?: number;
}

export interface CreateMixRequest {
  timestamp: string;
  hydro_mw: number;
  wind_mw: number;
  solar_mw: number;
  nuclear_mw: number;
  fossil_mw: number;
  renewable_share_pct: number;
}

export interface UpdateMixRequest {
  hydro_mw?: number;
  wind_mw?: number;
  solar_mw?: number;
  nuclear_mw?: number;
  fossil_mw?: number;
  renewable_share_pct?: number;
}

export interface CreateNetZeroRequest {
  year: number;
  actual_emissions_mt: number;
  target_emissions_mt: number;
  alignment_pct: number;
}

export interface UpdateNetZeroRequest {
  actual_emissions_mt?: number;
  target_emissions_mt?: number;
  alignment_pct?: number;
}

// Response types for CRUD operations
export interface CreateResponse {
  success: boolean;
  data?: {
    id: number;
    [key: string]: any;
  };
  error?: string;
  timestamp: string;
}

export interface UpdateResponse {
  success: boolean;
  data?: {
    id: number;
    [key: string]: any;
  };
  error?: string;
  timestamp: string;
}

export interface DeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
  timestamp: string;
}
