"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Mic, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type TestimonyType = "video" | "audio" | "text";

export interface Testimony {
  id: string;
  type: TestimonyType;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  title: string;
  content: string; // URL for video/audio, text content for text
  thumbnail?: string; // For video
  duration?: string; // For video/audio
  date: string;
  category: string;
}

interface TestimonyCardProps {
  testimony: Testimony;
  onClick?: () => void;
}

export const TestimonyCard = ({ testimony, onClick }: TestimonyCardProps) => {
  const Icon = {
    video: Play,
    audio: Mic,
    text: FileText,
  }[testimony.type];

  const colorClass = {
    video: "text-red-500 bg-red-50 border-red-100",
    audio: "text-blue-500 bg-blue-50 border-blue-100",
    text: "text-emerald-500 bg-emerald-50 border-emerald-100",
  }[testimony.type];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Header / Thumbnail */}
      <div className="relative">
        {testimony.type === "video" && testimony.thumbnail ? (
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={testimony.thumbnail}
              alt={testimony.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-slate-900 ml-1" fill="currentColor" />
              </div>
            </div>
            <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md">
              {testimony.duration}
            </span>
          </div>
        ) : (
          <div className={cn("h-24 p-6 flex items-center gap-4 border-b border-slate-50", colorClass)}>
            <div className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                {testimony.type === "text" ? "Témoignage Écrit" : "Témoignage Audio"}
              </span>
              <h3 className="font-bold text-lg leading-tight line-clamp-1">{testimony.title}</h3>
            </div>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        {testimony.type === "video" && (
           <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-2">{testimony.title}</h3>
        )}

        {testimony.type === "text" && (
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-4 flex-1">
            &quot;{testimony.content}&quot;
          </p>
        )}

        {testimony.type === "audio" && (
          <div className="flex-1 flex items-center justify-center">
             <div className="w-full">
                <p className="text-slate-500 text-sm mb-3 line-clamp-2">{testimony.title}</p>
                {/* Simplified visualizer for card */}
                <div className="flex items-center gap-1 h-8 justify-center opacity-50">
                   {[...Array(20)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1 bg-blue-500 rounded-full animate-pulse" 
                        style={{ 
                           height: `${(Math.sin(i) * 50 + 50)}%`, // Deterministic value instead of random
                           animationDelay: `${i * 0.1}s` 
                        }} 
                      />
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* Footer: Author & Meta */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {testimony.author.avatar ? (
              <div className="w-8 h-8 relative">
                <Image
                  src={testimony.author.avatar}
                  alt={testimony.author.name}
                  fill
                  className="rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <User className="w-4 h-4" />
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{testimony.author.name}</p>
              <p className="text-[10px] text-slate-500">{testimony.date}</p>
            </div>
          </div>
          
          <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-400">
             {testimony.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
