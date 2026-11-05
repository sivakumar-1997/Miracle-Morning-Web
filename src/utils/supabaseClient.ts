import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL_KEY = 'morning_miracles_sb_url';
export const SUPABASE_KEY_KEY = 'morning_miracles_sb_key';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseCredentials(): { url: string; key: string; isConfigured: boolean } {
  // Check window/env or localStorage
  const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem(SUPABASE_URL_KEY) || '' : '';
  const storedKey = typeof localStorage !== 'undefined' ? localStorage.getItem(SUPABASE_KEY_KEY) || '' : '';

  const url = storedUrl || envUrl;
  const key = storedKey || envKey;
  const isConfigured = Boolean(url && key && url.startsWith('http'));

  return { url, key, isConfigured };
}

export function saveSupabaseCredentials(url: string, key: string): void {
  try {
    localStorage.setItem(SUPABASE_URL_KEY, url.trim());
    localStorage.setItem(SUPABASE_KEY_KEY, key.trim());
    cachedClient = null; // reset cached instance
  } catch (e) {
    console.error('Failed to save Supabase credentials', e);
  }
}

export function getSupabase(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { url, key, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    return cachedClient;
  } catch (err) {
    console.warn('Could not initialize Supabase client:', err);
    return null;
  }
}

/**
 * SQL Schema migration ready to copy-paste into Supabase SQL Editor
 */
export const SUPABASE_SCHEMA_SQL = `-- Miracle Mornings Supabase Database Schema
-- Run this script inside your Supabase project's SQL Editor

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.miracle_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT DEFAULT 'Conscious Seeker',
  current_streak INTEGER DEFAULT 1,
  longest_streak INTEGER DEFAULT 1,
  magic_day_number INTEGER DEFAULT 1,
  last_active_date DATE,
  start_date DATE DEFAULT CURRENT_DATE,
  total_days_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create daily practice records table
CREATE TABLE IF NOT EXISTS public.miracle_daily_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  morning_completed BOOLEAN DEFAULT false,
  evening_completed BOOLEAN DEFAULT false,
  chakras_cleanse_seconds INTEGER DEFAULT 0,
  hooponopono_count INTEGER DEFAULT 0,
  water_sips_count INTEGER DEFAULT 0,
  blessings_count INTEGER DEFAULT 0,
  magic_rock_reflection TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, date)
);

-- 3. Create blessings table
CREATE TABLE IF NOT EXISTS public.miracle_blessings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  topic TEXT NOT NULL,
  reason TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.miracle_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.miracle_daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.miracle_blessings ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for secure user data
CREATE POLICY "Users can view own profile" 
ON public.miracle_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.miracle_profiles FOR ALL 
USING (auth.uid() = id);

CREATE POLICY "Users can manage own records" 
ON public.miracle_daily_records FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own blessings" 
ON public.miracle_blessings FOR ALL 
USING (auth.uid() = user_id);
`;
