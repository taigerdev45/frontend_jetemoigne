"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface UpdateItem {
  id: string;
  text: string;
  date?: string;
  link?: string;
}

interface LatestUpdatesMarqueeProps {
  updates?: UpdateItem[];
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

export const LatestUpdatesMarquee = ({
  updates = [
    { id: "1", text: "Nouveau programme disponible : La puissance de la foi", date: "Aujourd'hui" },
    { id: "2", text: "Direct ce soir à 20h : Session de prière en live", date: "Ce soir" },
    { id: "3", text: "Découvrez les nouveaux témoignages de guérison", date: "Hier" },
    { id: "4", text: "Lancement de la campagne de soutien 2026", date: "15 Fév" },
  ],
  speed = "normal",
  className,
}: LatestUpdatesMarqueeProps) => {
  const speedClass = {
    slow: "duration-[60s]",
    normal: "duration-[40s]",
    fast: "duration-[20s]",
  };

  return (
    <div className={cn("bg-blue-900 border-y border-blue-800 relative overflow-hidden", className)}>
      <div className="max-w-7xl mx-auto flex items-center h-10 md:h-12 relative">
        {/* Label Fixe */}
        <div className="absolute left-0 z-20 h-full flex items-center bg-blue-950 px-4 md:px-6 shadow-lg border-r border-blue-800">
          <span className="text-xs md:text-sm font-bold text-blue-200 uppercase tracking-wider whitespace-nowrap">
            Dernières Infos
          </span>
        </div>

        {/* Marquee Container */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center ml-[120px] md:ml-[160px] mask-gradient-right">
             {/* Gradient Mask Right only */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-blue-900 to-transparent z-10" />

            <div className={cn("flex gap-8 items-center w-max animate-marquee-left hover:paused", speedClass[speed])}>
              {[...updates, ...updates, ...updates].map((update, i) => (
                <div key={`${update.id}-${i}`} className="flex items-center gap-3 shrink-0 group cursor-pointer">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:bg-blue-200 transition-colors" />
                  <span className="text-sm text-blue-100 font-medium group-hover:text-white transition-colors">
                    {update.text}
                  </span>
                  {update.date && (
                    <span className="text-[10px] text-blue-300 bg-blue-800/50 px-2 py-0.5 rounded-full border border-blue-700/50">
                      {update.date}
                    </span>
                  )}
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};
