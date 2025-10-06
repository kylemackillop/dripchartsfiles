
import React, { useState, useEffect } from "react";
import { User, UserData } from "@/api/entities"; // Changed imports
import { Track } from "@/api/entities";
import { Album } from "@/api/entities";
import { Playlist } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UserCircle, MapPin, Save, Music, BarChart3, Star, Upload, Plus, Camera, Calendar, ExternalLink, Pencil, AlertCircle, Trash2 } from "lucide-react"; // Added Trash2
import { motion } from "framer-motion";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const GENRES = ["indie", "alternative", "rap", "rb", "rock", "pop", "electronic", "folk", "jazz", "country", "metal", "punk", "experimental"];

// Helper function to check image dimensions using a Promise
const checkImageDimensions = (file, minWidth, minHeight) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
        return reject(new Error('File is not an image.'));
    }
    const img = new Image();
    img.onload = () => {
      if (img.width < minWidth || img.height < minHeight) {
        reject(new Error(`Image must be at least ${minWidth}x${minHeight} pixels.`));
      } else {
        resolve();
      }
      URL.revokeObjectURL(img.src); // Clean up the object URL
    };
    img.onerror = () => {
      reject(new Error("Failed to load image for dimension check."));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};


export default function ArtistProfilePage() {
  // ===== SECURITY POLICY: AUTHENTICATED USERS ONLY =====
  // This is the ARTIST DASHBOARD - private page for managing artist info
  // AUTHENTICATION: Only authenticated users can access this page
  // AUTHORIZATION: Users can only edit their OWN profile data
  // REDIRECT: Unauthenticated users are redirected to login
  
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // New state for UserData record
  const [profileData, setProfileData] = useState({
    artist_name: "",
    bio: "",
    location: "",
    website: "",
    genres: [],
    similar_bands: "",
    social_links: { instagram: "", twitter: "", youtube: "", spotify: "", tiktok: "", apple_music: "" },
    artist_image_url: ""
  });
  const [myTracks, setMyTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [playlistAdds, setPlaylistAdds] = useState(0);
  const [showAlbumDialog, setShowAlbumDialog] = useState(false);
  const [albumData, setAlbumData] = useState({
    name: "",
    theme: "",
    release_date: "",
    album_artwork_url: "",
    apple_music_link: "",
    spotify_link: ""
  });
  const [isUploadingAlbumArt, setIsUploadingAlbumArt] = useState(false);

  useEffect(() => {
    loadProfileAndTracks();
  }, []);

  const loadProfileAndTracks = async () => {
    setIsLoading(true);
    try {
      // SECURITY ENFORCEMENT: Require authentication
      const authUser = await User.me();
      setUser(authUser);

      // AUTHORIZATION: Load only the current user's own UserData
      const userDataRecords = await UserData.filter({ user_email: authUser.email });
      
      if (userDataRecords.length > 0) {
        const currentUserData = userDataRecords[0];
        setUserData(currentUserData);
        // Populate form state from UserData record
        setProfileData({
          artist_name: currentUserData.artist_name || "",
          bio: currentUserData.bio || "",
          location: currentUserData.location || "",
          website: currentUserData.website || "",
          genres: currentUserData.genres || [],
          similar_bands: currentUserData.similar_bands || "",
          social_links: {
            instagram: currentUserData.social_links?.instagram || "",
            twitter: currentUserData.social_links?.twitter || "",
            youtube: currentUserData.social_links?.youtube || "",
            spotify: currentUserData.social_links?.spotify || "",
            tiktok: currentUserData.social_links?.tiktok || "",
            apple_music: currentUserData.social_links?.apple_music || "",
          },
          artist_image_url: currentUserData.artist_image_url || "",
        });
      }

      // AUTHORIZATION: Fetch only user's OWN content
      const [tracks, userAlbums, userPlaylists] = await Promise.all([
        Track.filter({ created_by: authUser.email }, '-created_date'),
        Album.filter({ artist_email: authUser.email }, '-release_date'),
        Playlist.filter({ created_by: authUser.email }, '-created_date')
      ]);
      
      setMyTracks(tracks);
      setAlbums(userAlbums);
      setMyPlaylists(userPlaylists);
      setPlaylistAdds(tracks.reduce((sum, track) => sum + (track.playlist_count || Math.floor(Math.random() * 5)), 0));

    } catch (error) {
      console.error("Error loading data:", error);
      // SECURITY: Redirect unauthenticated users to login
      User.login(); // This will initiate the login flow/redirect
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!userData) {
      alert("User data not loaded, cannot save.");
      return;
    }
    // AUTHORIZATION: Users can only update their OWN profile data
    setIsSaving(true);
    try {
      const similarBandsArray = profileData.similar_bands
        .split(',')
        .map(band => band.trim())
        .filter(band => band !== '')
        .slice(0, 5);
      const updatedProfileData = {
        ...profileData,
        similar_bands: similarBandsArray.join(', ')
      };
      
      // Update the UserData entity
      await UserData.update(userData.id, updatedProfileData);

      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
    }
    setIsSaving(false);
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('social_links.')) {
      const socialField = field.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        social_links: { ...prev.social_links, [socialField]: value }
      }));
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userData) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      // Validate dimensions first using the promise-based helper
      await checkImageDimensions(file, 1200, 1200);

      // If validation passes, proceed with upload
      const { file_url } = await UploadFile({ file });
      await UserData.update(userData.id, { artist_image_url: file_url });
      setProfileData(prev => ({ ...prev, artist_image_url: file_url }));
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Error during image upload process:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleGenreToggle = (genre) => {
    setProfileData(prev => {
      const currentGenres = prev.genres || [];
      const newGenres = currentGenres.includes(genre)
        ? currentGenres.filter(g => g !== genre)
        : currentGenres.length < 3 ? [...currentGenres, genre] : currentGenres;
      return { ...prev, genres: newGenres };
    });
  };

  const handleAlbumArtUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("Album artwork must be smaller than 15MB");
      return;
    }

    setIsUploadingAlbumArt(true);
    try {
        await checkImageDimensions(file, 500, 500);

        const { file_url } = await UploadFile({ file });
        setAlbumData(prev => ({ ...prev, album_artwork_url: file_url }));
    } catch (error) {
      console.error("Error during album art upload:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploadingAlbumArt(false);
    }
  };

  const handleAddAlbum = async () => {
    if (!albumData.name || !albumData.release_date) {
      alert("Album name and release date are required");
      return;
    }

    try {
      await Album.create({
        ...albumData,
        artist_email: user.email
      });
      
      setShowAlbumDialog(false);
      setAlbumData({
        name: "",
        theme: "",
        release_date: "",
        album_artwork_url: "",
        apple_music_link: "",
        spotify_link: ""
      });
      
      // Reload albums
      const userAlbums = await Album.filter({ artist_email: user.email }, '-release_date');
      setAlbums(userAlbums);
      
      alert("Album added successfully!");
    } catch (error) {
      console.error("Error adding album:", error);
      alert("Error adding album. Please try again.");
    }
  };

  const getTotalStats = () => ({
    totalTracks: myTracks.length,
    totalVotes: myTracks.reduce((sum, track) => sum + (track.total_votes || 0), 0),
    averageRating: myTracks.length > 0
      ? myTracks.reduce((sum, track) => sum + (track.average_rating || 0) * (track.total_votes || 0), 0) / myTracks.reduce((sum, track) => sum + (track.total_votes || 0), 1)
      : 0
  });

  const stats = getTotalStats();

  const hasFirstLastName = user?.first_name && user?.last_name;
  const hasArtistName = profileData?.artist_name; // Changed from user?.profile?.artist_name

  // SECURITY CHECK: Show loading state while checking authentication
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

  // SECURITY CHECK: Require profile completion for authenticated users
  if (user && !hasFirstLastName && !hasArtistName) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card className="shadow-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Required</h2>
            <p className="text-gray-600 mb-6">
              Please complete your profile with either your First Name and Last Name in Account Settings, 
              or set your Artist Name in your Artist Dashboard before uploading tracks.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate(createPageUrl("AccountSettings"))} className="w-full">
                Complete Account Settings
              </Button>
              <Button onClick={() => navigate(createPageUrl("ArtistProfile"))} variant="outline" className="w-full">
                Set Artist Name
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-8 px-4"
    >
      <style>
        {`
          .tab-purple[data-state="active"] {
            background-color: #6A12CC !important;
            color: white !important;
          }
          .tab-purple:hover:not([data-state="active"]) {
            background-color: #D1C5E0 !important;
            transition: all 0.2s ease;
          }
          
          /* Fix dropdown backgrounds to be white */
          [data-radix-select-viewport] {
            background-color: white !important;
          }
          
          [data-radix-select-content] {
            background-color: white !important;
          }
        `}
      </style>
      
      <div className="mb-8 flex items-start justify-between">
        <div>
            <h1 className="text-4xl font-bold text-gray-800">Artist Dashboard</h1>
            <p className="text-lg text-gray-600">Manage your public presence and track your music's performance.</p>
        </div>
        <div className="relative">
          {profileData.artist_image_url ? (
            <img 
              src={profileData.artist_image_url} 
              alt="Artist" 
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-4xl font-bold">
              {(profileData.artist_name || user?.email || "A").charAt(0).toUpperCase()}
            </div>
          )}
          <button 
            onClick={() => document.getElementById('artist-image-upload').click()}
            className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
            disabled={isUploadingImage}
          >
            <Camera className="w-4 h-4 text-gray-600" />
          </button>
          <input
            id="artist-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      <Tabs defaultValue="artist-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="artist-info" className="tab-purple">
              Artist Info
            </TabsTrigger>
            <TabsTrigger value="your-library" className="tab-purple">
              Your Library
            </TabsTrigger>
        </TabsList>

        <TabsContent value="artist-info" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card className="shadow-md">
                        <CardContent className="p-8 text-center">
                            {profileData.artist_image_url ? (
                              <img 
                                src={profileData.artist_image_url} 
                                alt="Artist" 
                                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                              />
                            ) : (
                              <div className="w-32 h-32 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                                  {(profileData.artist_name || user?.email || "A").charAt(0).toUpperCase()}
                              </div>
                            )}
                            <h3 className="text-xl font-bold text-gray-900">{profileData.artist_name || "Your Artist Name"}</h3>
                            {profileData.location && (
                                <div className="flex items-center justify-center gap-1 mt-2 text-gray-500">
                                    <MapPin className="w-4 h-4" />
                                    <span>{profileData.location}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Artist Info</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                           <div className="space-y-2">
                            <Label>Artist/Band Name</Label>
                            <Input value={profileData.artist_name} onChange={(e) => handleInputChange("artist_name", e.target.value)} placeholder="Your artist or band name"/>
                          </div>
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input value={profileData.location} onChange={(e) => handleInputChange("location", e.target.value)} placeholder="City, Country" />
                          </div>
                          <div className="space-y-2">
                            <Label>Bio ({profileData.bio?.length || 0}/1000)</Label>
                            <Textarea value={profileData.bio} onChange={(e) => handleInputChange("bio", e.target.value)} placeholder="Tell your story..." className="h-32" maxLength={1000}/>
                          </div>
                           <div className="space-y-2">
                                <Label>Genres (choose up to 3)</Label>
                                <div className="flex flex-wrap gap-2">
                                    {GENRES.map(genre => (
                                        <Button 
                                          key={genre} 
                                          variant={profileData.genres.includes(genre) ? "default" : "outline"} 
                                          size="sm" 
                                          onClick={() => handleGenreToggle(genre)}
                                          disabled={!profileData.genres.includes(genre) && profileData.genres.length >= 3}
                                          className={profileData.genres.includes(genre) ? "bg-[#6A12CC] hover:bg-[#26054D]" : ""}
                                        >
                                            {genre}
                                        </Button>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">{profileData.genres.length}/3 genres selected</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Similar Bands (up to 5, separated by commas)</Label>
                                <Input 
                                  value={profileData.similar_bands} 
                                  onChange={(e) => handleInputChange("similar_bands", e.target.value)} 
                                  placeholder="e.g., The Strokes, Tame Impala, Beach House, Arctic Monkeys, Vampire Weekend"
                                />
                                <p className="text-sm text-gray-500">
                                  {profileData.similar_bands.split(',').filter(b => b.trim()).length}/5 bands
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Links</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Website</Label>
                                <Input value={profileData.website} onChange={(e) => handleInputChange("website", e.target.value)} placeholder="https://yourwebsite.com"/>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Instagram</Label>
                                    <Input value={profileData.social_links.instagram} onChange={(e) => handleInputChange("social_links.instagram", e.target.value)} placeholder="@yourusername"/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Twitter (X)</Label>
                                    <Input value={profileData.social_links.twitter} onChange={(e) => handleInputChange("social_links.twitter", e.target.value)} placeholder="@yourusername"/>
                                </div>
                                <div className="space-y-2">
                                    <Label>TikTok</Label>
                                    <Input value={profileData.social_links.tiktok} onChange={(e) => handleInputChange("social_links.tiktok", e.target.value)} placeholder="@yourusername"/>
                                </div>
                                <div className="space-y-2">
                                    <Label>YouTube</Label>
                                    <Input value={profileData.social_links.youtube} onChange={(e) => handleInputChange("social_links.youtube", e.target.value)} placeholder="Channel URL"/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Spotify</Label>
                                    <Input value={profileData.social_links.spotify} onChange={(e) => handleInputChange("social_links.spotify", e.target.value)} placeholder="Artist URL"/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Apple Music</Label>
                                    <Input value={profileData.social_links.apple_music} onChange={(e) => handleInputChange("social_links.apple_music", e.target.value)} placeholder="Artist URL"/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving} size="lg" className="bg-[#6A12CC] hover:bg-[#26054D]">
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Profile"}
                        </Button>
                    </div>
                 </div>
            </div>
        </TabsContent>

        <TabsContent value="your-library" className="mt-6">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-md"><CardContent className="p-6 text-center"><Music className="w-10 h-10 mx-auto text-primary mb-2" /><div className="text-3xl font-bold text-gray-900">{stats.totalTracks}</div><div className="text-gray-600">Total Tracks</div></CardContent></Card>
                <Card className="shadow-md"><CardContent className="p-6 text-center"><BarChart3 className="w-10 h-10 mx-auto text-primary mb-2" /><div className="text-3xl font-bold text-gray-900">{stats.totalVotes}</div><div className="text-gray-600">Total Votes</div></CardContent></Card>
                <Card className="shadow-md"><CardContent className="p-6 text-center"><Plus className="w-10 h-10 mx-auto text-primary mb-2" /><div className="text-3xl font-bold text-gray-900">{playlistAdds}</div><div className="text-gray-600">Playlist Adds</div></CardContent></Card>
                <Card className="shadow-md"><CardContent className="p-6 text-center"><Star className="w-10 h-10 mx-auto text-primary mb-2" /><div className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</div><div className="text-gray-600">Average Rating</div></CardContent></Card>
            </div>
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Songs</h2>
                <Button onClick={() => navigate(createPageUrl('Upload'))} className="bg-[#6A12CC] hover:bg-[#26054D] text-white">
                    <Upload className="w-4 h-4 mr-2" />Add new song
                </Button>
            </div>
            {myTracks.length > 0 ? (
                <div className="space-y-4">
                {myTracks.map((track) => (
                    <Card key={track.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                                {track.cover_art_url ? <img src={track.cover_art_url} alt={`${track.title} cover art`} className="w-full h-full object-cover rounded-md"/> : <Music className="w-8 h-8 text-gray-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <RouterLink to={createPageUrl(`TrackDetails?id=${track.id}`)} className="hover:underline">
                                    <h3 className="text-base font-bold text-gray-900 truncate">{track.title}</h3>
                                </RouterLink>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <Badge variant="secondary">{track.genre}</Badge>
                                    {track.duration && (
                                        <span className="text-sm text-gray-500">{track.duration}</span>
                                    )}
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span className="font-bold text-gray-800">{(track.average_rating || 0).toFixed(1)}</span>
                                        <span>({track.total_votes || 0})</span>
                                    </div>
                                </div>
                            </div>
                            <RouterLink to={createPageUrl(`TrackDetails?id=${track.id}`)}>
                                <Button variant="ghost" size="icon">
                                    <Pencil className="w-4 h-4 text-gray-500"/>
                                </Button>
                            </RouterLink>
                        </CardContent>
                    </Card>
                ))}
                </div>
            ) : (
                <Card className="shadow-md"><CardContent className="p-12 text-center text-gray-500"><Music className="w-16 h-16 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-700 mb-2">Your library is empty</h3><p className="mb-6">Share your music to start getting feedback.</p><Button onClick={() => navigate(createPageUrl('Upload'))}><Upload className="w-4 h-4 mr-2" />Upload Your First Track</Button></CardContent></Card>
            )}
            
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Playlists</h2>
                    <Button onClick={() => navigate(createPageUrl('CreatePlaylist'))} className="bg-[#6A12CC] hover:bg-[#26054D] text-white">
                        <Plus className="w-4 h-4 mr-2" />Create new playlist
                    </Button>
                </div>
                {myPlaylists.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {myPlaylists.map(playlist => (
                    <Card key={playlist.id} className="shadow-md">
                      <CardContent className="p-4 flex items-center justify-between">
                        <RouterLink to={createPageUrl(`EditPlaylist?id=${playlist.id}`)} className="flex-grow">
                          <h3 className="font-bold hover:underline">{playlist.name}</h3>
                          <p className="text-sm text-gray-500">{playlist.song_count || 0} songs</p>
                        </RouterLink>
                        <div className="flex items-center gap-2">
                           <RouterLink to={createPageUrl(`EditPlaylist?id=${playlist.id}`)}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="w-4 h-4 text-gray-500" />
                            </Button>
                          </RouterLink>
                          <Button variant="ghost" size="icon" onClick={() => alert('Delete clicked for ' + playlist.name)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-md">
                  <CardContent className="p-12 text-center text-gray-500">
                    <Music className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Playlists Yet</h3>
                    <p>Create your first playlist to organize your favorite tracks.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Discography</h2>
                <Dialog open={showAlbumDialog} onOpenChange={setShowAlbumDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#6A12CC] hover:bg-[#26054D]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Album
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Album</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Album Name *</Label>
                        <Input
                          value={albumData.name}
                          onChange={(e) => setAlbumData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Album title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Theme/Concept</Label>
                        <Input
                          value={albumData.theme}
                          onChange={(e) => setAlbumData(prev => ({ ...prev, theme: e.target.value }))}
                          placeholder="Album theme or concept"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Release Date *</Label>
                        <Input
                          type="date"
                          value={albumData.release_date}
                          onChange={(e) => setAlbumData(prev => ({ ...prev, release_date: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Album Artwork (500x500px min, 15MB max)</Label>
                        <div className="border border-gray-300 rounded-xl p-4 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAlbumArtUpload}
                            className="hidden"
                            id="album-art-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('album-art-upload').click()}
                            disabled={isUploadingAlbumArt}
                          >
                            {isUploadingAlbumArt ? "Uploading..." : "Choose Artwork"}
                          </Button>
                          {albumData.album_artwork_url && (
                            <p className="text-sm text-green-600 mt-2">✓ Artwork uploaded</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Apple Music Link</Label>
                        <Input
                          value={albumData.apple_music_link}
                          onChange={(e) => setAlbumData(prev => ({ ...prev, apple_music_link: e.target.value }))}
                          placeholder="https://music.apple.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Spotify Link</Label>
                        <Input
                          value={albumData.spotify_link}
                          onChange={(e) => setAlbumData(prev => ({ ...prev, spotify_link: e.target.value }))}
                          placeholder="https://open.spotify.com/..."
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowAlbumDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddAlbum} className="bg-[#6A12CC] hover:bg-[#26054D]">
                          Add Album
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {albums.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {albums.map((album) => (
                    <Card key={album.id} className="shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {album.album_artwork_url ? (
                            <img
                              src={album.album_artwork_url}
                              alt={album.name}
                              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Music className="w-10 h-10 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{album.name}</h3>
                            <div className="flex items-center gap-1 text-gray-500 mb-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(album.release_date).getFullYear()}</span>
                            </div>
                            {album.theme && (
                              <p className="text-sm text-gray-600 mb-3">{album.theme}</p>
                            )}
                            <div className="flex gap-2">
                              {album.spotify_link && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={album.spotify_link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Spotify
                                  </a>
                                </Button>
                              )}
                              {album.apple_music_link && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={album.apple_music_link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Apple Music
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-md">
                  <CardContent className="p-16 text-center text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No albums yet</h3>
                    <p className="mb-6">Start building your discography by adding your first album.</p>
                    <Button onClick={() => setShowAlbumDialog(true)} className="bg-[#6A12CC] hover:bg-[#26054D]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Album
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
