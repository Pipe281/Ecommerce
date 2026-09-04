import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import type { Database } from '../types/database.types';

export const supabase = createClient<Database>(
  environment.SUPABASE_URL,
  environment.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
