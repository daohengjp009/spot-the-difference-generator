-- Database initialization script for Spot the Difference Generator
-- Run this script with: psql -d spot_the_difference -f db/init.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
);

-- Puzzles table
CREATE TABLE IF NOT EXISTS puzzles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  original_image_url TEXT NOT NULL,
  modified_image_url TEXT NOT NULL,
  answer_image_url TEXT,
  differences JSONB NOT NULL,
  seed VARCHAR(255) UNIQUE NOT NULL,
  difference_count INTEGER NOT NULL,
  generation_time INTEGER NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_theme (theme),
  INDEX idx_difficulty (difficulty),
  INDEX idx_seed (seed),
  INDEX idx_created_by (created_by),
  INDEX idx_created_at (created_at)
);

-- Saved puzzles (user's favorites)
CREATE TABLE IF NOT EXISTS saved_puzzles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  puzzle_id UUID NOT NULL REFERENCES puzzles(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_puzzle (user_id, puzzle_id),
  INDEX idx_user_id (user_id),
  INDEX idx_puzzle_id (puzzle_id),
  INDEX idx_saved_at (saved_at)
);

-- Puzzle attempts (for leaderboard)
CREATE TABLE IF NOT EXISTS puzzle_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  puzzle_id UUID NOT NULL REFERENCES puzzles(id) ON DELETE CASCADE,
  found_count INTEGER NOT NULL,
  total_count INTEGER NOT NULL,
  time_spent_seconds INTEGER,
  is_completed BOOLEAN DEFAULT false,
  score INTEGER,
  attempt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_puzzle_id (puzzle_id),
  INDEX idx_is_completed (is_completed),
  INDEX idx_score (score),
  INDEX idx_attempt_at (attempt_at)
);

-- Daily challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  puzzle_id UUID NOT NULL REFERENCES puzzles(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL UNIQUE,
  difficulty VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_challenge_date (challenge_date)
);

-- User statistics
CREATE TABLE IF NOT EXISTS user_statistics (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_puzzles_solved INTEGER DEFAULT 0,
  total_time_spent_seconds INTEGER DEFAULT 0,
  average_solve_time_seconds INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_played_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard view (materialized for performance)
CREATE VIEW leaderboard AS
SELECT 
  u.id,
  u.username,
  COUNT(DISTINCT pa.puzzle_id) as puzzles_completed,
  SUM(CASE WHEN pa.is_completed THEN 1 ELSE 0 END) as successful_attempts,
  AVG(pa.score) as average_score,
  MAX(pa.attempt_at) as last_played_at
FROM users u
LEFT JOIN puzzle_attempts pa ON u.id = pa.user_id
WHERE pa.is_completed = true
GROUP BY u.id, u.username
ORDER BY average_score DESC, puzzles_completed DESC;

-- Theme statistics view
CREATE VIEW theme_statistics AS
SELECT 
  theme,
  difficulty,
  COUNT(*) as total_puzzles,
  AVG(difference_count) as avg_differences,
  AVG(generation_time) as avg_gen_time,
  COUNT(DISTINCT created_by) as unique_creators,
  SUM(view_count) as total_views
FROM puzzles
GROUP BY theme, difficulty;

-- Create indexes for common queries
CREATE INDEX idx_puzzle_theme_difficulty ON puzzles(theme, difficulty);
CREATE INDEX idx_puzzle_created_by_created_at ON puzzles(created_by, created_at);
CREATE INDEX idx_attempt_user_completed ON puzzle_attempts(user_id, is_completed);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_users_timestamp 
BEFORE UPDATE ON users
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER update_puzzles_timestamp 
BEFORE UPDATE ON puzzles
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;

-- Function to auto-update view count
CREATE FUNCTION increment_puzzle_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE puzzles SET view_count = view_count + 1 WHERE id = NEW.puzzle_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_views
AFTER INSERT ON puzzle_attempts
FOR EACH ROW
EXECUTE FUNCTION increment_puzzle_views();

-- Sample data
INSERT INTO users (email, username) VALUES
  ('demo@example.com', 'DemoUser'),
  ('teacher@example.com', 'Teacher123'),
  ('parent@example.com', 'Parent456')
ON CONFLICT DO NOTHING;

-- Grant permissions (adjust as needed)
GRANT SELECT, INSERT, UPDATE, DELETE ON all tables IN SCHEMA public TO app_user;
GRANT SELECT ON all views IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON all sequences IN SCHEMA public TO app_user;
