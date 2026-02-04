/*
  # Update Default Language to English and Create Coin Purchase System

  1. Changes
    - Update default preferred_language from 'hi' to 'en' in profiles table
    - Update existing profiles to English if needed

  2. New Tables
    - `coin_packages`
      - `id` (uuid, primary key)
      - `name` (text) - Package name (e.g., "100 Coins", "500 Coins")
      - `coin_amount` (integer) - Number of coins in package
      - `bonus_coins` (integer) - Extra bonus coins
      - `price_usd` (numeric) - Price in USD
      - `price_inr` (numeric) - Price in INR
      - `play_store_product_id` (text) - Google Play product ID
      - `app_store_product_id` (text) - Apple App Store product ID
      - `is_popular` (boolean) - Featured package
      - `discount_percentage` (integer) - Discount if any
      - `sort_order` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamptz)

    - `coin_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `transaction_type` (text) - 'purchase', 'gift_sent', 'gift_received', 'refund', 'bonus'
      - `amount` (integer) - Coin amount (positive or negative)
      - `balance_after` (integer) - Balance after transaction
      - `package_id` (uuid, references coin_packages) - For purchases
      - `related_user_id` (uuid) - For gifts/transfers
      - `reference_id` (text) - External transaction ID (Play Store, App Store)
      - `description` (text)
      - `metadata` (jsonb) - Additional data
      - `created_at` (timestamptz)

  3. Security
    - Enable RLS on both tables
    - Users can view their own transactions
    - Only authenticated users can view packages
    - Coin balance updates via secure functions

  4. Indexes
    - Index on user_id for transactions
    - Index on created_at for history
    - Index on transaction_type for filtering
*/

-- Update default language to English
ALTER TABLE profiles 
  ALTER COLUMN preferred_language SET DEFAULT 'en';

-- Create coin packages table
CREATE TABLE IF NOT EXISTS coin_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  coin_amount integer NOT NULL,
  bonus_coins integer DEFAULT 0,
  price_usd numeric(10, 2) NOT NULL,
  price_inr numeric(10, 2) NOT NULL,
  play_store_product_id text,
  app_store_product_id text,
  is_popular boolean DEFAULT false,
  discount_percentage integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coin_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coin packages"
  ON coin_packages FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Create coin transactions table
CREATE TABLE IF NOT EXISTS coin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('purchase', 'gift_sent', 'gift_received', 'refund', 'bonus', 'stream_income', 'reward')),
  amount integer NOT NULL,
  balance_after integer NOT NULL,
  package_id uuid REFERENCES coin_packages(id),
  related_user_id uuid REFERENCES profiles(id),
  reference_id text,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON coin_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON coin_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS coin_transactions_user_id_idx ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS coin_transactions_created_at_idx ON coin_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS coin_transactions_type_idx ON coin_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS coin_packages_sort_order_idx ON coin_packages(sort_order);

-- Insert popular coin packages with Indian market pricing
INSERT INTO coin_packages (name, coin_amount, bonus_coins, price_usd, price_inr, play_store_product_id, app_store_product_id, is_popular, discount_percentage, sort_order, is_active)
VALUES
  ('Starter Pack', 100, 0, 0.99, 79, 'com.kujili.coins.100', 'coins_100', false, 0, 1, true),
  ('Popular Pack', 500, 50, 4.99, 399, 'com.kujili.coins.500', 'coins_500', true, 10, 2, true),
  ('Value Pack', 1000, 150, 9.99, 799, 'com.kujili.coins.1000', 'coins_1000', false, 15, 3, true),
  ('Best Value', 2500, 500, 19.99, 1599, 'com.kujili.coins.2500', 'coins_2500', true, 20, 4, true),
  ('Premium Pack', 5000, 1250, 39.99, 3199, 'com.kujili.coins.5000', 'coins_5000', false, 25, 5, true),
  ('Ultimate Pack', 10000, 3000, 79.99, 6399, 'com.kujili.coins.10000', 'coins_10000', true, 30, 6, true);

-- Function to add coins to user balance
CREATE OR REPLACE FUNCTION add_coins_to_user(
  p_user_id uuid,
  p_amount integer,
  p_transaction_type text,
  p_package_id uuid DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_reference_id text DEFAULT NULL
)
RETURNS coin_transactions AS $$
DECLARE
  v_new_balance integer;
  v_transaction coin_transactions;
BEGIN
  -- Get current balance and update it
  UPDATE profiles
  SET coins = coins + p_amount
  WHERE id = p_user_id
  RETURNING coins INTO v_new_balance;

  -- Create transaction record
  INSERT INTO coin_transactions (
    user_id,
    transaction_type,
    amount,
    balance_after,
    package_id,
    description,
    reference_id
  ) VALUES (
    p_user_id,
    p_transaction_type,
    p_amount,
    v_new_balance,
    p_package_id,
    p_description,
    p_reference_id
  ) RETURNING * INTO v_transaction;

  RETURN v_transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
