import React from 'react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { Play, Pause, X, Volume2, Volume1, VolumeX, SkipForward, SkipBack, AlertTriangle, RefreshCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const formatTime = (seconds) => {
  const floorSeconds = Math.floor(seconds);
  const minutes = Math.floor(floorSeconds / 60);
  const remainingSeconds = floorSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function MiniPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    volume, 
    setVolumeLevel, 
    currentTime, 
    duration, 
    seek,
    isPlayerVisible,
    closePlayer,
    isLoading,
    playerError,
    playTrack
  } = useMusicPlayer();

  if (!isPlayerVisible || !currentTrack) {
    return null;
  }

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const isReady = !isLoading && duration > 0 && !playerError;

  const handleRetry = () => {
    playTrack(currentTrack);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <style>
        {`
          /* Custom slider styling for dark purple theme */
          [data-radix-slider-root] {
            background: #e5e7eb !important;
          }
          
          [data-radix-slider-track] {
            background: #e5e7eb !important;
          }
          
          [data-radix-slider-range] {
            background: #6A12CC !important;
          }
          
          [data-radix-slider-thumb] {
            background: #6A12CC !important;
            border: 2px solid #6A12CC !important;
          }
          
          [data-radix-slider-thumb]:hover {
            background: #26054D !important;
            border-color: #26054D !important;
          }
          
          [data-radix-slider-thumb]:focus {
            box-shadow: 0 0 0 3px rgba(106, 18, 204, 0.3) !important;
          }
        `}
      </style>
      <div className="bg-white/80 backdrop-blur-md shadow-[0_-4px_30px_rgba(0,0,0,0.1)] p-4 border-t border-gray-200">
        <div className="container mx-auto flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img 
              src={currentTrack.cover_art_url || 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f98418746_dripcharts.png'}
              alt={currentTrack.title}
              className="w-14 h-14 rounded-md object-cover"
            />
            <div className="min-w-0">
              <Link to={createPageUrl(`TrackDetails?id=${currentTrack.id}`)} className="hover:underline">
                <h3 className="font-semibold text-gray-900 truncate">{currentTrack.title}</h3>
              </Link>
              <Link 
                to={createPageUrl(`ArtistPage?artist_name=${encodeURIComponent(currentTrack.artist_name)}`)} 
                className="text-sm text-gray-600 truncate hover:underline"
              >
                {currentTrack.artist_name}
              </Link>
            </div>
          </div>

          <div className="flex-1 max-w-xl hidden md:flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-4">
              <button disabled className="text-gray-400 cursor-not-allowed"><SkipBack /></button>
              
              {playerError ? (
                <Button 
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              ) : (
                <button 
                  onClick={togglePlayPause} 
                  disabled={!isReady}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#6A12CC] hover:bg-[#26054D] text-white disabled:bg-gray-300 disabled:cursor-wait transition-colors"
                >
                  {isPlaying ? <Pause /> : <Play />}
                </button>
              )}
              
              <button disabled className="text-gray-400 cursor-not-allowed"><SkipForward /></button>
            </div>

            {playerError ? (
              <div className="flex items-center gap-2 text-red-600 text-sm h-5 max-w-md">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Cannot play this track. Audio format may be incompatible.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full text-xs">
                <span>{formatTime(currentTime)}</span>
                <Slider
                  value={[currentTime]}
                  max={duration}
                  onValueChange={(value) => seek(value[0])}
                  disabled={!isReady}
                  className="w-full"
                />
                <span>{formatTime(duration)}</span>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 w-32">
            <VolumeIcon className="w-5 h-5 text-gray-600" />
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={(value) => setVolumeLevel(value[0])}
            />
          </div>

          <button onClick={closePlayer} className="text-gray-500 hover:text-gray-800">
            <X />
          </button>
        </div>
      </div>
    </div>
  );
}