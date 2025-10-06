
import React, { useState, useEffect, useCallback } from 'react';
import { Playlist, PlaylistTrack, User } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';

export default function AddToPlaylistModal({ isOpen, onClose, song, user }) {
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [error, setError] = useState("");

  const fetchPlaylists = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const playlists = await Playlist.filter({ created_by: user.email }, '-created_date');
      setUserPlaylists(playlists);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      fetchPlaylists();
      // Reset view to select playlist if playlists exist
      // This part will be handled by the !isLoading useEffect to ensure playlists are fetched first
    }
  }, [isOpen, fetchPlaylists]);
  
   useEffect(() => {
    if (!isLoading) {
      setShowCreateNew(userPlaylists.length === 0);
    }
  }, [isLoading, userPlaylists]);

  const handleCreateAndAdd = async () => {
    if (newPlaylistName.length < 3 || newPlaylistName.length > 40) {
      setError("Playlist name must be between 3 and 40 characters.");
      return;
    }
    setError("");

    try {
      // Check if playlist name already exists
      const existingPlaylists = await Playlist.filter({ name: newPlaylistName, created_by: user.email }); // Added created_by to scope the check to current user's playlists
      if (existingPlaylists.length > 0) {
        setError("A playlist with this name already exists. Please choose another name.");
        return;
      }
      
      const newPlaylist = await Playlist.create({ name: newPlaylistName, song_count: 1, created_by: user.email });
      await PlaylistTrack.create({ playlist_id: newPlaylist.id, track_id: song.id });
      onClose(); // Close modal on success
    } catch (err) {
      console.error("Failed to create playlist and add song:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleAddToExisting = async () => {
    if (!selectedPlaylist) {
      setError("Please select a playlist.");
      return;
    }
    setError("");
    try {
      // Check if song already exists in the selected playlist
      const existingTracks = await PlaylistTrack.filter({ playlist_id: selectedPlaylist, track_id: song.id });
      if (existingTracks.length > 0) {
        setError("This song is already in the selected playlist.");
        return;
      }

      await PlaylistTrack.create({ playlist_id: selectedPlaylist, track_id: song.id });
      // Optionally, update the song count on the playlist
      const playlist = userPlaylists.find(p => p.id === selectedPlaylist);
      if(playlist) {
          await Playlist.update(selectedPlaylist, { song_count: (playlist.song_count || 0) + 1 });
      }
      onClose();
    } catch (err) {
      console.error("Failed to add song to existing playlist:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state for next time
    setTimeout(() => {
        setSelectedPlaylist("");
        setNewPlaylistName("");
        setError("");
        setShowCreateNew(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add "{song?.title}" to a playlist</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {showCreateNew ? (
            <div className="space-y-4">
              <Label htmlFor="new-playlist-name">New Playlist Name</Label>
              <Input
                id="new-playlist-name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="e.g., Late Night Drives"
                maxLength={40}
              />
              {userPlaylists.length > 0 && (
                 <Button variant="link" className="p-0 h-auto" onClick={() => setShowCreateNew(false)}>
                    Or add to existing playlist
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a playlist..." />
                </SelectTrigger>
                <SelectContent>
                  {userPlaylists.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <Button variant="link" className="p-0 h-auto" onClick={() => setShowCreateNew(true)}>
                  <Plus className="w-4 h-4 mr-1"/> Create a new playlist
              </Button>
            </div>
          )}
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={showCreateNew ? handleCreateAndAdd : handleAddToExisting}>
            {showCreateNew ? "Create & Add" : "Add Song"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
