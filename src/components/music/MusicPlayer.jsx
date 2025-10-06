
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Rewind, FastForward, Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer({ track }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 material-shadow">
      <audio ref={audioRef} src={track.audio_url} onEnded={() => setIsPlaying(false)} />

      {/* Track Info */}
      <div className="text-center">
        <h3 className="text-gray-800 font-bold truncate">{track.title}</h3>
        <p className="text-gray-500 text-sm">{track.artist_name}</p>
      </div>

      {/* Scrubber */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 w-10 text-center">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm accent-primary"
        />
        <span className="text-xs text-gray-500 w-10 text-center">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button size="icon" variant="ghost" className="text-gray-600 hover:text-primary hover:bg-purple-50">
          <Rewind className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          onClick={togglePlayPause}
          className="w-14 h-14 bg-primary rounded-full text-primary-foreground shadow-lg hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
        </Button>
        <Button size="icon" variant="ghost" className="text-gray-600 hover:text-primary hover:bg-purple-50">
          <FastForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 pt-2">
        <Button size="icon" variant="ghost" className="text-gray-500 hover:text-primary">
          {volume > 0 ? <Volume2 className="w-5 h-5"/> : <VolumeX className="w-5 h-5"/>}
        </Button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm accent-primary"
        />
      </div>
    </div>
  );
}
