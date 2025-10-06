import React, { useState, useEffect } from "react";
import { Track, Vote, User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Star, BarChart3, Calendar, Clock, Loader2, ArrowLeft, Camera } from "lucide-react";
import MusicPlayer from "../components/music/MusicPlayer";
import StarRating from "../components/rating/StarRating";

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

export default function TrackDetailsPage() {
  const [track, setTrack] = useState(null);
  const [user, setUser] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const trackId = params.get("id");
    
    const initialize = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        if (trackId) {
          await loadTrackAndVote(trackId, currentUser.email);
        }
      } catch (error) {
        setUser(null);
        if (trackId) {
          await loadTrackAndVote(trackId, null);
        }
      }
    };

    initialize();
  }, [location.search]);

  const loadTrackAndVote = async (id, userEmail) => {
    setIsLoading(true);
    try {
      const fetchedTrack = await Track.get(id);
      setTrack(fetchedTrack);

      if (userEmail) {
        const votes = await Vote.filter({ track_id: id, voter_email: userEmail });
        if (votes.length > 0) {
          setUserVote(votes[0]);
        } else {
          setUserVote(null);
        }
      } else {
        setUserVote(null);
      }
    } catch (error) {
      console.error("Error loading track details:", error);
      setTrack(null);
    }
    setIsLoading(false);
  };
  
  const handleRating = async (newRating) => {
      if (isRating || !user || !track) return;
      setIsRating(true);

      try {
          // Create or update vote
          if (userVote) {
              await Vote.update(userVote.id, { rating: newRating });
              setUserVote(prev => ({...prev, rating: newRating}));
          } else {
              const newVote = await Vote.create({
                  track_id: track.id,
                  rating: newRating,
                  voter_email: user.email
              });
              setUserVote(newVote);
          }

          // Recalculate track stats
          const allVotes = await Vote.filter({ track_id: track.id });
          const total_votes = allVotes.length;
          const sumOfRatings = allVotes.reduce((sum, vote) => sum + vote.rating, 0);
          const average_rating = total_votes > 0 ? sumOfRatings / total_votes : 0;

          // Update track
          await Track.update(track.id, { total_votes, average_rating });

          // Update local track state
          setTrack(prev => ({
              ...prev,
              total_votes,
              average_rating
          }));

      } catch (error) {
          console.error("Failed to submit rating:", error);
          alert("There was an error submitting your rating.");
      }
      setIsRating(false);
  };

  const handleCoverArtUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB");
      return;
    }
    
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      await Track.update(track.id, { cover_art_url: file_url });
      setTrack(prev => ({...prev, cover_art_url: file_url}));
      alert("Cover art updated successfully!");
    } catch (error) {
      console.error("Error updating cover art:", error);
      alert("Failed to update cover art.");
    }
    setIsUploading(false);
  };

  const handleBackClick = () => {
    // Use window.history.back() for a single click back action
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <Music className="w-24 h-24 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Track Not Found</h1>
          <p className="text-gray-600">The track you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isOwner = user && user.email === track.created_by;

  return (
    <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" onClick={handleBackClick} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
        </Button>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Cover Art & Player */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="material-shadow overflow-hidden">
            {track.cover_art_url ? (
              <img
                src={track.cover_art_url}
                alt={`${track.title} cover art`}
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Music className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </Card>
          <MusicPlayer track={track} />
          {user && (
            <Card className="material-shadow">
                <CardHeader>
                    <CardTitle className="text-center text-lg text-gray-800">Your Rating</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center pb-6">
                    <StarRating
                        currentRating={userVote?.rating || 0}
                        onRate={handleRating}
                        disabled={isRating}
                    />
                </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Track Info & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className={`${genreColors[track.genre]} mb-2`}>
                {GENRES.find(g => g.value === track.genre)?.label}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900">{track.title}</h1>
              <p className="text-2xl text-gray-600 font-medium mt-1">{track.artist_name}</p>
            </div>
            
            {isOwner && (
              <Card className="material-shadow ml-4">
                  <CardContent className="p-4">
                      <p className="text-sm text-gray-600 text-center mb-3">Update Cover Art</p>
                      <input 
                        id="cover-art-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCoverArtUpload} 
                        className="hidden" 
                        disabled={isUploading}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={isUploading}
                        onClick={() => document.getElementById('cover-art-upload').click()}
                      >
                        {isUploading ? (
                             <>
                                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                 Uploading...
                             </>
                        ) : (
                             <>
                                 <Camera className="w-4 h-4 mr-2" />
                                 Change
                             </>
                        )}
                      </Button>
                  </CardContent>
              </Card>
            )}
          </div>

          <Card className="material-shadow">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <Star className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{(track.average_rating || 0).toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Avg. Rating</div>
                </div>
                <div>
                  <BarChart3 className="w-8 h-8 mx-auto text-primary mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{track.total_votes || 0}</div>
                  <div className="text-sm text-gray-500">Total Votes</div>
                </div>
                <div>
                  <Calendar className="w-8 h-8 mx-auto text-primary mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{track.release_year}</div>
                  <div className="text-sm text-gray-500">Released</div>
                </div>
                <div>
                  <Clock className="w-8 h-8 mx-auto text-primary mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{track.duration || "N/A"}</div>
                  <div className="text-sm text-gray-500">Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {track.description && (
              <Card className="material-shadow">
                  <CardHeader>
                      <CardTitle className="text-gray-800">About the track</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap">{track.description}</p>
                  </CardContent>
              </Card>
          )}

          {track.lyrics && (
              <Card className="material-shadow">
                  <CardHeader>
                      <CardTitle className="text-gray-800">Lyrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap">{track.lyrics}</p>
                  </CardContent>
              </Card>
          )}

          <Card className="material-shadow">
            <CardHeader>
              <CardTitle className="text-gray-800">Community Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Comments coming soon...</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}