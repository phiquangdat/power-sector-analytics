import { supabase } from './supabase'

export type Co2Row = { timestamp: string; co2_intensity_g_per_kwh: number }
export type MixRow = {
	timestamp: string
	hydro_mw: number
	wind_mw: number
	solar_mw: number
	nuclear_mw: number
	fossil_mw: number
	renewable_share_pct: number
}
export type NetZeroRow = { year: number; actual_emissions_mt: number; target_emissions_mt: number; alignment_pct: number }

export async function fetchCo2(limit = 96): Promise<Co2Row[]> {
	console.log('🔍 Supabase client status:', !!supabase);
	if (!supabase) {
		console.warn('❌ Supabase not initialized, returning empty data')
		return []
	}
	console.log('🔄 Fetching CO2 data...');
	const { data, error } = await supabase
		.from('co2_intensity')
		.select('*')
		.order('timestamp', { ascending: false })
		.limit(limit)
	if (error) {
		console.error('❌ Error fetching CO2 data:', error)
		throw error
	}
	console.log(`✅ Fetched ${data?.length || 0} CO2 records, latest:`, data?.[0])
	return ((data ?? []) as Co2Row[]).reverse()
}

export async function fetchMix(limit = 96): Promise<MixRow[]> {
	if (!supabase) {
		console.warn('Supabase not initialized, returning empty data')
		return []
	}
	const { data, error } = await supabase
		.from('generation_mix')
		.select('*')
		.order('timestamp', { ascending: false })
		.limit(limit)
	if (error) {
		console.error('Error fetching Mix data:', error)
		throw error
	}
	console.log(`Fetched ${data?.length || 0} Mix records, latest:`, data?.[0])
	return ((data ?? []) as MixRow[]).reverse()
}

export async function fetchNetZero(limit = 100): Promise<NetZeroRow[]> {
	if (!supabase) {
		console.warn('Supabase not initialized, returning empty data')
		return []
	}
	const { data, error } = await supabase
		.from('netzero_alignment')
		.select('*')
		.order('year', { ascending: true })
		.limit(limit)
	if (error) throw error
	return (data ?? []) as NetZeroRow[]
}

