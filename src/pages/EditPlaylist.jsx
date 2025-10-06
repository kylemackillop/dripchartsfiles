import React, { useState, useEffect, useCallback } from "react";
import { Playlist, PlaylistTrack, Track } from "@/api/entities";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Music, Trash2, GripVertical, Save, AlertTriangle, ArrowLeft, Upload, Camera } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';

const parseDuration = (durationStr) => {
  if (!durationStr || typeof durationStr !== 'string') return 0;
  const parts = durationStr.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    return minutes + (seconds / 60);
  }
  return 0;
};

export default function EditPlaylistPage() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [playlistData, setPlaylistData] = useState({
    name: "",
    description: "",
    cover_image_url: "",
    is_public: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const getPlaylistId = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }, []);

  const loadPlaylist = useCallback(async (playlistId) => {
    setIsLoading(true);
    try {
      const authUser = await User.me();
      setUser(authUser);

      const [playlistResult] = await Playlist.filter({ id: playlistId });
      
      if (!playlistResult || playlistResult.created_by !== authUser.email) {
        navigate(createPageUrl("Charts"));
        return;
      }
      
      setPlaylist(playlistResult);
      setPlaylistData({
        name: playlistResult.name || "",
        description: playlistResult.description || "",
        cover_image_url: playlistResult.cover_image_url || "",
        is_public: playlistResult.is_public !== false
      });

      const playlistTracks = await PlaylistTrack.filter({ playlist_id: playlistId }, 'order');
      if (playlistTracks.length > 0) {
        const trackIds = playlistTracks.map(pt => pt.track_id);
        const trackDetails = await Track.filter({ id: { "$in": trackIds } });
        
        const trackMap = trackDetails.reduce((acc, track) => {
          acc[track.id] = track;
          return acc;
        }, {});

        const orderedSongs = playlistTracks
          .map(pt => ({ ...trackMap[pt.track_id], playlistTrackId: pt.id }))
          .filter(Boolean);

        setSongs(orderedSongs);
      } else {
        setSongs([]);
      }
    } catch (error) {
      console.error("Error loading playlist:", error);
      navigate(createPageUrl("Charts"));
    }
    setIsLoading(false);
  }, [navigate]);

  useEffect(() => {
    const playlistId = getPlaylistId();
    if (playlistId) {
      loadPlaylist(playlistId);
    } else {
      setIsLoading(false);
    }
  }, [getPlaylistId, loadPlaylist]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be smaller than 10MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      const { file_url } = await UploadFile({ file });
      setPlaylistData(prev => ({ ...prev, cover_image_url: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const newSongs = Array.from(songs);
    const [reorderedSong] = newSongs.splice(result.source.index, 1);
    newSongs.splice(result.destination.index, 0, reorderedSong);

    setSongs(newSongs);
  };

  const handleDeleteSong = async (songToDelete) => {
    try {
      await PlaylistTrack.delete(songToDelete.playlistTrackId);
      const newSongs = songs.filter(song => song.id !== songToDelete.id);
      setSongs(newSongs);

      const totalDuration = newSongs.reduce((sum, song) => sum + parseDuration(song.duration), 0);
      
      await Playlist.update(playlist.id, {
        song_count: newSongs.length,
        duration_minutes: totalDuration
      });
    } catch (error) {
      console.error("Error deleting song:", error);
      alert("Error removing song from playlist.");
    }
  };

  const handleSave = async () => {
    if (!playlistData.name.trim()) {
      alert("Playlist name is required");
      return;
    }

    setIsSaving(true);
    try {
      const totalDuration = songs.reduce((sum, song) => sum + parseDuration(song.duration), 0);

      await Playlist.update(playlist.id, {
        name: playlistData.name,
        description: playlistData.description,
        cover_image_url: playlistData.cover_image_url,
        is_public: playlistData.is_public,
        song_count: songs.length,
        duration_minutes: totalDuration
      });

      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        await PlaylistTrack.update(song.playlistTrackId, { order: i + 1 });
      }

      alert("Playlist saved successfully!");
    } catch (error) {
      console.error("Error saving playlist:", error);
      alert("Error saving playlist. Please try again.");
    }
    setIsSaving(false);
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-8 px-4 max-w-4xl"
    >
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(createPageUrl("ListenerInfo"))}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listener Profile
        </Button>
        <h1 className="text-4xl font-bold text-gray-800">Edit Playlist</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Playlist Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Playlist Name</Label>
                <Input
                  value={playlistData.name}
                  onChange={(e) => setPlaylistData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter playlist name"
                />
              </div>

              <div className="space-y-2">
                <Label>Playlist Cover Image</Label>
                <div className="flex items-center gap-4">
                  {playlistData.cover_image_url ? (
                    <div className="relative">
                      <img
                        src={playlistData.cover_image_url}
                        alt="Playlist cover"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => document.getElementById('playlist-image-upload').click()}
                        className="absolute bottom-1 right-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
                        disabled={isUploadingImage}
                      >
                        <Camera className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Music className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('playlist-image-upload').click()}
                      disabled={isUploadingImage}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploadingImage ? "Uploading..." : "Upload Image"}
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">Recommended: 500x500px or larger, max 10MB</p>
                  </div>
                </div>
                <input
                  id="playlist-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={playlistData.description}
                  onChange={(e) => setPlaylistData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your playlist..."
                  className="h-24"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="is_public"
                  type="checkbox"
                  checked={playlistData.is_public}
                  onChange={(e) => setPlaylistData(prev => ({ ...prev, is_public: e.target.checked }))}
                />
                <Label htmlFor="is_public">Make playlist public</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md mt-6">
            <CardHeader>
              <CardTitle>Songs ({songs.length})</CardTitle>
              <CardDescription>Drag and drop to reorder songs</CardDescription>
            </CardHeader>
            <CardContent>
              {songs.length > 0 ? (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="playlist-songs">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {songs.map((song, index) => (
                          <Draggable key={song.id} draggableId={song.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-md"
                              >
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                  {song.cover_art_url ? (
                                    <img src={song.cover_art_url} alt={song.title} className="w-full h-full object-cover rounded" />
                                  ) : (
                                    <Music className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{song.title}</p>
                                  <p className="text-sm text-gray-500 truncate">{song.artist_name}</p>
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Remove song?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove "{song.title}" from this playlist?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteSong(song)}>
                                        Remove
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Music className="w-12 h-12 mx-auto mb-4" />
                  <p>No songs in this playlist yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-md sticky top-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  {playlistData.cover_image_url ? (
                    <img
                      src={playlistData.cover_image_url}
                      alt="Playlist cover"
                      className="w-full aspect-square object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <Music className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold">{playlistData.name || "Untitled Playlist"}</h3>
                  <p className="text-gray-500">{songs.length} songs</p>
                </div>
                
                <Button onClick={handleSave} disabled={isSaving} className="w-full bg-[#6A12CC] hover:bg-[#26054D]">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}