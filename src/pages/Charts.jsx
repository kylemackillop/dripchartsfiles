import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Track, Vote, User, Playlist } from "@/api/entities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Star, Clock, Plus, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AddToPlaylistModal from "../components/playlist/AddToPlaylistModal";
import RatingModal from "../components/rating/RatingModal";
import GuestPrompt from "../components/ui/GuestPrompt";
import { useUser } from "@/components/contexts/UserContext";
import { useGuestSession } from "@/components/contexts/GuestSessionContext";
import { useMusicPlayer } from '@/components/contexts/MusicPlayerContext';

const GENRES = [
  { value: "all", label: "All Genres" },
  { value: "indie", label: "Indie" },
  { value: "alternative", label: "Alternative" },
  { value: "rap", label: "Rap" },
  { value: "rb", label: "R&B" },
  { value: "rock", label: "Rock" },
  { value: "pop", label: "Pop" },
  { value: "electronic", label: "Electronic" },
  { value: "folk", label: "Folk" },
  { value: "jazz", label: "Jazz" },
  { value: "country", label: "Country" },
  { value: "metal", label: "Metal" },
  { value: "punk", label: "Punk" }
];

const genreColors = {
  indie: "bg-orange-100 text-orange-800",
  alternative: "bg-purple-100 text-purple-800", 
  rap: "bg-yellow-100 text-yellow-800",
  rb: "bg-pink-100 text-pink-800",
  rock: "bg-red-100 text-red-800",
  pop: "bg-blue-100 text-blue-800",
  electronic: "bg-cyan-100 text-cyan-800",
  folk: "bg-green-100 text-green-800",
  jazz: "bg-amber-100 text-amber-800",
  country: "bg-yellow-100 text-yellow-800",
  metal: "bg-gray-200 text-gray-800",
  punk: "bg-rose-100 text-rose-800"
};

const MINIMUM_VOTES_THRESHOLD = 2;

// Moved TrackCard outside of ChartsPage to prevent re-definition on render
const TrackCard = React.memo(({ 
    track, 
    position, 
    onRatingClick, 
    onAddToPlaylistClick, 
    onPlayClick,
    currentPlayingTrack,
    isPlaying
}) => {
    const isCurrentlyPlaying = currentPlayingTrack?.id === track.id && isPlaying;
    return (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: position * 0.05 }}
          className="w-full"
        >
          <Card className="material-shadow hover:shadow-lg transition-shadow duration-300 w-full">
            <CardContent className="p-4 flex items-center gap-x-4">
              <div className="flex-shrink-0 w-8 text-center font-bold text-lg text-gray-500">
                {position + 1}
              </div>
    
              <div className="w-14 h-14 flex-shrink-0 hidden md:block">
                {track.cover_art_url ? (
                  <img
                    src={track.cover_art_url}
                    alt={`${track.title} cover art`}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                    <Music className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <Link to={createPageUrl(`TrackDetails?id=${track.id}`)} className="hover:underline">
                  <h3 className="text-base font-semibold text-gray-900 truncate">{track.title}</h3>
                </Link>
                <Link 
                  to={createPageUrl(`ArtistPage?artist_name=${encodeURIComponent(track.artist_name)}`)} 
                  className="hover:underline hover:text-purple-600 transition-colors"
                >
                  <p className="text-sm text-gray-600 truncate">{track.artist_name || track.created_by}</p>
                </Link>
                <div className="md:hidden flex items-center gap-4 mt-2">
                  <Badge variant="secondary" className={`${genreColors[track.genre]}`}>
                    {GENRES.find(g => g.value === track.genre)?.label}
                  </Badge>
                  <button 
                    onClick={() => onRatingClick(track)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-gray-800">{(track.average_rating || 0).toFixed(1)}</span>
                    <span className="text-sm">({track.total_votes || 0})</span>
                  </button>
                </div>
              </div>
    
              <div className="hidden md:flex items-center gap-4">
                  <Badge variant="secondary" className={`${genreColors[track.genre]}`}>
                    {GENRES.find(g => g.value === track.genre)?.label}
                  </Badge>
                  {track.duration && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{track.duration}</span>
                    </div>
                  )}
                  <button 
                    onClick={() => onRatingClick(track)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-gray-800">{(track.average_rating || 0).toFixed(1)}</span>
                    <span className="text-sm">({track.total_votes || 0})</span>
                  </button>
              </div>
    
              <button
                onClick={() => onAddToPlaylistClick(track)}
                className="group relative w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                aria-label="Add to playlist"
              >
                  <Plus className="w-5 h-5 text-gray-600 plus-icon-hover" />
              </button>
              
              <Button 
                size="icon" 
                className="bg-[#D1C5E0] hover:bg-[#bcaecf] text-dark-purple shadow-lg rounded-full w-11 h-11"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPlayClick(track);
                }}
              >
                {isCurrentlyPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
    );
});

export default function ChartsPage() {
  const [tracks, setTracks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, isGuest, isInitialized } = useUser();
  const { triggerConversion } = useGuestSession();
  const [userPlaylists, setUserPlaylists] = useState([]);
  
  const { playTrack, currentTrack, isPlaying } = useMusicPlayer();

  // State for modals
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  // Memoize user email to prevent unnecessary re-renders
  const userEmail = useMemo(() => user?.email, [user?.email]);

  // Load initial chart data - independent of user state
  useEffect(() => {
    if (!isInitialized) return;

    let isMounted = true;
    let loadingStarted = false; // Flag to ensure fetchChartsData runs only once per isInitialized becoming true

    const fetchChartsData = async () => {
      if (loadingStarted) return;
      loadingStarted = true;

      setIsLoading(true);
      try {
        const allTracks = await Track.list('-average_rating');

        if (isMounted) {
          setTracks(allTracks);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error loading data:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchChartsData();

    return () => {
      isMounted = false;
    };
  }, [isInitialized]);

  // Load user playlists separately to avoid triggering main data reload
  useEffect(() => {
    if (!isAuthenticated || !userEmail) {
      setUserPlaylists([]);
      return;
    }

    let isMounted = true;

    const fetchUserPlaylists = async () => {
      try {
        const playlists = await Playlist.filter({ created_by: userEmail });
        if (isMounted) {
          setUserPlaylists(playlists);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error loading user playlists:", error);
        }
      }
    };

    fetchUserPlaylists();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, userEmail]);
  
  const refreshPlaylists = useCallback(async () => {
    if (!userEmail) return;
    try {
      const playlists = await Playlist.filter({ created_by: userEmail });
      setUserPlaylists(playlists);
    } catch (error) {
      console.error("Error refreshing playlists:", error);
    }
  }, [userEmail]);

  const handleAddToPlaylistClick = useCallback((song) => {
    if (!isAuthenticated) {
      triggerConversion('playlist');
      return;
    }
    setSelectedSong(song);
    setIsPlaylistModalOpen(true);
  }, [isAuthenticated, triggerConversion]);

  const handleRatingClick = useCallback((song) => {
    if (!isAuthenticated) {
      triggerConversion('rating');
      return;
    }
    setSelectedSong(song);
    setIsRatingModalOpen(true);
  }, [isAuthenticated, triggerConversion]);

  const handleRatingUpdate = useCallback((updatedSong) => {
    setTracks(prevTracks => 
      prevTracks.map(track => 
        track.id === updatedSong.id ? updatedSong : track
      )
    );
  }, []); // No external dependencies, setTracks is stable

  // Memoize filtered tracks to prevent recalculation on every render
  const filteredTracks = useMemo(() => {
    return tracks
      .filter(track => selectedGenre === "all" || track.genre === selectedGenre)
      .filter(track => (track.total_votes || 0) >= MINIMUM_VOTES_THRESHOLD);
  }, [tracks, selectedGenre]);


  // Show loading state while auth is initializing
  if (!isInitialized) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-4">
          {Array(10).fill(0).map((_, i) => (
            <Card key={i} className="h-[84px] material-shadow animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {isGuest && (
        <div className="mb-6">
          <GuestPrompt action="signup" className="border-purple-200 bg-purple-50">
            <p className="text-sm text-purple-700">
              🎵 Discover amazing new music! Join free to rate tracks, create playlists, and support artists.
            </p>
          </GuestPrompt>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
            Charts
        </h1>
        <div className="w-48">
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                    {GENRES.map(genre => (
                        <SelectItem key={genre.value} value={genre.value}>{genre.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      <AnimatePresence>
        {isLoading ? (
          <div className="space-y-4">
            {Array(10).fill(0).map((_, i) => (
              <Card key={i} className="h-[84px] material-shadow animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : filteredTracks.length > 0 ? (
          <div className="space-y-4">
            {filteredTracks.map((track, index) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                position={index}
                onRatingClick={handleRatingClick}
                onAddToPlaylistClick={handleAddToPlaylistClick}
                onPlayClick={playTrack}
                currentPlayingTrack={currentTrack}
                isPlaying={isPlaying}
              />
            ))}
          </div>
        ) : (
          <Card className="material-shadow">
            <CardContent className="p-16 text-center text-gray-500">
              <Music className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tracks Found</h3>
              <p>No tracks in this genre currently meet the minimum rating threshold to be displayed on the charts.</p>
            </CardContent>
          </Card>
        )}
      </AnimatePresence>
      
      {selectedSong && isAuthenticated && (
        <>
          <AddToPlaylistModal 
            isOpen={isPlaylistModalOpen}
            onClose={() => {
              setIsPlaylistModalOpen(false);
              setSelectedSong(null);
            }}
            song={selectedSong}
            user={user}
            userPlaylists={userPlaylists}
            onRefreshPlaylists={refreshPlaylists}
          />
          
          <RatingModal
            isOpen={isRatingModalOpen}
            onClose={() => {
              setIsRatingModalOpen(false);
              setSelectedSong(null);
            }}
            song={selectedSong}
            user={user}
            onRatingUpdate={handleRatingUpdate}
          />
        </>
      )}
    </div>
  );
}