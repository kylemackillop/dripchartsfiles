
import React, { useState, useEffect, useCallback } from "react";
import { Track, UserData, Playlist } from "@/api/entities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Star, MapPin, Clock, Plus, Play, Pause, ExternalLink, Instagram, Twitter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AddToPlaylistModal from "../components/playlist/AddToPlaylistModal";
import { useUser } from '@/components/contexts/UserContext';
import { useGuestSession } from '@/components/contexts/GuestSessionContext';
import { useMusicPlayer } from '@/components/contexts/MusicPlayerContext';

const GENRES = [
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
  { value: "punk", label: "Punk" },
  { value: "experimental", label: "Experimental" }
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
  punk: "bg-rose-100 text-rose-800",
  experimental: "bg-indigo-100 text-indigo-800"
};

export default function ArtistPage() {
  const [artistData, setArtistData] = useState(null);
  const [artistTracks, setArtistTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const { user, isAuthenticated } = useUser();
  const { triggerConversion } = useGuestSession();
  const { playTrack, currentTrack, isPlaying } = useMusicPlayer();

  // State for AddToPlaylistModal
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const loadArtistData = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const artistName = urlParams.get('artist_name');
    
    if (!artistName) {
      setIsLoading(false);
      return;
    }

    try {
      // Find artist by name in UserData
      const artistDataRecords = await UserData.filter({ artist_name: artistName });
      if (artistDataRecords.length > 0) {
        setArtistData(artistDataRecords[0]);
      }

      // Get tracks by this artist
      const tracks = await Track.filter({ artist_name: artistName }, '-average_rating');
      setArtistTracks(tracks);

      // Get user playlists if authenticated
      if (user) {
        const playlists = await Playlist.filter({ created_by: user.email });
        setUserPlaylists(playlists);
      }
    } catch (error) {
      console.error("Error loading artist data:", error);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadArtistData();
  }, [loadArtistData]);

  const handleAddToPlaylistClick = (song) => {
    if (!isAuthenticated) {
      triggerConversion('playlist');
      return;
    }
    setSelectedSong(song);
    setIsPlaylistModalOpen(true);
  };

  const refreshPlaylists = async () => {
    if (!user) return;
    try {
      const playlists = await Playlist.filter({ created_by: user.email });
      setUserPlaylists(playlists);
    } catch (error) {
      console.error("Error refreshing playlists:", error);
    }
  };

  const SongCard = ({ song, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="material-shadow hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <CardContent className="p-4 flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Cover Art - visible on desktop and tablet, hidden on mobile landscape and smaller */}
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 hidden sm:flex sm:items-center sm:justify-center">
                  {song.cover_art_url ? (
                    <img
                      src={song.cover_art_url}
                      alt={`${song.title} cover art`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Music className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link to={createPageUrl(`TrackDetails?id=${song.id}`)} className="hover:underline">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{song.title}</h3>
                  </Link>
                  <Link
                    to={createPageUrl(`ArtistPage?artist_name=${encodeURIComponent(song.artist_name)}`)}
                    className="text-gray-600 truncate hover:underline hover:text-purple-600 transition-colors block"
                  >
                    {song.artist_name || song.created_by}
                  </Link>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary" className={`${genreColors[song.genre]}`}>
                      {GENRES.find(g => g.value === song.genre)?.label}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold text-gray-800">
                        {(song.average_rating || 0).toFixed(1)}
                      </span>
                      <span className="text-gray-500">({song.total_votes || 0})</span>
                    </div>
                    <button
                        onClick={() => handleAddToPlaylistClick(song)}
                        className="group relative w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#D1C5E0] transition-colors"
                        aria-label="Add to playlist"
                    >
                        <Plus className="w-4 h-4 text-gray-600 plus-icon-hover" />
                    </button>
                  </div>
                </div>
            </div>
             {/* Play button - always pinned to the right */}
             <div className="flex-shrink-0 ml-auto">
                <Button
                    size="icon"
                    className="bg-[#D1C5E0] hover:bg-[#bcaecf] text-[#26054D] shadow-lg rounded-full w-11 h-11"
                    onClick={(e) => {
                      e.preventDefault();
                      playTrack(song);
                    }}
                >
                    {currentTrack && currentTrack.id === song.id && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
            </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const urlParams = new URLSearchParams(window.location.search);
  const artistName = urlParams.get('artist_name');

  if (!artistName) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="material-shadow">
          <CardContent className="p-16 text-center text-gray-500">
            <Music className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Artist not found</h3>
            <p>The artist you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Artist Header */}
      <div className="mb-8">
        <div className="flex items-start gap-6 mb-6">
          {artistData?.artist_image_url ? (
            <img 
              src={artistData.artist_image_url} 
              alt={artistName}
              className="w-32 h-32 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-32 h-32 bg-[#6A12CC] text-white rounded-full flex items-center justify-center text-4xl font-bold flex-shrink-0">
              {artistName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{artistName}</h1>
            {artistData?.location && (
              <div className="flex items-center gap-1 text-gray-600 mb-3">
                <MapPin className="w-5 h-5" />
                <span>{artistData.location}</span>
              </div>
            )}
            {artistData?.bio && (
              <p className="text-gray-700 leading-relaxed mb-4">{artistData.bio}</p>
            )}
            {artistData?.genres && artistData.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {artistData.genres.map(genre => (
                  <Badge key={genre} variant="secondary" className={genreColors[genre]}>
                    {GENRES.find(g => g.value === genre)?.label || genre}
                  </Badge>
                ))}
              </div>
            )}
            {/* Social Links */}
            {artistData?.social_links && (
              <div className="flex gap-3">
                {artistData.social_links.instagram && (
                  <a href={`https://instagram.com/${artistData.social_links.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Instagram className="w-4 h-4 mr-1" />
                      Instagram
                    </Button>
                  </a>
                )}
                {artistData.social_links.twitter && (
                  <a href={`https://twitter.com/${artistData.social_links.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Twitter className="w-4 h-4 mr-1" />
                      Twitter
                    </Button>
                  </a>
                )}
                {artistData?.website && (
                  <a href={artistData.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Website
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Artist Tracks */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Songs ({artistTracks.length})</h2>
        
        <AnimatePresence>
          {artistTracks.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {artistTracks.map((song, index) => (
                <SongCard key={song.id} song={song} index={index} />
              ))}
            </div>
          ) : (
            <Card className="material-shadow">
              <CardContent className="p-16 text-center text-gray-500">
                <Music className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No songs yet</h3>
                <p>This artist hasn't uploaded any songs yet.</p>
              </CardContent>
            </Card>
          )}
        </AnimatePresence>
      </div>

      {selectedSong && isAuthenticated && (
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
      )}
    </div>
  );
}
