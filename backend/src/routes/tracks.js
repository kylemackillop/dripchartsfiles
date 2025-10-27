// backend/src/routes/tracks.js
import express from 'express';
import { pool } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all tracks (public)
router.get('/', async (req, res) => {
  try {
    const { genre, sort = '-created_at', limit = 50 } = req.query;
    
    let query = `
      SELECT id, title, artist_name, artist_email, audio_url, cover_art_url,
             genre, duration_seconds, release_date, description,
             total_votes, average_rating, total_listens, created_at
      FROM tracks
      WHERE 1=1
    `;
    
    const params = [];
    
    if (genre) {
      params.push(genre);
      query += ` AND genre = $${params.length}`;
    }
    
    // Handle sorting
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;
    
    query += ` LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const result = await pool.query(query, params);
    
    res.json({ tracks: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

// Get single track by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT id, title, artist_name, artist_email, audio_url, cover_art_url,
              genre, duration_seconds, release_date, lyrics, description,
              total_votes, average_rating, total_listens, created_at, updated_at
       FROM tracks
       WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    res.json({ track: result.rows[0] });
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({ error: 'Failed to fetch track' });
  }
});

// Create new track (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      artist_name,
      audio_url,
      cover_art_url,
      genre,
      duration_seconds,
      release_date,
      lyrics,
      description
    } = req.body;
    
    if (!title || !artist_name || !audio_url) {
      return res.status(400).json({ 
        error: 'Title, artist name, and audio URL are required' 
      });
    }
    
    const result = await pool.query(
      `INSERT INTO tracks 
       (title, artist_name, artist_email, audio_url, cover_art_url, genre,
        duration_seconds, release_date, lyrics, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        title,
        artist_name,
        req.user.email,
        audio_url,
        cover_art_url || null,
        genre || null,
        duration_seconds || null,
        release_date || null,
        lyrics || null,
        description || null
      ]
    );
    
    res.status(201).json({ 
      message: 'Track created successfully',
      track: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creating track:', error);
    res.status(500).json({ error: 'Failed to create track' });
  }
});

// Update track (requires authentication and ownership)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if track exists and user owns it
    const trackCheck = await pool.query(
      'SELECT artist_email FROM tracks WHERE id = $1',
      [id]
    );
    
    if (trackCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    if (trackCheck.rows[0].artist_email !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to update this track' });
    }
    
    const {
      title,
      audio_url,
      cover_art_url,
      genre,
      duration_seconds,
      release_date,
      lyrics,
      description
    } = req.body;
    
    const result = await pool.query(
      `UPDATE tracks
       SET title = COALESCE($1, title),
           audio_url = COALESCE($2, audio_url),
           cover_art_url = COALESCE($3, cover_art_url),
           genre = COALESCE($4, genre),
           duration_seconds = COALESCE($5, duration_seconds),
           release_date = COALESCE($6, release_date),
           lyrics = COALESCE($7, lyrics),
           description = COALESCE($8, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [title, audio_url, cover_art_url, genre, duration_seconds, 
       release_date, lyrics, description, id]
    );
    
    res.json({ 
      message: 'Track updated successfully',
      track: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating track:', error);
    res.status(500).json({ error: 'Failed to update track' });
  }
});

// Delete track (requires authentication and ownership)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const trackCheck = await pool.query(
      'SELECT artist_email FROM tracks WHERE id = $1',
      [id]
    );
    
    if (trackCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    if (trackCheck.rows[0].artist_email !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to delete this track' });
    }
    
    await pool.query('DELETE FROM tracks WHERE id = $1', [id]);
    
    res.json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Error deleting track:', error);
    res.status(500).json({ error: 'Failed to delete track' });
  }
});

// Increment listen count
router.post('/:id/listen', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(
      'UPDATE tracks SET total_listens = total_listens + 1 WHERE id = $1',
      [id]
    );
    
    res.json({ message: 'Listen count updated' });
  } catch (error) {
    console.error('Error updating listen count:', error);
    res.status(500).json({ error: 'Failed to update listen count' });
  }
});

// Get tracks by artist
router.get('/artist/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const result = await pool.query(
      `SELECT id, title, artist_name, audio_url, cover_art_url, genre,
              duration_seconds, total_votes, average_rating, total_listens, created_at
       FROM tracks
       WHERE artist_email = $1
       ORDER BY created_at DESC`,
      [email]
    );
    
    res.json({ tracks: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching artist tracks:', error);
    res.status(500).json({ error: 'Failed to fetch artist tracks' });
  }
});

export default router;