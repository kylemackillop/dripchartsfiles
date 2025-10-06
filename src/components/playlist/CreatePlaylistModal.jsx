
import React, { useState } from 'react';
import { Playlist, User } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

export default function CreatePlaylistModal({ isOpen, onClose, user, onPlaylistCreated }) {
  const [playlistName, setPlaylistName] = useState("");
  const [error, setError] = useState("");

  const handleCreatePlaylist = async () => {
    if (playlistName.length < 3 || playlistName.length > 40) {
      setError("Playlist name must be between 3 and 40 characters.");
      return;
    }
    setError("");

    try {
      // Check if playlist name already exists
      const existingPlaylists = await Playlist.filter({ name: playlistName });
      if (existingPlaylists.length > 0) {
        setError("Playlist name already exists.");
        return;
      }

      await Playlist.create({ name: playlistName });
      if (onPlaylistCreated) onPlaylistCreated();
      handleClose();
    } catch (err) {
      console.error("Failed to create playlist:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
        setPlaylistName("");
        setError("");
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new playlist</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="playlist-name">Playlist Name</Label>
          <Input 
            id="playlist-name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="e.g., Summer Vibes"
            maxLength={40}
          />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreatePlaylist}>Create Playlist</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
