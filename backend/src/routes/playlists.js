// backend/src/routes/playlists.js
import express from 'express';
import { pool } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all playlists (public only)
router.get('/', async (req, res) => {
  try {
    const { sort = '-created_at', limit = 50 } = req.query;
    
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';
    
    const result = await pool.query(
      `SELECT p.id, p.name, p.description, p.created_by, p.cover_image_url,
              p.song_count, p.duration_minutes, p.average_rating, p.total_ratings,
              p.total_listens, p.created_at, u.display_name as creator_name
       FROM playlists p
       LEFT JOIN users u ON p.created_by = u.email
       WHERE p.is_public = true
       ORDER BY ${sortField} ${sortOrder}
       LIMIT $1`,
      [limit]
    );
    
    res.json({ playlists: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Get single playlist with tracks
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get playlist info
    const playlistResult = await pool.query(
      `SELECT p.*, u.display_name as creator_name
       FROM playlists p
       LEFT JOIN users u ON p.created_by = u.email
       WHERE p.id = $1`,
      [id]
    );
    
    if (playlistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    const playlist = playlistResult.rows[0];
    
    // Check if playlist is private and user has access
    if (!playlist.is_public) {
      // For now, only creator can see private playlists
      // Add authentication check here if needed
    }
    
    // Get tracks in playlist
    const tracksResult = await pool.query(
      `SELECT t.*, pt.position, pt.added_at
       FROM tracks t
       JOIN playlist_tracks pt ON t.id = pt.track_id
       WHERE pt.playlist_id = $1
       ORDER BY pt.position`,
      [id]
    );
    
    playlist.tracks = tracksResult.rows;
    
    res.json({ playlist });
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
});

// Create playlist (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, is_public = true, cover_image_url } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required' });
    }
    
    const result = await pool.query(
      `INSERT INTO playlists (name, description, created_by, is_public, cover_image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, req.user.email, is_public, cover_image_url]
    );
    
    res.status(201).json({ 
      message: 'Playlist created successfully',
      playlist: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// Add track to playlist
router.post('/:id/tracks', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { track_id } = req.body;
    
    if (!track_id) {
      return res.status(400).json({ error: 'Track ID is required' });
    }
    
    // Check ownership
    const playlistCheck = await pool.query(
      'SELECT created_by FROM playlists WHERE id = $1',
      [id]
    );
    
    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    if (playlistCheck.rows[0].created_by !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Check if track exists
    const trackCheck = await pool.query(
      'SELECT id FROM tracks WHERE id = $1',
      [track_id]
    );
    
    if (trackCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    // Get next position
    const positionResult = await pool.query(
      'SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM playlist_tracks WHERE playlist_id = $1',
      [id]
    );
    
    const position = positionResult.rows[0].next_position;
    
    // Add track to playlist
    await pool.query(
      `INSERT INTO playlist_tracks (playlist_id, track_id, position)
       VALUES ($1, $2, $3)
       ON CONFLICT (playlist_id, track_id) DO NOTHING`,
      [id, track_id, position]
    );
    
    // Update playlist song count
    await pool.query(
      'UPDATE playlists SET song_count = song_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    
    res.json({ message: 'Track added to playlist' });
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    res.status(500).json({ error: 'Failed to add track to playlist' });
  }
});

// Remove track from playlist
router.delete('/:id/tracks/:trackId', authenticateToken, async (req, res) => {
  try {
    const { id, trackId } = req.params;
    
    // Check ownership
    const playlistCheck = await pool.query(
      'SELECT created_by FROM playlists WHERE id = $1',
      [id]
    );
    
    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    if (playlistCheck.rows[0].created_by !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await pool.query(
      'DELETE FROM playlist_tracks WHERE playlist_id = $1 AND track_id = $2',
      [id, trackId]
    );
    
    // Update playlist song count
    await pool.query(
      'UPDATE playlists SET song_count = GREATEST(song_count - 1, 0), updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    
    res.json({ message: 'Track removed from playlist' });
  } catch (error) {
    console.error('Error removing track from playlist:', error);
    res.status(500).json({ error: 'Failed to remove track' });
  }
});

// Update playlist
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_public, cover_image_url } = req.body;
    
    // Check ownership
    const playlistCheck = await pool.query(
      'SELECT created_by FROM playlists WHERE id = $1',
      [id]
    );
    
    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    if (playlistCheck.rows[0].created_by !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const result = await pool.query(
      `UPDATE playlists
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           is_public = COALESCE($3, is_public),
           cover_image_url = COALESCE($4, cover_image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, description, is_public, cover_image_url, id]
    );
    
    res.json({ 
      message: 'Playlist updated successfully',
      playlist: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ error: 'Failed to update playlist' });
  }
});

// Delete playlist
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const playlistCheck = await pool.query(
      'SELECT created_by FROM playlists WHERE id = $1',
      [id]
    );
    
    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    if (playlistCheck.rows[0].created_by !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await pool.query('DELETE FROM playlists WHERE id = $1', [id]);
    
    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});

// Get user's playlists
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM playlists
       WHERE created_by = $1
       ORDER BY created_at DESC`,
      [email]
    );
    
    res.json({ playlists: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

export default router;