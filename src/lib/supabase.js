import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY

let supabase = null

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables. App running in limited mode.')
} else {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 2
      }
    }
  })
}

export { supabase }
export default supabase