import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create a custom hook for any component by wrapping the browser client
export const createServerSupabaseClient = async () => {
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();
  
  return createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  );
}; 