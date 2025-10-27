// backend/src/routes/users.js
import express from 'express';
import { pool } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile (public)
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const result = await pool.query(
      `SELECT email, display_name, artist_name, bio, location, website,
              artist_image_url, account_type, is_verified, created_at
       FROM users
       WHERE email = $1`,
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile (requires authentication)
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const {
      display_name,
      artist_name,
      bio,
      location,
      website,
      artist_image_url
    } = req.body;
    
    const result = await pool.query(
      `UPDATE users
       SET display_name = COALESCE($1, display_name),
           artist_name = COALESCE($2, artist_name),
           bio = COALESCE($3, bio),
           location = COALESCE($4, location),
           website = COALESCE($5, website),
           artist_image_url = COALESCE($6, artist_image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE email = $7
       RETURNING email, display_name, artist_name, bio, location, website,
                 artist_image_url, account_type, is_verified, created_at`,
      [display_name, artist_name, bio, location, website, artist_image_url, req.user.email]
    );
    
    res.json({ 
      message: 'Profile updated successfully',
      user: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user's uploaded tracks
router.get('/:email/tracks', async (req, res) => {
  try {
    const { email } = req.params;
    
    const result = await pool.query(
      `SELECT id, title, audio_url, cover_art_url, genre,
              total_votes, average_rating, total_listens, created_at
       FROM tracks
       WHERE artist_email = $1
       ORDER BY created_at DESC`,
      [email]
    );
    
    res.json({ tracks: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching user tracks:', error);
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

// Get user's playlists
router.get('/:email/playlists', async (req, res) => {
  try {
    const { email } = req.params;
    
    const result = await pool.query(
      `SELECT id, name, description, cover_image_url, song_count,
              duration_minutes, average_rating, total_ratings,
              total_listens, is_public, created_at
       FROM playlists
       WHERE created_by = $1 AND is_public = true
       ORDER BY created_at DESC`,
      [email]
    );
    
    res.json({ playlists: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Search users
router.get('/', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const result = await pool.query(
      `SELECT email, display_name, artist_name, bio, artist_image_url,
              account_type, is_verified
       FROM users
       WHERE display_name ILIKE $1 OR artist_name ILIKE $1 OR email ILIKE $1
       LIMIT $2`,
      [`%${q}%`, limit]
    );
    
    res.json({ users: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

export default router;