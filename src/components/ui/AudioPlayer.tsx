"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  className?: string;
}

export const AudioPlayer = ({ src, className }: AudioPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#93c5fd", // blue-300
      progressColor: "#2563eb", // blue-600
      cursorColor: "#1d4ed8", // blue-700
      barWidth: 2,
      barGap: 3,
      height: 60,
      normalize: true,
      url: src,
    });

    wavesurfer.current.on("ready", () => {
      setDuration(wavesurfer.current?.getDuration() || 0);
    });

    wavesurfer.current.on("audioprocess", () => {
      setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
    });

    wavesurfer.current.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [src]);

  const togglePlay = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex items-center gap-4", className)}>
      <button
        onClick={togglePlay}
        className="shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
      </button>

      <div className="flex-1 min-w-0">
        <div ref={containerRef} className="w-full" />
        <div className="flex justify-between text-xs text-slate-500 mt-1 font-medium">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};
