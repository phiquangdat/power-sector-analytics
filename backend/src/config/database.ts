import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const isDatabaseConnected = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('co2_intensity')
      .select('count')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
};
