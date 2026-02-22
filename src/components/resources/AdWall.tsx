"use client";

import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ad } from "@/types";

interface AdWallProps {
  ads: Ad[];
}

export const AdWall = ({ ads }: AdWallProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[250px]">
      {ads.map((ad, index) => {
        // Feature logic: highlight every 3rd item as larger (span 2 cols) if enough space
        const isFeatured = index % 5 === 0;

        return (
          <div
            key={ad.id}
            className={cn(
              "group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-500",
              isFeatured ? "md:col-span-2 md:row-span-2" : ""
            )}
          >
            {/* Media Content */}
            <div className="absolute inset-0 w-full h-full">
                {ad.mediaType === "video" ? (
                    <div className="relative w-full h-full">
                        <video
                            src={ad.mediaUrl}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            muted
                            loop
                            playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                ) : (
                    ad.mediaUrl ? (
                        <Image
                            src={ad.mediaUrl}
                            alt={ad.clientName}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 animate-pulse" />
                    )
                )}
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Content Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">{ad.clientName}</p>
                        <h3 className={cn("text-white font-bold leading-tight drop-shadow-md", isFeatured ? "text-2xl" : "text-lg")}>
                            {ad.clientName}
                        </h3>
                    </div>

                    {ad.redirectUrl && (
                        <a
                            href={ad.redirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
                            title="Visiter le site"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    )}
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
