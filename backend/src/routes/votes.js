// backend/src/routes/votes.js
import express from 'express';
import { pool } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's vote for a track
router.get('/track/:trackId', authenticateToken, async (req, res) => {
  try {
    const { trackId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM votes WHERE track_id = $1 AND voter_email = $2',
      [trackId, req.user.email]
    );
    
    if (result.rows.length === 0) {
      return res.json({ vote: null });
    }
    
    res.json({ vote: result.rows[0] });
  } catch (error) {
    console.error('Error fetching vote:', error);
    res.status(500).json({ error: 'Failed to fetch vote' });
  }
});

// Vote/Rate a track
router.post('/track/:trackId', authenticateToken, async (req, res) => {
  try {
    const { trackId } = req.params;
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Check if track exists
    const trackCheck = await pool.query(
      'SELECT id FROM tracks WHERE id = $1',
      [trackId]
    );
    
    if (trackCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    // Insert or update vote
    const voteResult = await pool.query(
      `INSERT INTO votes (track_id, voter_email, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (track_id, voter_email)
       DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [trackId, req.user.email, rating]
    );
    
    // Recalculate track statistics
    const statsResult = await pool.query(
      `SELECT COUNT(*) as total_votes, AVG(rating) as average_rating
       FROM votes
       WHERE track_id = $1`,
      [trackId]
    );
    
    const { total_votes, average_rating } = statsResult.rows[0];
    
    // Update track
    await pool.query(
      `UPDATE tracks
       SET total_votes = $1, average_rating = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [total_votes, average_rating, trackId]
    );
    
    res.json({ 
      message: 'Vote recorded successfully',
      vote: voteResult.rows[0],
      stats: { total_votes, average_rating }
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// Delete vote
router.delete('/track/:trackId', authenticateToken, async (req, res) => {
  try {
    const { trackId } = req.params;
    
    await pool.query(
      'DELETE FROM votes WHERE track_id = $1 AND voter_email = $2',
      [trackId, req.user.email]
    );
    
    // Recalculate track statistics
    const statsResult = await pool.query(
      `SELECT COUNT(*) as total_votes, COALESCE(AVG(rating), 0) as average_rating
       FROM votes
       WHERE track_id = $1`,
      [trackId]
    );
    
    const { total_votes, average_rating } = statsResult.rows[0];
    
    await pool.query(
      `UPDATE tracks
       SET total_votes = $1, average_rating = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [total_votes, average_rating, trackId]
    );
    
    res.json({ message: 'Vote removed successfully' });
  } catch (error) {
    console.error('Error deleting vote:', error);
    res.status(500).json({ error: 'Failed to delete vote' });
  }
});

// Get all votes by a user
router.get('/user/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT v.*, t.title, t.artist_name, t.cover_art_url
       FROM votes v
       JOIN tracks t ON v.track_id = t.id
       WHERE v.voter_email = $1
       ORDER BY v.created_at DESC`,
      [req.user.email]
    );
    
    res.json({ votes: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching user votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// Rate a playlist
router.post('/playlist/:playlistId', authenticateToken, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Insert or update rating
    await pool.query(
      `INSERT INTO playlist_ratings (playlist_id, voter_email, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (playlist_id, voter_email)
       DO UPDATE SET rating = $3, created_at = CURRENT_TIMESTAMP`,
      [playlistId, req.user.email, rating]
    );
    
    // Recalculate playlist statistics
    const statsResult = await pool.query(
      `SELECT COUNT(*) as total_ratings, AVG(rating) as average_rating
       FROM playlist_ratings
       WHERE playlist_id = $1`,
      [playlistId]
    );
    
    const { total_ratings, average_rating } = statsResult.rows[0];
    
    // Update playlist
    await pool.query(
      `UPDATE playlists
       SET total_ratings = $1, average_rating = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [total_ratings, average_rating, playlistId]
    );
    
    res.json({ 
      message: 'Playlist rated successfully',
      stats: { total_ratings, average_rating }
    });
  } catch (error) {
    console.error('Error rating playlist:', error);
    res.status(500).json({ error: 'Failed to rate playlist' });
  }
});

export default router;