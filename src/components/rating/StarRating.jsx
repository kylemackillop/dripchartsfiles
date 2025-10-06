import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StarRating({ currentRating = 0, onRate, disabled = false }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (rating) => {
    if (!disabled) {
      onRate(rating);
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${disabled ? 'cursor-not-allowed' : ''}`}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isSelected = starValue <= currentRating;
        const isHovered = starValue <= hoverRating;

        let fillColor = 'none';
        let strokeColor = 'currentColor';

        if (isSelected) {
          fillColor = '#6A12CC'; // Dark purple for selected
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
              className={`w-8 h-8 text-gray-400 ${!disabled ? 'cursor-pointer' : ''}`}
              fill={fillColor}
              stroke={strokeColor}
              onMouseEnter={() => !disabled && setHoverRating(starValue)}
              onMouseLeave={() => !disabled && setHoverRating(0)}
              onClick={() => handleRate(starValue)}
            />
          </motion.div>
        );
      })}
    </div>
  );
}