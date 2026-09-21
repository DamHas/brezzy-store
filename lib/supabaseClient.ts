import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vkrwuqfrzjlcgxmvlpnh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrcnd1cWZyempsY2d4bXZscG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MzQzNTMsImV4cCI6MjEwNTQxMDM1M30.m76OWaag3FMg7aLJWSg3EBvExX4vJ1SvIx7Zbb2Jn9Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);