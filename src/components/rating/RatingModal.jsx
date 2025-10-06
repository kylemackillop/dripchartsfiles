import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Vote, Track } from '@/api/entities';

export default function RatingModal({ isOpen, onClose, song, user, onRatingUpdate }) {
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    if (isOpen && song && user) {
      loadUserVote();
    }
  }, [isOpen, song, user]);

  const loadUserVote = async () => {
    try {
      const votes = await Vote.filter({ track_id: song.id, voter_email: user.email });
      if (votes.length > 0) {
        setUserVote(votes[0]);
        setCurrentRating(votes[0].rating);
      } else {
        setUserVote(null);
        setCurrentRating(0);
      }
    } catch (error) {
      console.error("Error loading user vote:", error);
    }
  };

  const handleRate = async (rating) => {
    if (isSubmitting || !user || !song) return;
    setIsSubmitting(true);

    try {
      // Create or update vote
      if (userVote) {
        await Vote.update(userVote.id, { rating });
        setUserVote(prev => ({...prev, rating}));
      } else {
        const newVote = await Vote.create({
          track_id: song.id,
          rating,
          voter_email: user.email
        });
        setUserVote(newVote);
      }

      setCurrentRating(rating);

      // Recalculate track stats
      const allVotes = await Vote.filter({ track_id: song.id });
      const total_votes = allVotes.length;
      const sumOfRatings = allVotes.reduce((sum, vote) => sum + vote.rating, 0);
      const average_rating = total_votes > 0 ? sumOfRatings / total_votes : 0;

      // Update track
      await Track.update(song.id, { total_votes, average_rating });

      // Notify parent component of the update
      if (onRatingUpdate) {
        onRatingUpdate({ ...song, total_votes, average_rating });
      }

      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 500);

    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
    setIsSubmitting(false);
  };

  if (!song || !user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Rate this song</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-gray-900 truncate">{song.title}</h3>
            <p className="text-sm text-gray-600 truncate">{song.artist_name}</p>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              const isSelected = starValue <= currentRating;
              const isHovered = starValue <= hoverRating;

              let fillColor = 'none';
              let strokeColor = 'currentColor';

              if (isSelected) {
                fillColor = '#6A12CC'; // Purple for selected
                strokeColor = '#6A12CC';
              } else if (isHovered) {
                fillColor = '#facc15'; // Yellow for hover
                strokeColor = '#facc15';
              }

              return (
                <motion.div
                  key={starValue}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Star
                    className={`w-8 h-8 text-gray-400 cursor-pointer ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                    fill={fillColor}
                    stroke={strokeColor}
                    onMouseEnter={() => !isSubmitting && setHoverRating(starValue)}
                    onMouseLeave={() => !isSubmitting && setHoverRating(0)}
                    onClick={() => !isSubmitting && handleRate(starValue)}
                  />
                </motion.div>
              );
            })}
          </div>

          {currentRating > 0 && (
            <p className="text-center text-sm text-gray-500 mt-2">
              You rated this song {currentRating} star{currentRating !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}