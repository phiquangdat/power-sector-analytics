import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Create Supabase client only if credentials are available
export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export const isDatabaseConnected = async (): Promise<boolean> => {
  if (!supabase) {
    console.warn(
      "Supabase client not initialized - missing environment variables"
    );
    return false;
  }
  
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
