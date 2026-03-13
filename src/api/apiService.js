// src/api/apiService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper to get stored token
const getToken = () => localStorage.getItem('dripcharts_token');

// Helper to store token
const setToken = (token) => localStorage.setItem('dripcharts_token', token);

// Helper to remove token
const removeToken = () => localStorage.removeItem('dripcharts_token');

// Generic API call helper
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'API request failed');
  }
  
  return response.json();
};

// ==================== AUTH API ====================
export const authAPI = {
  signup: async (email, password) => {
    const result = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (result.token) {
      setToken(result.token);
    }
    return result;
  },
  
  login: async (email, password) => {
    const result = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (result.token) {
      setToken(result.token);
    }
    return result;
  },
  
  getCurrentUser: () => apiCall('/auth/me'),
  
  logout: () => {
    removeToken();
  },
};

// ==================== TRACKS API ====================
export const tracksAPI = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/tracks${query ? `?${query}` : ''}`);
  },
  
  get: (id) => apiCall(`/tracks/${id}`),
  
  create: (trackData) => apiCall('/tracks', {
    method: 'POST',
    body: JSON.stringify(trackData),
  }),
  
  update: (id, trackData) => apiCall(`/tracks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(trackData),
  }),
  
  delete: (id) => apiCall(`/tracks/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== PLAYLISTS API ====================
export const playlistsAPI = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/playlists${query ? `?${query}` : ''}`);
  },
  
  get: (id) => apiCall(`/playlists/${id}`),
  
  create: (playlistData) => apiCall('/playlists', {
    method: 'POST',
    body: JSON.stringify(playlistData),
  }),
  
  update: (id, playlistData) => apiCall(`/playlists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(playlistData),
  }),
  
  delete: (id) => apiCall(`/playlists/${id}`, {
    method: 'DELETE',
  }),
  
  addTrack: (playlistId, trackId) => apiCall(`/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: JSON.stringify({ track_id: trackId }),
  }),
  
  removeTrack: (playlistId, trackId) => apiCall(`/playlists/${playlistId}/tracks/${trackId}`, {
    method: 'DELETE',
  }),
};

// ==================== VOTES API ====================
export const votesAPI = {
  vote: (itemType, itemId, value) => apiCall('/votes', {
    method: 'POST',
    body: JSON.stringify({
      item_type: itemType,
      item_id: itemId,
      value,
    }),
  }),
  
  getVotes: (itemType, itemId) => apiCall(`/votes/${itemType}/${itemId}`),
  
  getUserVote: (itemType, itemId) => apiCall(`/votes/${itemType}/${itemId}/user`),
};

// ==================== USERS API ====================
export const usersAPI = {
  get: (id) => apiCall(`/users/${id}`),
  
  update: (id, userData) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  updateProfile: (id, profileData) => apiCall(`/users/${id}/profile`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
};

// Export helper functions
export { getToken, setToken, removeToken };

// Export all APIs as default - THIS IS CRITICAL!
export default {
  auth: authAPI,
  tracks: tracksAPI,
  playlists: playlistsAPI,
  votes: votesAPI,
  users: usersAPI,
};