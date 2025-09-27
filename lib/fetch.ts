import { supabase } from './supabase'

export async function fetchCo2(limit = 96) {
	const { data, error } = await supabase
		.from('co2_intensity')
		.select('*')
		.order('timestamp', { ascending: false })
		.limit(limit)
	if (error) throw error
	return (data ?? []).reverse()
}

export async function fetchMix(limit = 96) {
	const { data, error } = await supabase
		.from('generation_mix')
		.select('*')
		.order('timestamp', { ascending: false })
		.limit(limit)
	if (error) throw error
	return (data ?? []).reverse()
}

export async function fetchNetZero(limit = 100) {
	const { data, error } = await supabase
		.from('netzero_alignment')
		.select('*')
		.order('year', { ascending: true })
		.limit(limit)
	if (error) throw error
	return data ?? []
}

