import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification } from '@/api/entities';
import { useUser } from './UserContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user?.email) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setIsLoading(true);
      const userNotifications = await Notification.filter(
        { user_email: user.email }, 
        '-created_date', 
        50
      );
      setNotifications(userNotifications);
      
      const unread = userNotifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.email]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await Notification.update(notificationId, { is_read: true });
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      
      await Promise.all(
        unreadNotifications.map(notification =>
          Notification.update(notification.id, { is_read: true })
        )
      );
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.is_read) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const removeNotification = useCallback(async (notificationId) => {
    try {
      await Notification.delete(notificationId);
      
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId);
        const newNotifications = prev.filter(n => n.id !== notificationId);
        
        if (notification && !notification.is_read) {
          setUnreadCount(current => Math.max(0, current - 1));
        }
        
        return newNotifications;
      });
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  }, []);

  // Fetch notifications when user changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Auto-refresh notifications every 2 minutes
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(fetchNotifications, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, [fetchNotifications, isAuthenticated]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    refresh: fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};