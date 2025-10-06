import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GuestSessionContext = createContext();

export const useGuestSession = () => {
  const context = useContext(GuestSessionContext);
  if (!context) {
    throw new Error('useGuestSession must be used within a GuestSessionProvider');
  }
  return context;
};

const GUEST_PLAY_LIMIT = 5;
const BROWSING_TIME_LIMIT = 5 * 60 * 1000; // 5 minutes in milliseconds

export const GuestSessionProvider = ({ children }) => {
  const [guestPlays, setGuestPlays] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [conversionTrigger, setConversionTrigger] = useState('');
  const [hasShownTimedPrompt, setHasShownTimedPrompt] = useState(false);

  // Initialize guest session
  useEffect(() => {
    const storedPlays = localStorage.getItem('guest_plays');
    const storedStartTime = localStorage.getItem('session_start_time');
    const storedTimedPrompt = localStorage.getItem('has_shown_timed_prompt');
    
    if (storedPlays) {
      setGuestPlays(parseInt(storedPlays, 10));
    }
    
    if (storedStartTime) {
      setSessionStartTime(new Date(storedStartTime));
    } else {
      const now = new Date();
      setSessionStartTime(now);
      localStorage.setItem('session_start_time', now.toISOString());
    }

    if (storedTimedPrompt) {
      setHasShownTimedPrompt(true);
    }
  }, []);

  // Check for timed conversion prompt
  useEffect(() => {
    if (!sessionStartTime || hasShownTimedPrompt) return;

    const checkBrowsingTime = () => {
      const now = new Date();
      const timeElapsed = now - sessionStartTime;
      
      if (timeElapsed >= BROWSING_TIME_LIMIT) {
        setConversionTrigger('browsing_time');
        setShowConversionModal(true);
        setHasShownTimedPrompt(true);
        localStorage.setItem('has_shown_timed_prompt', 'true');
      }
    };

    const interval = setInterval(checkBrowsingTime, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [sessionStartTime, hasShownTimedPrompt]);

  const trackGuestPlay = useCallback(() => {
    const newPlayCount = guestPlays + 1;
    setGuestPlays(newPlayCount);
    localStorage.setItem('guest_plays', newPlayCount.toString());

    // Trigger conversion modal after 3 plays
    if (newPlayCount >= 3 && !showConversionModal) {
      setConversionTrigger('play_limit');
      setShowConversionModal(true);
    }

    return newPlayCount >= GUEST_PLAY_LIMIT;
  }, [guestPlays, showConversionModal]);

  const triggerConversion = useCallback((trigger) => {
    setConversionTrigger(trigger);
    setShowConversionModal(true);
  }, []);

  const resetGuestSession = useCallback(() => {
    setGuestPlays(0);
    setSessionStartTime(new Date());
    setHasShownTimedPrompt(false);
    localStorage.removeItem('guest_plays');
    localStorage.removeItem('session_start_time');
    localStorage.removeItem('has_shown_timed_prompt');
  }, []);

  const closeConversionModal = useCallback(() => {
    setShowConversionModal(false);
  }, []);

  const getRemainingPlays = useCallback(() => {
    return Math.max(0, GUEST_PLAY_LIMIT - guestPlays);
  }, [guestPlays]);

  const isPlayLimitReached = useCallback(() => {
    return guestPlays >= GUEST_PLAY_LIMIT;
  }, [guestPlays]);

  const value = {
    guestPlays,
    showConversionModal,
    conversionTrigger,
    trackGuestPlay,
    triggerConversion,
    resetGuestSession,
    closeConversionModal,
    getRemainingPlays,
    isPlayLimitReached,
    sessionStartTime
  };

  return (
    <GuestSessionContext.Provider value={value}>
      {children}
    </GuestSessionContext.Provider>
  );
};