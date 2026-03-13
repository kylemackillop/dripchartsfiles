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
      const userData = await AuthUser.getCurrentUser();
      setUser(userData);
      setIsGuest(false);
      
      // Ensure UserData exists for this user
      await ensureUserDataExists(userData);
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setIsGuest(true);
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  }, [ensureUserDataExists]);

  const updateUser = useCallback(async (userData) => {
    try {
      await AuthUser.updateMyUserData(userData);
      await fetchUser();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      AuthUser.logout();
      setUser(null);
      setIsGuest(true);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  const login = useCallback(async () => {
    // After login happens in LoginModal, this will refresh the user data
    await fetchUser();
  }, [fetchUser]);

  const loginWithRedirect = useCallback(async (callbackUrl) => {
    // Not implemented for Railway backend yet
    console.warn('loginWithRedirect not implemented');
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