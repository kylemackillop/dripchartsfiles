-- DripCharts PostgreSQL Database Schema

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  artist_name VARCHAR(100),
  bio TEXT,
  location VARCHAR(100),
  website VARCHAR(255),
  artist_image_url TEXT,
  account_type VARCHAR(20) DEFAULT 'free', -- 'free', 'premium', 'artist'
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks table
CREATE TABLE tracks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist_name VARCHAR(255) NOT NULL,
  artist_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  cover_art_url TEXT,
  genre VARCHAR(50),
  duration_seconds INTEGER,
  release_date DATE,
  lyrics TEXT,
  description TEXT,
  total_votes INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_listens INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Playlists table
CREATE TABLE playlists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  cover_image_url TEXT,
  song_count INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  total_listens INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Playlist tracks (junction table)
CREATE TABLE playlist_tracks (
  id SERIAL PRIMARY KEY,
  playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
  track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
  position INTEGER,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(playlist_id, track_id)
);

-- Votes/Ratings table
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
  voter_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(track_id, voter_email)
);

-- Playlist ratings
CREATE TABLE playlist_ratings (
  id SERIAL PRIMARY KEY,
  playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
  voter_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(playlist_id, voter_email)
);

-- Notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User follows (for following artists/users)
CREATE TABLE follows (
  id SERIAL PRIMARY KEY,
  follower_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  following_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_email, following_email)
);

-- Listening history
CREATE TABLE listen_history (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
  listened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_tracks_artist ON tracks(artist_email);
CREATE INDEX idx_tracks_genre ON tracks(genre);
CREATE INDEX idx_playlists_creator ON playlists(created_by);
CREATE INDEX idx_votes_track ON votes(track_id);
CREATE INDEX idx_votes_user ON votes(voter_email);
CREATE INDEX idx_playlist_tracks_playlist ON playlist_tracks(playlist_id);
CREATE INDEX idx_notifications_user ON notifications(user_email);
CREATE INDEX idx_follows_follower ON follows(follower_email);
CREATE INDEX idx_follows_following ON follows(following_email);