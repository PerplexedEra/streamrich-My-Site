'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Icons } from '../icons';

interface AudioPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
}

export function AudioPlayer({ 
  src, 
  className = '', 
  autoPlay = false,
  showControls = true
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(pos * 100);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {showControls && (
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="rounded-full w-10 h-10 p-0"
          >
            {isPlaying ? (
              <Icons.pause className="h-5 w-5" />
            ) : (
              <Icons.play className="h-5 w-5" />
            )}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
          
          <div className="flex-1">
            <div 
              className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
