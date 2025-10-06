import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Play, Music, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function PlaylistCard({ playlist, onPlay, showCreator = true }) {
  const formatDuration = (minutes) => {
    if (!minutes || minutes === 0) return "0m";
    const totalMinutes = Math.round(minutes);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getCreatorName = () => {
    // Use display name if available, otherwise don't show creator info
    if (playlist.creator_name) {
      return playlist.creator_name;
    }
    return null;
  };

  const creatorName = getCreatorName();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="material-shadow hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
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
              {onPlay && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onPlay(playlist)}
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate mb-1">
                {playlist.name}
              </h3>
              {showCreator && creatorName && (
                <p className="text-sm text-gray-600 mb-2">
                  by {creatorName}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  <span>{playlist.song_count || 0} songs</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(playlist.duration_minutes)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {playlist.average_rating > 0 && (
                  <>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold text-gray-800">
                        {(playlist.average_rating || 0).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({playlist.total_ratings || 0} ratings)
                      </span>
                    </div>
                    <span className="text-gray-300">•</span>
                  </>
                )}
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {playlist.total_listens || 0} listens
                  </span>
                </div>
              </div>

              {playlist.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {playlist.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}