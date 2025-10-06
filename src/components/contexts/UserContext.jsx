import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User as AuthUser, UserData } from '@/api/entities';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const ensureUserDataExists = useCallback(async (userData) => {
    try {
      // Check if UserData already exists for this user
      const existingUserData = await UserData.filter({ user_email: userData.email });
      
      if (existingUserData.length === 0) {
        // Create default UserData record for new user
        await UserData.create({
          user_email: userData.email,
          artist_name: "",
          bio: "",
          location: "",
          website: "",
          artist_image_url: "",
          genres: [],
          similar_bands: "",
          social_links: {},
          visibility_level: "public",
          profile_visibility: {
            ratings_given: false,
            listening_history: false
          },
          blocked_users: [],
          friends_list: [],
          can_be_discovered: true,
          allow_playlist_collaboration: true,
          allow_direct_messages: true
        });
        console.log('Created default UserData for new user:', userData.email);
      }
    } catch (error) {
      console.error('Error ensuring UserData exists:', error);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await AuthUser.me();
      setUser(userData);
      setIsGuest(false);
      
      // Ensure UserData exists for this user
      await ensureUserDataExists(userData);
      
      setIsInitialized(true);
      setIsLoading(false);
    } catch (error) {
      // Don't log this as an error - guest access is normal
      setUser(null);
      setIsGuest(true);
      setIsInitialized(true);
      setIsLoading(false);
    }
  }, [ensureUserDataExists]);

  const updateUser = useCallback(async (userData) => {
    try {
      await AuthUser.updateMyUserData(userData);
      await fetchUser(); // Refresh user data after update
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await AuthUser.logout();
      setUser(null);
      setIsGuest(true);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  const login = useCallback(() => {
    AuthUser.login();
  }, []);

  const loginWithRedirect = useCallback((callbackUrl) => {
    AuthUser.loginWithRedirect(callbackUrl);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = {
    user,
    isLoading,
    isInitialized,
    isGuest,
    fetchUser,
    updateUser,
    logout,
    login,
    loginWithRedirect,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};