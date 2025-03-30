import { useEffect } from 'react';  // to manage lifecycle methods like useEffect
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env'; // Importing env variables

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;


// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Set to false for mobile apps
  },
});

const useAppStateListener = () => {
  useEffect(() => {
    const handleAppStateChange = (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();  // Starts session refresh when active
      } else {
        supabase.auth.stopAutoRefresh();   // Stops it when app goes inactive
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    // Cleanup listener on unmount to prevent memory leaks
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);
};

export default useAppStateListener;
