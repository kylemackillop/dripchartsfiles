
import React, { useState, useEffect, useCallback } from 'react';
import { Playlist, PlaylistTrack, Track, User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Star, Clock, Edit3, Save, X, Trash2, Play, Pause, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@/components/contexts/UserContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge'; // Added Badge import

export default function PlaylistInfoPage() {
    const [playlist, setPlaylist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser();
    // Removed useNavigate as it's not used directly in the component's logic.
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({ name: '', description: '' });
    const [playingTrack, setPlayingTrack] = useState(null); // Added playingTrack state

    const playlistId = new URLSearchParams(window.location.search).get('id');

    const fetchPlaylistData = useCallback(async () => {
        if (!playlistId) {
            setError("Playlist ID is missing.");
            setIsLoading(false);
            return;
        }

        try {
            const pl = await Playlist.get(playlistId);
            if (!pl) {
                setError("Playlist not found.");
                setIsLoading(false);
                return;
            }

            // Check for read access
            if (!pl.is_public && pl.created_by !== user?.email) {
                 setError("You do not have permission to view this playlist.");
                 setIsLoading(false);
                 return;
            }
            
            setPlaylist(pl);
            setEditedData({ name: pl.name, description: pl.description || '' });

            const playlistTracks = await PlaylistTrack.filter({ playlist_id: playlistId });
            const trackIds = playlistTracks.map(pt => pt.track_id);
            
            if (trackIds.length > 0) {
                const trackDetails = await Track.filter({ id: { "$in": trackIds } });
                // Preserve order from playlist
                const orderedTracks = trackIds.map(id => trackDetails.find(t => t.id === id)).filter(Boolean);
                setTracks(orderedTracks);
            } else {
                setTracks([]); // Ensure tracks are cleared if playlist becomes empty
            }

        } catch (err) {
            console.error("Error fetching playlist:", err);
            setError("Could not load playlist details.");
        } finally {
            setIsLoading(false);
        }
    }, [playlistId, user]); // Dependencies for useCallback

    useEffect(() => {
        fetchPlaylistData();
    }, [fetchPlaylistData]); // useEffect now depends on the memoized fetchPlaylistData

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if(playlist) {
            setEditedData({ name: playlist.name, description: playlist.description || '' });
        }
    };

    const handleSave = async () => {
        if (!playlist || !user || playlist.created_by !== user.email) return;

        try {
            await Playlist.update(playlist.id, editedData);
            setPlaylist(prev => ({ ...prev, ...editedData }));
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to save playlist:", err);
            alert("Error saving changes. Please try again.");
        }
    };

    const handleRemoveTrack = async (trackId) => {
        if (!playlist || !user || playlist.created_by !== user.email) return;
        
        try {
            const pt_to_delete = await PlaylistTrack.filter({ playlist_id: playlist.id, track_id: trackId });
            if (pt_to_delete.length > 0) {
                await PlaylistTrack.delete(pt_to_delete[0].id);
                // Update track count on playlist
                await Playlist.update(playlist.id, { song_count: (playlist.song_count || 1) - 1 });
                // Refetch data
                fetchPlaylistData(); 
            }
        } catch (err) {
            console.error("Failed to remove track:", err);
        }
    }

    if (isLoading) {
        return <div className="container mx-auto p-8 text-center">Loading...</div>;
    }
    if (error) {
        return <div className="container mx-auto p-8 text-center text-red-500">{error}</div>;
    }
    if (!playlist) {
        return <div className="container mx-auto p-8 text-center">Playlist not found.</div>;
    }

    const isOwner = user?.email === playlist.created_by;

    return (
        <div className="container mx-auto py-12 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="material-shadow">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                {isEditing ? (
                                    <Input 
                                        value={editedData.name}
                                        onChange={(e) => setEditedData(prev => ({...prev, name: e.target.value}))}
                                        className="text-3xl font-bold border-2 border-primary"
                                    />
                                ) : (
                                    <CardTitle className="text-3xl font-bold">{playlist.name}</CardTitle>
                                )}
                                {isEditing ? (
                                    <Textarea
                                        value={editedData.description}
                                        onChange={(e) => setEditedData(prev => ({...prev, description: e.target.value}))}
                                        placeholder="Add a description..."
                                        className="mt-2"
                                    />
                                ) : (
                                    <CardDescription className="mt-2">{playlist.description || "No description."}</CardDescription>
                                )}
                            </div>
                            {isOwner && (
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <Button size="icon" onClick={handleSave}><Save className="w-4 h-4"/></Button>
                                            <Button size="icon" variant="ghost" onClick={handleEditToggle}><X className="w-4 h-4"/></Button>
                                        </>
                                    ) : (
                                        <Button size="icon" variant="ghost" onClick={handleEditToggle}><Edit3 className="w-4 h-4"/></Button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                            {/* Changed UserIcon to MapPin as per outline's icon imports */}
                            <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> By {playlist.created_by}</div>
                            <div className="flex items-center gap-1"><Music className="w-4 h-4" /> {playlist.song_count || 0} songs</div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 mt-4">
                            {tracks.length > 0 ? tracks.map(track => (
                                <Card key={track.id} className="p-3 flex items-center gap-4 hover:bg-gray-50/50">
                                    <img src={track.cover_art_url} alt={track.title} className="w-12 h-12 rounded-md object-cover"/>
                                    <div className="flex-grow">
                                        <Link to={createPageUrl(`TrackDetails?id=${track.id}`)} className="font-semibold hover:underline">{track.title}</Link>
                                        <p className="text-sm text-gray-600">{track.artist_name}</p>
                                    </div>
                                    <div className="text-sm text-gray-500">{track.duration}</div>
                                    {isOwner && (
                                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRemoveTrack(track.id)}>
                                            <Trash2 className="w-4 h-4"/> {/* Changed Trash to Trash2 */}
                                        </Button>
                                    )}
                                </Card>
                            )) : (
                                <p className="text-center text-gray-500 py-8">This playlist is empty.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
