import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'https://abcdefghijklmonpqrst.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
