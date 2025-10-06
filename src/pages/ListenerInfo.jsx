import React, { useState, useEffect } from 'react';
import { User, Playlist, Vote, PlaylistListen, PlaylistRating, UserData } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Headphones, Star, List, BarChart, Music, Pencil, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function ListenerInfoPage() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ playlists: 0, ratedSongs: 0, tastemaker: 0 });
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await User.me();
                setUser(userData);
                await loadUserStats(userData.email);
            } catch (e) {
                console.error("Failed to load user");
                User.login();
            }
        };
        loadUserData();
    }, []);

    const loadUserStats = async (userEmail) => {
        try {
            const [playlists, userVotes, allUsers] = await Promise.all([
                Playlist.filter({ created_by: userEmail }),
                Vote.filter({ voter_email: userEmail }),
                User.list()
            ]);
            
            const enrichedPlaylists = await Promise.all(playlists.map(async (playlist) => {
                const [listens, ratings] = await Promise.all([
                    PlaylistListen.filter({ playlist_id: playlist.id }),
                    PlaylistRating.filter({ playlist_id: playlist.id })
                ]);
                const totalListens = listens.length;
                const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
                return { ...playlist, totalListens, averageRating };
            }));

            setUserPlaylists(enrichedPlaylists);

            // Calculate tastemaker rank by comparing vote count with other users
            const userVoteCounts = [];
            for (const user of allUsers) {
                const votes = await Vote.filter({ voter_email: user.email });
                userVoteCounts.push({
                    email: user.email,
                    voteCount: votes.length
                });
            }

            // Sort by vote count descending
            userVoteCounts.sort((a, b) => b.voteCount - a.voteCount);
            
            // Find current user's rank
            const userRank = userVoteCounts.findIndex(u => u.email === userEmail) + 1;

            setStats({
                playlists: playlists.length,
                ratedSongs: userVotes.length,
                tastemaker: userRank || userVoteCounts.length
            });
        } catch (error) {
            console.error("Error loading user stats:", error);
        }
        setIsLoading(false);
    };

    const formatDuration = (minutes) => {
        if (!minutes || minutes === 0) return "0m";
        const totalMinutes = Math.round(minutes);
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    if (isLoading) {
        return <div className="container mx-auto py-8 px-4"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/4"></div><div className="h-32 bg-gray-200 rounded"></div></div></div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto py-8 px-4 max-w-4xl"
        >
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Listener Profile</h1>
                <p className="text-lg text-gray-600">Your hub for music discovery and curation.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="material-shadow">
                    <CardContent className="p-6 text-center">
                        <List className="w-10 h-10 mx-auto text-primary mb-2" />
                        <div className="text-3xl font-bold text-gray-900">{stats.playlists}</div>
                        <div className="text-gray-600">Playlists Created</div>
                    </CardContent>
                </Card>
                <Card className="material-shadow">
                    <CardContent className="p-6 text-center">
                        <Star className="w-10 h-10 mx-auto text-primary mb-2" />
                        <div className="text-3xl font-bold text-gray-900">{stats.ratedSongs}</div>
                        <div className="text-gray-600">Songs Rated</div>
                    </CardContent>
                </Card>
                 <Card className="material-shadow">
                    <CardContent className="p-6 text-center">
                        <BarChart className="w-10 h-10 mx-auto text-primary mb-2" />
                        <div className="text-3xl font-bold text-gray-900">#{stats.tastemaker}</div>
                        <div className="text-gray-600">Tastemaker Rank</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Your Playlists</CardTitle>
                    <CardDescription>All the playlists you've created.</CardDescription>
                </CardHeader>
                <CardContent>
                    {userPlaylists.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            {userPlaylists.map(playlist => (
                                <Link key={playlist.id} to={createPageUrl(`EditPlaylist?id=${playlist.id}`)}>
                                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    {playlist.cover_image_url ? (
                                                        <img
                                                            src={playlist.cover_image_url}
                                                            alt={`${playlist.name} cover`}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                                                            <Music className="w-8 h-8 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-lg mb-1 truncate">{playlist.name}</h3>
                                                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                                                            <Pencil className="w-4 h-4 text-gray-500" />
                                                        </Button>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                        <span>{playlist.song_count || 0} songs</span>
                                                        <span>•</span>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{formatDuration(playlist.duration_minutes)}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {playlist.description && (
                                                        <p className="text-sm text-gray-600 line-clamp-2">{playlist.description}</p>
                                                    )}
                                                    
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                                        <div className="flex items-center gap-1">
                                                            <Headphones className="w-4 h-4" />
                                                            <span>{playlist.totalListens || 0}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4" />
                                                            <span>{playlist.averageRating ? playlist.averageRating.toFixed(1) : 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <Music className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No playlists yet</h3>
                            <p className="mb-4">Create your first playlist to start curating your favorite tracks.</p>
                            <Link to={createPageUrl("Discover")}>
                                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                                    Discover Music
                                </button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}