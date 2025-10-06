
import React, { createContext, useContext, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useUser } from './UserContext';
import { useGuestSession } from './GuestSessionContext';

const MusicPlayerContext = createContext();

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

export const MusicPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playerError, setPlayerError] = useState(null);
  
  const { isAuthenticated } = useUser();
  const { isPlayLimitReached, trackGuestPlay, triggerConversion } = useGuestSession();
  
  const audioRef = useRef(null);
  const timeUpdateRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  
  // Ref to store the latest playerError state, to be accessed by event listeners
  // that are set up once but need to read the most current state value.
  const playerErrorRef = useRef(playerError);

  // Effect to keep playerErrorRef.current updated with the latest playerError state
  useEffect(() => {
    playerErrorRef.current = playerError;
  }, [playerError]);

  // Initialize audio element and set up event listeners.
  // This effect is designed to run only once when the component mounts.
  useEffect(() => {
    // Only initialize the audio element if it hasn't been created yet.
    if (!audioRef.current) {
      const audio = new Audio();
      audioRef.current = audio; // Assign the created audio element to the ref
      audio.preload = 'metadata';
      audio.crossOrigin = 'anonymous';
      
      // Define event handlers within this effect to capture the 'audio' object
      // and provide stable references for adding/removing listeners.
      const handleLoadedMetadata = () => {
        if (audio && audio.duration) {
          setDuration(audio.duration);
          setIsLoading(false);
          setPlayerError(null);
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
          }
        }
      };
      
      const handleCanPlay = () => {
        setIsLoading(false);
        setPlayerError(null);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
      };
      
      const handleLoadStart = () => {
        setIsLoading(true);
        setPlayerError(null);
      };
      
      // Throttle time updates
      const handleTimeUpdate = () => {
        if (timeUpdateRef.current) {
          clearTimeout(timeUpdateRef.current);
        }
        timeUpdateRef.current = setTimeout(() => {
          // Access the latest playerError state via playerErrorRef.current
          // to ensure setCurrentTime is not called if an error has occurred.
          if (audio && !playerErrorRef.current) {
            setCurrentTime(audio.currentTime);
          }
        }, 100);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setIsLoading(false);
      };
      
      // Improved error handling - don't throw, just handle gracefully
      const handleError = (e) => {
        try {
          const error = e.target.error;
          let errorMessage = 'Cannot play this track';
          
          if (error) {
            switch (error.code) {
              case error.MEDIA_ERR_ABORTED:
                errorMessage = 'Playback was stopped';
                break;
              case error.MEDIA_ERR_NETWORK:
                errorMessage = 'Network error loading audio';
                break;
              case error.MEDIA_ERR_DECODE:
                errorMessage = 'Audio file format is incompatible';
                break;
              case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = 'Audio format not supported by your browser';
                break;
              default:
                errorMessage = 'Audio playback error';
            }
          }
          
          setIsPlaying(false);
          setIsLoading(false);
          setPlayerError(errorMessage);
          
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
          }
        } catch (handlingError) {
          console.warn('Error in audio error handler:', handlingError);
          setIsPlaying(false);
          setIsLoading(false);
          setPlayerError('Audio playback failed');
        }
      };

      // Add event listeners to the audio element
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
    
      // Cleanup function for when the component unmounts
      return () => {
        // Clear any pending timeouts
        if (timeUpdateRef.current) {
          clearTimeout(timeUpdateRef.current);
        }
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
        
        // Remove event listeners and clean up the audio element
        if (audio) {
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('loadstart', handleLoadStart);
          audio.removeEventListener('timeupdate', handleTimeUpdate);
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('error', handleError);
          try {
            audio.pause();
            audio.src = ''; // Clear the source to free up resources
            audioRef.current = null; // Clear the ref's current value
          } catch (cleanupError) {
            // Ignore cleanup errors during unmount
          }
        }
      };
    }
  }, []); // The dependency array is empty, ensuring this effect runs only once on mount.

  const togglePlayPause = useCallback(() => {
    // If audioRef.current is null, the audio element hasn't been initialized yet or has been cleaned up.
    // If currentTrack is null, there's no track to play.
    // If isLoading is true, the track is still loading.
    // If playerError is not null, there's an error preventing playback.
    if (!audioRef.current || !currentTrack || isLoading || playerError) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(error => {
              setIsPlaying(false);
              setPlayerError('Cannot play this track');
            });
        }
      }
    } catch (error) {
      setIsPlaying(false);
      setPlayerError('Playback error occurred');
    }
  }, [isPlaying, currentTrack, isLoading, playerError]);

  const playTrack = useCallback((track) => {
    try {
      // Validate track
      if (!track || !track.audio_url) {
        setPlayerError('Invalid track data');
        return;
      }

      // Check guest limits
      if (!isAuthenticated) {
        if (isPlayLimitReached()) {
          triggerConversion('play_limit');
          return;
        }
        trackGuestPlay();
      }

      if (currentTrack?.id === track.id && !playerError) {
        togglePlayPause();
      } else {
        // Reset states for new track
        setPlayerError(null);
        setCurrentTrack(track);
        setIsPlayerVisible(true);
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
        setIsLoading(true);
        
        if (audioRef.current) {
          try {
            // Clear previous source and pause
            audioRef.current.pause();
            audioRef.current.src = '';
            
            // Set timeout to catch loading failures
            if (loadTimeoutRef.current) {
              clearTimeout(loadTimeoutRef.current);
            }
            
            loadTimeoutRef.current = setTimeout(() => {
              setIsLoading(false);
              setPlayerError('Audio took too long to load');
            }, 8000);
            
            // Set new source and load
            audioRef.current.src = track.audio_url;
            audioRef.current.load();
            
            // Attempt to play
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setIsPlaying(true);
                  if (loadTimeoutRef.current) {
                    clearTimeout(loadTimeoutRef.current);
                  }
                })
                .catch(error => {
                  setIsPlaying(false);
                  setIsLoading(false);
                  setPlayerError('Cannot play this track');
                  if (loadTimeoutRef.current) {
                    clearTimeout(loadTimeoutRef.current);
                  }
                });
            }
          } catch (error) {
            setIsPlaying(false);
            setIsLoading(false);
            setPlayerError('Error loading track');
          }
        }
      }
    } catch (error) {
      setPlayerError('Error playing track');
    }
  }, [currentTrack, togglePlayPause, isAuthenticated, isPlayLimitReached, trackGuestPlay, triggerConversion, playerError]);

  const setVolumeLevel = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  }, []);

  const seek = useCallback((time) => {
    if (audioRef.current && duration > 0 && !playerError) {
      try {
        const clampedTime = Math.max(0, Math.min(duration, time));
        audioRef.current.currentTime = clampedTime;
        setCurrentTime(clampedTime);
      } catch (error) {
        // Ignore seek errors
      }
    }
  }, [duration, playerError]);

  const closePlayer = useCallback(() => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ''; // Clear source
      }
    } catch (error) {
      // Ignore cleanup errors
    }
    
    setCurrentTrack(null);
    setIsPlaying(false);
    setIsPlayerVisible(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
    setPlayerError(null);
    
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  }, []);

  // Effect to update the audio element's volume when the volume state changes
  useEffect(() => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = volume;
      } catch (error) {
        // Ignore volume setting errors
      }
    }
  }, [volume]);

  const value = useMemo(() => ({
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isPlayerVisible,
    isLoading,
    playerError,
    playTrack,
    togglePlayPause,
    setVolumeLevel,
    seek,
    closePlayer
  }), [
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isPlayerVisible,
    isLoading,
    playerError,
    playTrack,
    togglePlayPause,
    setVolumeLevel,
    seek,
    closePlayer
  ]);

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
