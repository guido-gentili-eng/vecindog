import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL  = 'https://ptjyvhiimvmknzpcbzih.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0anl2aGlpbXZta256cGNiemloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzMxMjcsImV4cCI6MjA1NzkwOTEyN30.kMkmDNJygByV2BN2mAIKyPjlH2IjE-7-mSdaMnBZCEI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage:          AsyncStorage,
    autoRefreshToken: true,
    persistSession:   true,
    detectSessionInUrl: false,
  },
});
