import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined

// Only create client if both env vars are available
export const supabase = (url && key) ? createClient(url, key) : null



