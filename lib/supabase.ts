import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined

if (!url || !key) {
	console.warn('Supabase env vars are not set (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)')
}

export const supabase = createClient(url ?? '', key ?? '')


