import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Player from 'video.js/dist/types/player';

interface VideoPlayerProps {
  options: {
    autoplay?: boolean;
    controls?: boolean;
    responsive?: boolean;
    fluid?: boolean;
    sources: {
      src: string;
      type: string;
    }[];
    poster?: string;
  };
  onReady?: (player: Player) => void;
  className?: string;
}

export const VideoPlayer = ({ options, onReady, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Early return if no ref
    if (!videoRef.current) return;

    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // Create the video element dynamically to avoid React reconciliation issues
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      
      // Append it to the container
      videoRef.current.appendChild(videoElement);

      // Initialize the player
      const player = playerRef.current = videojs(videoElement, {
        ...options,
        // Default options for better UX
        fluid: true,
        controls: true,
        responsive: true,
      }, () => {
        videojs.log('Player is ready');
        onReady && onReady(player);
      });

    } else {
      // Update existing player
      const player = playerRef.current;
      player.autoplay(options.autoplay || false);
      player.src(options.sources);
      if (options.poster) {
        player.poster(options.poster);
      }
    }
  }, [options, onReady]); // Re-run if options change significantly, though usually we want stable refs

  // Dispose the player on unmount
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className={className}>
      <div ref={videoRef} className="w-full rounded-2xl overflow-hidden shadow-lg border border-border" />
    </div>
  );
};

export default VideoPlayer;
