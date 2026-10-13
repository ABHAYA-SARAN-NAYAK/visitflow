-- VISIT FLOW Database Schema
-- PostgreSQL

-- ===========================
-- USERS
-- ===========================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  auth_provider VARCHAR(20) DEFAULT 'email', -- email, google, phone
  explorer_points INTEGER DEFAULT 0,
  total_checkins INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- PLACES
-- ===========================
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(150) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(50) DEFAULT 'India',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  category TEXT[] NOT NULL, -- {Temple, Fort, Monument}
  emoji VARCHAR(10),
  image_url TEXT,
  gallery_urls TEXT[],
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  entry_fee_indian INTEGER DEFAULT 0,
  entry_fee_foreign INTEGER DEFAULT 0,
  opening_time VARCHAR(10),
  closing_time VARCHAR(10),
  best_visit_window VARCHAR(50),
  best_visit_confidence INTEGER,
  hidden_gem_score INTEGER DEFAULT 0,
  accessibility_wheelchair BOOLEAN DEFAULT false,
  accessibility_audio BOOLEAN DEFAULT false,
  accessibility_braille BOOLEAN DEFAULT false,
  photography_allowed BOOLEAN DEFAULT true,
  dress_code VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_places_slug ON places(slug);
CREATE INDEX idx_places_city ON places(city);
CREATE INDEX idx_places_category ON places USING GIN(category);

-- ===========================
-- CROWD READINGS (Time-series)
-- ===========================
CREATE TABLE crowd_readings (
  id BIGSERIAL PRIMARY KEY,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  crowd_percentage INTEGER NOT NULL CHECK (crowd_percentage BETWEEN 0 AND 100),
  crowd_level VARCHAR(20) NOT NULL, -- low, moderate, high, critical
  visitor_count INTEGER,
  wait_time_mins INTEGER,
  parking_free_spaces INTEGER,
  data_source VARCHAR(50), -- sensor, satellite, mobile, manual
  confidence DECIMAL(5, 2),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crowd_place_time ON crowd_readings(place_id, recorded_at DESC);

-- ===========================
-- CROWD PREDICTIONS
-- ===========================
CREATE TABLE crowd_predictions (
  id BIGSERIAL PRIMARY KEY,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  predicted_for TIMESTAMPTZ NOT NULL,
  predicted_pct INTEGER NOT NULL,
  predicted_level VARCHAR(20) NOT NULL,
  confidence DECIMAL(5, 2),
  model_version VARCHAR(20),
  factors JSONB, -- {"weather": 15, "holiday": 30, "event": -5}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_predictions_place ON crowd_predictions(place_id, predicted_for);

-- ===========================
-- CROWD ALERTS
-- ===========================
CREATE TABLE crowd_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  threshold INTEGER NOT NULL CHECK (threshold BETWEEN 5 AND 95),
  channels TEXT[] NOT NULL, -- {push, email, whatsapp, sms}
  visit_date DATE,
  time_window VARCHAR(20), -- morning, afternoon, evening, any
  active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_user ON crowd_alerts(user_id);
CREATE INDEX idx_alerts_active ON crowd_alerts(active) WHERE active = true;

-- ===========================
-- ITINERARIES
-- ===========================
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  start_date DATE,
  end_date DATE,
  group_size INTEGER DEFAULT 1,
  travel_style VARCHAR(20) DEFAULT 'balanced', -- relaxed, balanced, packed
  total_cost INTEGER DEFAULT 0,
  crowd_optimized BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title VARCHAR(200),
  notes TEXT
);

CREATE TABLE itinerary_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID REFERENCES itinerary_days(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id),
  stop_order INTEGER NOT NULL,
  scheduled_time TIME,
  duration_mins INTEGER,
  predicted_crowd_pct INTEGER,
  notes TEXT
);

-- ===========================
-- COMMUNITY CHECK-INS
-- ===========================
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  crowd_level VARCHAR(20) NOT NULL,
  crowd_estimate INTEGER,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  photo_urls TEXT[],
  is_verified BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checkins_place ON checkins(place_id, checked_in_at DESC);
CREATE INDEX idx_checkins_user ON checkins(user_id);

-- ===========================
-- REVIEWS
-- ===========================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  body TEXT,
  visit_date DATE,
  crowd_level_experienced VARCHAR(20),
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- SAVED PLACES
-- ===========================
CREATE TABLE saved_places (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, place_id)
);

-- ===========================
-- BADGES
-- ===========================
CREATE TABLE badges (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  description TEXT,
  criteria JSONB -- {"type": "checkin_count", "category": "temple", "count": 5}
);

CREATE TABLE user_badges (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id VARCHAR(50) REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- ===========================
-- CHAT CONVERSATIONS
-- ===========================
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL, -- user, assistant
  content TEXT NOT NULL,
  metadata JSONB, -- quick actions, referenced places, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- EVENTS (affecting crowd)
-- ===========================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  expected_crowd_impact INTEGER, -- percentage increase
  category VARCHAR(50), -- festival, holiday, special_event
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- SEED DATA: Badges
-- ===========================
INSERT INTO badges (id, name, emoji, description, criteria) VALUES
  ('early-bird', 'Early Bird', '🌅', 'Visited 3 places before 8 AM', '{"type": "time_visit", "before": "08:00", "count": 3}'),
  ('crowd-dodger', 'Crowd Dodger', '🥷', 'Visited 5 places during LOW crowd', '{"type": "crowd_level", "level": "low", "count": 5}'),
  ('explorer', 'Explorer', '🧭', 'Visited 10 different destinations', '{"type": "unique_places", "count": 10}'),
  ('heritage-lover', 'Heritage Lover', '🏰', 'Visited 5 forts or palaces', '{"type": "category_visit", "category": ["Fort", "Palace"], "count": 5}'),
  ('temple-trail', 'Temple Trail', '🛕', 'Visited 5 temples', '{"type": "category_visit", "category": ["Temple"], "count": 5}'),
  ('beach-bum', 'Beach Bum', '🏖️', 'Visited 3 beaches', '{"type": "category_visit", "category": ["Beach"], "count": 3}'),
  ('night-owl', 'Night Owl', '🦉', 'Visited 3 places after 6 PM', '{"type": "time_visit", "after": "18:00", "count": 3}'),
  ('weekend-warrior', 'Weekend Warrior', '⚔️', '10 weekend check-ins', '{"type": "day_visit", "days": ["Saturday", "Sunday"], "count": 10}');
