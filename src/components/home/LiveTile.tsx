import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Program } from "@/types";

interface LiveTileProps {
  className?: string;
  program?: Program | null;
}

export function LiveTile({ className, program }: LiveTileProps) {
  return (
    <div
      className={cn(
        "bg-text-deep rounded-3xl p-8 relative overflow-hidden group shadow-xl h-full flex flex-col justify-end",
        className
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent opacity-50"></div>
      <div className="relative z-10 w-full">
        <div className="flex items-center space-x-2 mb-4">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-white/80 text-sm font-bold uppercase tracking-wider">
            En Direct
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {program?.title || "Le Direct de la Foi : Evangelisation 2026"}
        </h2>
        <p className="text-white/60 mb-6 max-w-md">
          {program?.description || "Rejoignez-nous maintenant pour un moment intense de priere et de temoignages en direct."}
        </p>
        <Button className="w-fit bg-primary hover:bg-secondary text-white rounded-2xl px-8 py-6 text-lg shadow-lg shadow-primary/20 transition-all">
          Regarder Maintenant
        </Button>
      </div>
      {/* Placeholder pour image/video overlay */}
      <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-32 h-32 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
          />
        </svg>
      </div>
    </div>
  );
}
