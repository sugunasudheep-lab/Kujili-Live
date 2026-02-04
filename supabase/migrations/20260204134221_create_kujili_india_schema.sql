/*
  # Kujili India - Complete Database Schema
  
  1. New Tables
    - `profiles` - User profiles with Indian phone support
    - `categories` - Content categories including Indian regional content
    - `streams` - Live streaming sessions
    - `stream_messages` - Real-time chat for streams
    - `shorts` - Short-form videos with Indian language support
    - `shorts_likes` - Like tracking for shorts
    - `shorts_comments` - Comments on shorts
    - `follows` - Social following system
    - `gifts` - Virtual gifts with INR pricing
    - `gift_transactions` - Transaction history
    - `notifications` - Push notifications

  2. Indian Features
    - Support for 10+ Indian languages (Hindi, Tamil, Telugu, etc.)
    - INR currency for all monetization
    - Indian phone number format (+91)
    - Indian regional categories (Bollywood, Cricket, etc.)
    - IST timezone support
    - Cultural event categories

  3. Security
    - Enable RLS on all tables
    - Policies for authenticated users
    - Owner-based access control
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table with Indian phone support
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  phone_number text,
  country_code text DEFAULT '+91',
  coins integer DEFAULT 0,
  diamonds integer DEFAULT 0,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  streams_count integer DEFAULT 0,
  preferred_language text DEFAULT 'hi',
  location_city text,
  location_state text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Categories with Indian regional content
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  name_hi text,
  name_ta text,
  name_te text,
  icon text,
  sort_order integer DEFAULT 0,
  is_indian_regional boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Insert Indian categories
INSERT INTO categories (name, name_hi, name_ta, name_te, icon, sort_order, is_indian_regional) VALUES
('Bollywood', 'बॉलीवुड', 'பாலிவுட்', 'బాలీవుడ్', '🎬', 1, true),
('Cricket', 'क्रिकेट', 'கிரிக்கெட்', 'క్రికెట్', '🏏', 2, true),
('Regional Cinema', 'क्षेत्रीय सिनेमा', 'பிராந்திய சினிமா', 'ప్రాంతీయ సినిమా', '🎥', 3, true),
('Bhangra/Folk', 'भांगड़ा/लोक', 'பங்க்ரா/நாட்டுப்புற', 'భంగ్రా/జానపద', '💃', 4, true),
('Classical Music', 'शास्त्रीय संगीत', 'பாரம்பரிய இசை', 'శాస్త్రీయ సంగీతం', '🎻', 5, true),
('Cooking/Food', 'खाना बनाना', 'சமையல்', 'వంట', '🍛', 6, false),
('Gaming', 'गेमिंग', 'விளையாட்டு', 'గేమింగ్', '🎮', 7, false),
('Comedy', 'कॉमेडी', 'நகைச்சுவை', 'కామెడీ', '😂', 8, false),
('Education', 'शिक्षा', 'கல்வி', 'విద్య', '📚', 9, false),
('Fitness', 'फिटनेस', 'உடற்பயிற்சி', 'ఫిట్నెస్', '💪', 10, false),
('Fashion', 'फैशन', 'ஃபேஷன்', 'ఫ్యాషన్', '👗', 11, false),
('Devotional', 'भक्ति', 'பக்தி', 'భక్తి', '🙏', 12, true),
('Festival Celebration', 'त्योहार उत्सव', 'திருவிழா', 'పండుగ', '🎉', 13, true)
ON CONFLICT DO NOTHING;

-- Streams table
CREATE TABLE IF NOT EXISTS streams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id),
  title text NOT NULL,
  description text,
  language text DEFAULT 'hi',
  thumbnail_url text,
  stream_url text,
  is_live boolean DEFAULT true,
  viewer_count integer DEFAULT 0,
  peak_viewers integer DEFAULT 0,
  total_gifts_received integer DEFAULT 0,
  location_city text,
  location_state text,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE streams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view live streams"
  ON streams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own streams"
  ON streams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streams"
  ON streams FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Stream messages (chat)
CREATE TABLE IF NOT EXISTS stream_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id uuid REFERENCES streams(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  gift_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stream_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stream messages"
  ON stream_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can send messages"
  ON stream_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Shorts videos with Indian language support
CREATE TABLE IF NOT EXISTS shorts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  title text,
  description text,
  language text DEFAULT 'hi',
  duration integer,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  location_city text,
  location_state text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shorts"
  ON shorts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own shorts"
  ON shorts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shorts"
  ON shorts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Shorts likes
CREATE TABLE IF NOT EXISTS shorts_likes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_id uuid REFERENCES shorts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(short_id, user_id)
);

ALTER TABLE shorts_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON shorts_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like shorts"
  ON shorts_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike shorts"
  ON shorts_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Shorts comments
CREATE TABLE IF NOT EXISTS shorts_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_id uuid REFERENCES shorts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shorts_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON shorts_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add comments"
  ON shorts_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON shorts_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Follows system
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Gifts with INR pricing
CREATE TABLE IF NOT EXISTS gifts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  name_hi text,
  name_ta text,
  name_te text,
  icon text NOT NULL,
  coin_cost integer NOT NULL,
  diamond_value integer NOT NULL,
  inr_equivalent decimal(10,2),
  sort_order integer DEFAULT 0,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gifts"
  ON gifts FOR SELECT
  TO authenticated
  USING (true);

-- Insert gifts with INR pricing
INSERT INTO gifts (name, name_hi, name_ta, name_te, icon, coin_cost, diamond_value, inr_equivalent, sort_order) VALUES
('Heart', 'दिल', 'இதயம்', 'హృదయం', '❤️', 10, 5, 8.00, 1),
('Rose', 'गुलाब', 'ரோஜா', 'గులాబీ', '🌹', 50, 25, 40.00, 2),
('Diamond', 'हीरा', 'வைரம்', 'వజ్రం', '💎', 100, 50, 80.00, 3),
('Crown', 'मुकुट', 'கிரீடம்', 'కిరీటం', '👑', 500, 250, 400.00, 4),
('Rocket', 'रॉकेट', 'ராக்கெட்', 'రాకెట్', '🚀', 1000, 500, 800.00, 5),
('Castle', 'महल', 'கோட்டை', 'కోట', '🏰', 5000, 2500, 4000.00, 6)
ON CONFLICT DO NOTHING;

-- Gift transactions
CREATE TABLE IF NOT EXISTS gift_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  gift_id uuid REFERENCES gifts(id) NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stream_id uuid REFERENCES streams(id) ON DELETE SET NULL,
  coin_cost integer NOT NULL,
  diamond_value integer NOT NULL,
  inr_amount decimal(10,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gift_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their transactions"
  ON gift_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send gifts"
  ON gift_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  title_hi text,
  body text NOT NULL,
  body_hi text,
  type text NOT NULL,
  reference_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_streams_live ON streams(is_live, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_streams_user ON streams(user_id);
CREATE INDEX IF NOT EXISTS idx_streams_category ON streams(category_id);
CREATE INDEX IF NOT EXISTS idx_shorts_created ON shorts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shorts_user ON shorts(user_id);
CREATE INDEX IF NOT EXISTS idx_shorts_language ON shorts(language);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);

-- Create function to update follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.following_id;
    UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_follower_counts_trigger
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follower_counts();

-- Create function to update like counts
CREATE OR REPLACE FUNCTION update_like_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE shorts SET like_count = like_count + 1 WHERE id = NEW.short_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE shorts SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.short_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_like_counts_trigger
  AFTER INSERT OR DELETE ON shorts_likes
  FOR EACH ROW EXECUTE FUNCTION update_like_counts();

-- Create function to update comment counts
CREATE OR REPLACE FUNCTION update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE shorts SET comment_count = comment_count + 1 WHERE id = NEW.short_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE shorts SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.short_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comment_counts_trigger
  AFTER INSERT OR DELETE ON shorts_comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_counts();