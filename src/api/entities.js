// src/api/entities.js
// This file provides the same interface as before, but now uses Railway backend
import api from './apiService';

// ==================== TRACK ENTITY ====================
export const Track = {
  list: async (filters = {}) => {
    const response = await api.tracks.list(filters);
    // Railway returns { tracks: [...], count: 0 }, extract just the array
    return response.tracks || response;
  },
  
  get: async (id) => {
    return await api.tracks.get(id);
  },
  
  create: async (trackData) => {
    return await api.tracks.create(trackData);
  },
  
  update: async (id, trackData) => {
    return await api.tracks.update(id, trackData);
  },
  
  delete: async (id) => {
    return await api.tracks.delete(id);
  },
  
  // Alias methods to match Base44 style
  findMany: async (filters) => {
    const response = await api.tracks.list(filters);
    return response.tracks || response;
  },
  
  findOne: async (id) => {
    return await api.tracks.get(id);
  },
};

// ==================== PLAYLIST ENTITY ====================
export const Playlist = {
list: async (filters = {}) => {
  const response = await api.playlists.list(filters);
  return response.playlists || response;
},
  
  get: async (id) => {
    return await api.playlists.get(id);
  },
  
  create: async (playlistData) => {
    return await api.playlists.create(playlistData);
  },
  
  update: async (id, playlistData) => {
    return await api.playlists.update(id, playlistData);
  },
  
  delete: async (id) => {
    return await api.playlists.delete(id);
  },
  
  findMany: async (filters) => {
    return await api.playlists.list(filters);
  },
  
  findOne: async (id) => {
    return await api.playlists.get(id);
  },
};

// ==================== PLAYLIST TRACK ENTITY ====================
export const PlaylistTrack = {
  add: async (playlistId, trackId) => {
    return await api.playlists.addTrack(playlistId, trackId);
  },
  
  remove: async (playlistId, trackId) => {
    return await api.playlists.removeTrack(playlistId, trackId);
  },
  
  // For compatibility with Base44 style
  create: async ({ playlist_id, track_id }) => {
    return await api.playlists.addTrack(playlist_id, track_id);
  },
  
  delete: async ({ playlist_id, track_id }) => {
    return await api.playlists.removeTrack(playlist_id, track_id);
  },
};

// ==================== VOTE ENTITY ====================
export const Vote = {
  create: async ({ item_type, item_id, value }) => {
    return await api.votes.vote(item_type, item_id, value);
  },
  
  getVotes: async (itemType, itemId) => {
    return await api.votes.getVotes(itemType, itemId);
  },
  
  getUserVote: async (itemType, itemId) => {
    return await api.votes.getUserVote(itemType, itemId);
  },
  
  // Alias for compatibility
  vote: async (itemType, itemId, value) => {
    return await api.votes.vote(itemType, itemId, value);
  },
};

// ==================== USER / AUTH ENTITY ====================
export const User = {
  // Auth methods
  signup: async (email, password) => {
    return await api.auth.signup(email, password);
  },
  
  login: async (email, password) => {
    return await api.auth.login(email, password);
  },
  
  logout: () => {
    api.auth.logout();
  },
  
  getCurrentUser: async () => {
    return await api.auth.getCurrentUser();
  },
  
  // User CRUD methods
  get: async (id) => {
    return await api.users.get(id);
  },
  
  update: async (id, userData) => {
    return await api.users.update(id, userData);
  },
  
  updateProfile: async (id, profileData) => {
    return await api.users.updateProfile(id, profileData);
  },
  
  // Alias methods
  findOne: async (id) => {
    return await api.users.get(id);
  },
};

// ==================== USER DATA ENTITY ====================
export const UserData = {
  get: async (userId) => {
    return await api.users.get(userId);
  },
  
  update: async (userId, data) => {
    return await api.users.updateProfile(userId, data);
  },
  
  findOne: async (userId) => {
    return await api.users.get(userId);
  },
  
  // Temporary filter implementation - returns empty array since backend doesn't support filtering yet
  filter: async (filters) => {
    console.warn('UserData.filter not fully implemented - backend needs /users/search endpoint');
    // For the user_email filter, we can try to get the current user's data
    if (filters.user_email) {
      try {
        const userData = await api.users.get(filters.user_email);
        return userData ? [userData] : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  },
  
  create: async (data) => {
    console.warn('UserData.create not yet implemented in Railway backend');
    return data;
  },
};

// ==================== PLACEHOLDER ENTITIES ====================
// These were in Base44 but not yet in Railway backend
// We'll create stub implementations that return empty data for now

export const Notification = {
  list: async () => {
    console.warn('Notification entity not yet implemented in Railway backend');
    return [];
  },
  findMany: async () => {
    console.warn('Notification entity not yet implemented in Railway backend');
    return [];
  },
  create: async (data) => {
    console.warn('Notification entity not yet implemented in Railway backend');
    return data;
  },
};

export const Suggestion = {
  list: async () => {
    console.warn('Suggestion entity not yet implemented in Railway backend');
    return [];
  },
  findMany: async () => {
    console.warn('Suggestion entity not yet implemented in Railway backend');
    return [];
  },
};

export const PlaylistListen = {
  list: async () => {
    console.warn('PlaylistListen entity not yet implemented in Railway backend');
    return [];
  },
  findMany: async () => {
    console.warn('PlaylistListen entity not yet implemented in Railway backend');
    return [];
  },
  create: async (data) => {
    console.warn('PlaylistListen entity not yet implemented in Railway backend');
    return data;
  },
};

export const PlaylistRating = {
  list: async () => {
    console.warn('PlaylistRating entity not yet implemented in Railway backend');
    return [];
  },
  findMany: async () => {
    console.warn('PlaylistRating entity not yet implemented in Railway backend');
    return [];
  },
  create: async (data) => {
    console.warn('PlaylistRating entity not yet implemented in Railway backend');
    return data;
  },
};

export const Album = {
  list: async () => {
    console.warn('Album entity not yet implemented in Railway backend');
    return [];
  },
  findMany: async () => {
    console.warn('Album entity not yet implemented in Railway backend');
    return [];
  },
};

export const Banner = {
  list: async () => {
    console.warn('Banner entity not yet implemented in Railway backend');
    return [];
  },
  findMany: async () => {
    console.warn('Banner entity not yet implemented in Railway backend');
    return [];
  },
  create: async (data) => {
    console.warn('Banner entity not yet implemented in Railway backend');
    return data;
  },
  update: async (id, data) => {
    console.warn('Banner entity not yet implemented in Railway backend');
    return data;
  },
  delete: async (id) => {
    console.warn('Banner entity not yet implemented in Railway backend');
    return { success: true };
  },
};

// Export default object with all entities
export default {
  Track,
  Playlist,
  PlaylistTrack,
  Vote,
  User,
  UserData,
  Notification,
  Suggestion,
  PlaylistListen,
  PlaylistRating,
  Album,
  Banner,
};