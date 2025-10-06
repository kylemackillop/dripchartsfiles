import React from 'react';
import { UserProvider } from '@/components/contexts/UserContext';
import { NotificationProvider } from '@/components/contexts/NotificationContext';

/**
 * Main app providers wrapper
 * Wraps the entire app with necessary context providers
 */
export default function AppProviders({ children }) {
  return (
    <UserProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </UserProvider>
  );
}