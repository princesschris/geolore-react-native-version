// ─────────────────────────────────────────────────────────────────────────────
//  config/supabase.ts
//
//  HOW TO FILL THIS IN:
//    1. Go to supabase.com → your project dashboard
//    2. Click Settings (gear icon) → API
//    3. Copy "Project URL" → paste as SUPABASE_URL
//    4. Copy "anon / public" key → paste as SUPABASE_ANON_KEY
// ─────────────────────────────────────────────────────────────────────────────

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = 'https://ypoumpucjsauimirpoil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwb3VtcHVjanNhdWltaXJwb2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjMwOTcsImV4cCI6MjA5NDgzOTA5N30.LyF2elLk8cnBsGDA_Y0LLaB8weOJC7Vn-4sISO6FufQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage:          AsyncStorage,  
    autoRefreshToken: true,
    persistSession:   true,
    etectSessionInUrl: false,        // required for React Native
  },
});