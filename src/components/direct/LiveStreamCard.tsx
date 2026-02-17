"use client";

import React from "react";
import Image from "next/image";
import { MarqueeItem } from "@/components/home/CategoryMarquee";

interface LiveStreamCardProps {
  item: MarqueeItem & { viewers?: number; time?: string };
  isActive?: boolean;
}

export const LiveStreamCard = ({ item, isActive = false }: LiveStreamCardProps) => {
  return (
    <div className="group flex gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      {/* Thumbnail */}
      <div className="relative w-40 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-200">
        {item.image ? (
          <Image 
            src={item.image} 
            alt={item.title} 
            width={160} 
            height={96} 
            className="w-full h-full object-cover" 
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-200 to-slate-300" />
        )}
        
        {/* Status Badge */}
        {isActive ? (
          <div className="absolute bottom-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
             EN DIRECT
          </div>
        ) : (
          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
             {item.time || "12:00"}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-start py-1">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
          {item.subtitle || "Jetemoigne TV"}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
           {isActive ? `${item.viewers || 120} spectateurs` : "Programmé"}
        </p>
      </div>
    </div>
  );
};
