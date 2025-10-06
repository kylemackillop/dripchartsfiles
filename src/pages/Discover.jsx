
import React, { useState, useEffect, useCallback } from "react";
import { Track, User, Playlist, UserData, PlaylistTrack } from "@/api/entities"; // Added UserData, PlaylistTrack
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Star, MapPin, Clock, Plus, Play, Pause, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Fixed syntax here
import AddToPlaylistModal from "../components/playlist/AddToPlaylistModal";
import CreatePlaylistModal from "../components/playlist/CreatePlaylistModal";
import PlaylistCard from "../components/playlist/PlaylistCard"; // Import PlaylistCard
import { useUser } from '@/components/contexts/UserContext';
import { useGuestSession } from '@/components/contexts/GuestSessionContext'; // Added GuestSessionContext import
import { useMusicPlayer } from '@/components/contexts/MusicPlayerContext'; // Added MusicPlayerContext import
import GuestPrompt from "../components/ui/GuestPrompt"; // Added GuestPrompt import
import { Input } from "@/components/ui/input"; // Added Input import

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
  { value: "punk", label: "Punk" },
  { value: "experimental", label: "Experimental" }
];

const COUNTRIES = [
  { value: "all", label: "All Countries" },
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
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

const SongsTab = ({ user }) => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // Default to newest
  const [userPlaylists, setUserPlaylists] = useState([]);
  const { isAuthenticated } = useUser(); // Added isAuthenticated
  const { triggerConversion } = useGuestSession(); // Added triggerConversion

  // State for AddToPlaylistModal
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  // Use the global music player context
  const { playTrack, currentTrack, isPlaying } = useMusicPlayer();

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allSongs, playlists] = await Promise.all([
        Track.list('-created_date'),
        user ? Playlist.filter({ created_by: user.email }) : Promise.resolve([])
      ]);
      setSongs(allSongs);
      setUserPlaylists(playlists);
    } catch (error) {
      console.error("Error loading songs:", error);
    }
    setIsLoading(false);
  }, [user]);

  const refreshPlaylists = useCallback(async () => {
    if (!user) return;
    const playlists = await Playlist.filter({ created_by: user.email });
    setUserPlaylists(playlists);
  }, [user]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleAddToPlaylistClick = (song) => {
    if (!isAuthenticated) {
      triggerConversion('playlist');
      return;
    }
    setSelectedSong(song);
    setIsPlaylistModalOpen(true);
  };

  const filteredAndSortedSongs = songs
    .filter(song => selectedGenre === "all" || song.genre === selectedGenre)
    .sort((a, b) => {
        switch (sortBy) {
            case 'ranking':
                return (b.average_rating || 0) - (a.average_rating || 0);
            case 'newest':
                return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
            case 'oldest':
                return new Date(a.created_date).getTime() - new Date(b.created_date).getTime();
            default:
                return 0;
        }
    });

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
                        className="group relative w-6 h-6 flex items-center justify-center rounded-full hover:bg-lavender transition-colors"
                        aria-label="Add to playlist"
                    >
                        <Plus className="w-4 h-4 text-gray-600 group-hover:text-dark-purple" />
                    </button>
                  </div>
                </div>
            </div>
             {/* Play button - always pinned to the right */}
             <div className="flex-shrink-0 ml-auto">
                <Button
                    size="icon"
                    className="bg-[#D1C5E0] hover:bg-[#bcaecf] text-dark-purple shadow-lg rounded-full w-11 h-11"
                    onClick={(e) => {
                      e.preventDefault();
                      playTrack(song); // Use global playTrack function
                    }}
                >
                    {currentTrack && currentTrack.id === song.id && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
            </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div>
      <Card className="p-6 mb-8 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="genre-select" className="text-sm font-medium text-gray-700 mb-2 block">
              Filter by Genre
            </Label>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger id="genre-select" className="bg-white">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((genre) => (
                  <SelectItem key={genre.value} value={genre.value}>{genre.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sort-select" className="text-sm font-medium text-gray-700 mb-2 block">
              Sort By
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-select" className="bg-white">
                <SelectValue placeholder="Sort songs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="ranking">Ranking</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <Card key={i} className="h-28 material-shadow animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : filteredAndSortedSongs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredAndSortedSongs.map((song, index) => (
              <SongCard key={song.id} song={song} index={index} />
            ))}
          </div>
        ) : (
          <Card className="material-shadow">
            <CardContent className="p-16 text-center text-gray-500">
              <Music className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No songs found</h3>
              <p>Try changing your filters or check back later for new music!</p>
            </CardContent>
          </Card>
        )}
      </AnimatePresence>

      {selectedSong && isAuthenticated && ( // Conditionally render if authenticated
        <AddToPlaylistModal
          isOpen={isPlaylistModalOpen}
          onClose={() => setIsPlaylistModalOpen(false)}
          song={selectedSong}
          user={user}
          userPlaylists={userPlaylists}
          onRefreshPlaylists={refreshPlaylists}
        />
      )}
    </div>
  );
};

const ArtistsTab = ({ user }) => { // Accept user prop
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("ranking");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allTracks, discoverableUserData] = await Promise.all([
        Track.list('-created_date'),
        UserData.filter({ can_be_discovered: true }) // Fetch discoverable artists from UserData
      ]);

      // Create artist data from UserData and Tracks
      const artistMap = {};

      // Initialize map with all discoverable artists from UserData
      discoverableUserData.forEach(ud => {
        artistMap[ud.user_email] = {
          ...ud, // Spread all fields from UserData (artist_name, bio, etc.)
          email: ud.user_email, // ensure email is top-level
          tracks: [],
          totalRating: 0,
          totalVotes: 0,
          genres: new Set(ud.genres || []),
        };
      });

      // Add track stats to the artists in the map
      allTracks.forEach(track => {
        if (artistMap[track.created_by]) {
          const artist = artistMap[track.created_by];
          artist.tracks.push(track);
          artist.totalRating += (track.average_rating || 0) * (track.total_votes || 1);
          artist.totalVotes += (track.total_votes || 1);
          if (track.genre) {
            artist.genres.add(track.genre);
          }
        }
      });

      let artistList = Object.values(artistMap).map(artist => ({
        ...artist,
        trackCount: artist.tracks.length,
        cumulativeRating: artist.totalVotes > 0 ? artist.totalRating / artist.totalVotes : 0,
        genres: Array.from(artist.genres),
        displayName: artist.display_name || artist.artist_name || "Unknown Artist" // Use display_name first
      }));

      // Apply filtering before sorting
      artistList = artistList.filter(artist => {
        const genreMatch = selectedGenre === "all" || artist.genres.includes(selectedGenre);
        // Filter by location (free text search)
        const locationMatch = locationFilter === "" ||
          (artist.location && artist.location.toLowerCase().includes(locationFilter.toLowerCase()));
        return genreMatch && locationMatch;
      });

      // Apply sorting
      switch (sortBy) {
        case 'ranking':
          artistList.sort((a, b) => b.cumulativeRating - a.cumulativeRating);
          break;
        case 'a-z':
          artistList.sort((a, b) => a.displayName.localeCompare(b.displayName));
          break;
        case 'z-a':
          artistList.sort((a, b) => b.displayName.localeCompare(a.displayName));
          break;
        case 'newest':
           // This sorting assumes 'created_date' is available on the artist object, which is derived from UserData.
           // If UserData does not have 'created_date', this sort will not be accurate for artist creation date.
           // For now, it will sort by artists that happen to have a 'created_date' (like the first song they uploaded)
           // If UserData itself had a creation timestamp, that would be better.
           artistList.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
          break;
        default:
            break;
      }

      setArtists(artistList);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  }, [selectedGenre, locationFilter, sortBy]); // Updated dependencies

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredArtists = artists;

  const ArtistCard = ({ artist, index, user }) => {
    const displayName = artist.displayName;

    const isCurrentUserArtist = user && artist.email === user.email;
    const linkPath = isCurrentUserArtist
      ? createPageUrl("ArtistProfile")
      : createPageUrl(`ArtistPage?artist_name=${encodeURIComponent(displayName)}`);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link to={linkPath}>
          <Card className="material-shadow hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                {artist.artist_image_url ? (
                  <img
                    src={artist.artist_image_url}
                    alt={displayName}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-[#6A12CC] text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {displayName ? displayName.charAt(0).toUpperCase() : ''}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{displayName}</h3>
                  {artist.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{artist.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Music className="w-4 h-4" />
                      <span>{artist.trackCount} song{artist.trackCount !== 1 ? 's' : ''}</span>
                    </div>
                    {artist.cumulativeRating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-gray-800">
                          {artist.cumulativeRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {artist.genres.slice(0, 3).map(genre => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {GENRES.find(g => g.value === genre)?.label || genre}
                      </Badge>
                    ))}
                  </div>
                  {artist.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {artist.bio}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  };

  return (
    <div>
      <Card className="p-6 mb-8 shadow-md">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="genre-select-artist" className="text-sm font-medium text-gray-700 mb-2 block">
              Filter by Genre
            </Label>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger id="genre-select-artist" className="bg-white">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((genre) => (
                  <SelectItem key={genre.value} value={genre.value}>{genre.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location-filter" className="text-sm font-medium text-gray-700 mb-2 block">
              Filter by Location
            </Label>
            <Input
              id="location-filter"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value.slice(0, 40))}
              placeholder="Enter city or country..."
              className="bg-white"
              maxLength={40}
            />
          </div>
          <div>
            <Label htmlFor="sort-select-artist" className="text-sm font-medium text-gray-700 mb-2 block">
              Sort By
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-select-artist" className="bg-white">
                <SelectValue placeholder="Ranking" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ranking">Ranking</SelectItem>
                <SelectItem value="a-z">A - Z</SelectItem>
                <SelectItem value="z-a">Z - A</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="h-48 material-shadow animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : filteredArtists.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredArtists.map((artist, index) => (
              <ArtistCard key={artist.email} artist={artist} index={index} user={user} />
            ))}
          </div>
        ) : (
          <Card className="material-shadow">
            <CardContent className="p-16 text-center text-gray-500">
              <Music className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No artists found</h3>
              <p>Try changing your filters or check back later for new artists!</p>
            </CardContent>
          </Card>
        )}
      </AnimatePresence>
    </div>
  );
};

const PlaylistsTab = ({ user }) => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying, playPlaylist } = useMusicPlayer();

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true);
      try {
        const allPublicPlaylists = await Playlist.filter({ is_public: true }, '-created_date');
        const filteredPlaylists = allPublicPlaylists.filter(p => p.song_count >= 3);
        
        if (filteredPlaylists.length > 0) {
          const creatorEmails = [...new Set(filteredPlaylists.map(p => p.created_by))];
          const creatorsData = await UserData.filter({ user_email: { "$in": creatorEmails } });
          const creatorsMap = creatorsData.reduce((acc, creator) => {
            acc[creator.user_email] = creator.display_name || null;
            return acc;
          }, {});

          const enrichedPlaylists = filteredPlaylists.map(p => ({
            ...p,
            creator_name: creatorsMap[p.created_by] || null
          }));
          setPlaylists(enrichedPlaylists);
        } else {
          setPlaylists([]);
        }

      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
      setIsLoading(false);
    };
    fetchPlaylists();
  }, []);

  const handlePlayPlaylist = async (playlist) => {
    const playlistTracks = await PlaylistTrack.filter({ playlist_id: playlist.id }, 'order');
    if (playlistTracks.length === 0) {
        alert("This playlist is empty!");
        return;
    }
    const trackIds = playlistTracks.map(pt => pt.track_id);
    const tracks = await Track.filter({ id: { "$in": trackIds } });

    // Ensure tracks are in the correct order
    const orderedTracks = playlistTracks
      .map(pt => tracks.find(t => t.id === pt.track_id))
      .filter(Boolean); // Filter out any null/undefined if track not found
    
    if (orderedTracks.length === 0) {
      alert("This playlist contains no valid songs!");
      return;
    }

    playPlaylist(orderedTracks);
  };


  return (
    <AnimatePresence>
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="h-48 material-shadow animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : playlists.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PlaylistCard playlist={playlist} onPlay={() => handlePlayPlaylist(playlist)} />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="shadow-md">
          <CardContent className="p-16 text-center text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Playlists Found</h3>
            <p>There are no public playlists with enough songs yet. Check back soon!</p>
          </CardContent>
        </Card>
      )}
    </AnimatePresence>
  );
};


const PlaceholderTab = ({ title }) => (
  <Card className="material-shadow">
    <CardContent className="p-16 text-center text-gray-500">
      <Music className="w-16 h-16 mx-auto mb-4 text-primary" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title} Coming Soon</h3>
      <p>This section is under construction. Check back later!</p>
    </CardContent>
  </Card>
);

export default function DiscoverPage() {
  const { user } = useUser();

  return (
    <div className="container mx-auto py-8 px-4">
      <style>{`
        /* Custom tab styling to match the design */
        .custom-tab {
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
        }
        
        .custom-tab[data-state='active'] {
          background-color: #6A12CC !important;
          color: white !important;
        }
        
        .custom-tab[data-state='inactive'] {
          background-color: transparent !important;
          color: #6B7280 !important;
        }
        
        .custom-tab:hover:not([data-state='active']) {
          color: #374151 !important;
        }
        
        /* Hide default shadcn tab styling */
        .custom-tabs-list {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          height: auto !important;
          gap: 16px;
        }
      `}</style>
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Discover</h1>
        <p className="text-lg text-gray-600">Find talented artists, new tracks, and curated playlists.</p>
      </div>
      
      <Tabs defaultValue="artists" className="w-full">
        <div className="flex justify-center mb-8">
            <TabsList className="custom-tabs-list flex">
              <TabsTrigger value="artists" className="custom-tab">Artists</TabsTrigger>
              <TabsTrigger value="playlists" className="custom-tab">Playlists</TabsTrigger>
              <TabsTrigger value="songs" className="custom-tab">Songs</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="artists"><ArtistsTab user={user} /></TabsContent>
        <TabsContent value="playlists"><PlaylistsTab user={user} /></TabsContent>
        <TabsContent value="songs"><SongsTab user={user} /></TabsContent>
      </Tabs>
    </div>
  );
}
