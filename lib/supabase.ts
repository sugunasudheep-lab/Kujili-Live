import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Profile = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  phone_number?: string;
  country_code?: string;
  coins: number;
  diamonds: number;
  followers_count: number;
  following_count: number;
  streams_count: number;
  preferred_language?: string;
  location_city?: string;
  location_state?: string;
  created_at: string;
  updated_at: string;
};

export type Stream = {
  id: string;
  user_id: string;
  category_id?: string;
  title: string;
  description?: string;
  language: string;
  thumbnail_url?: string;
  stream_url?: string;
  is_live: boolean;
  viewer_count: number;
  peak_viewers: number;
  total_gifts_received: number;
  location_city?: string;
  location_state?: string;
  started_at: string;
  ended_at?: string;
  created_at: string;
  profiles?: Profile;
};

export type Short = {
  id: string;
  user_id: string;
  video_url: string;
  thumbnail_url?: string;
  title?: string;
  description?: string;
  language: string;
  duration?: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  is_featured: boolean;
  location_city?: string;
  location_state?: string;
  created_at: string;
  profiles?: Profile;
  is_liked?: boolean;
};

export type Category = {
  id: string;
  name: string;
  name_hi?: string;
  name_ta?: string;
  name_te?: string;
  icon?: string;
  sort_order: number;
  is_indian_regional: boolean;
  created_at: string;
};

export type Gift = {
  id: string;
  name: string;
  name_hi?: string;
  name_ta?: string;
  name_te?: string;
  icon: string;
  coin_cost: number;
  diamond_value: number;
  inr_equivalent?: number;
  sort_order: number;
  is_premium: boolean;
  created_at: string;
};

export type CoinPackage = {
  id: string;
  name: string;
  coin_amount: number;
  bonus_coins: number;
  price_usd: number;
  price_inr: number;
  play_store_product_id?: string;
  app_store_product_id?: string;
  is_popular: boolean;
  discount_percentage: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type CoinTransaction = {
  id: string;
  user_id: string;
  transaction_type: 'purchase' | 'gift_sent' | 'gift_received' | 'refund' | 'bonus' | 'stream_income' | 'reward';
  amount: number;
  balance_after: number;
  package_id?: string;
  related_user_id?: string;
  reference_id?: string;
  description?: string;
  metadata?: any;
  created_at: string;
};
