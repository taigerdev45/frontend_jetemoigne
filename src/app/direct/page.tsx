"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Share2, MoreVertical, Loader2 } from "lucide-react";
import { LiveStreamCard } from "@/components/direct/LiveStreamCard";
import { Program } from "@/types";
import { api } from "@/lib/api";

export default function DirectPage() {
  const [liveProgram, setLiveProgram] = useState<Program | null>(null);
  const [otherPrograms, setOtherPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveData, programsData] = await Promise.all([
          api.programs.getLive().catch(() => null), // Handle 404 or empty if no live
          api.programs.findAll({ limit: 10 })
        ]);

        if (liveData && liveData.id) {
            setLiveProgram(liveData);
        }

        // Access .items from PaginatedResponse
        setOtherPrograms(programsData.items || []);
      } catch (error) {
        console.error("Failed to fetch live data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-0 bg-white dark:bg-black">
      
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        
        {/* Main Player Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-4">
           {/* Video Player Container */}
           <div className="rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video relative w-full">
             {isLoading ? (
                <div className="flex items-center justify-center h-full text-white">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
             ) : liveProgram ? (
                 <VideoPlayer 
                    options={{
                      autoplay: true,
                      controls: true,
                      responsive: true,
                      fluid: true,
                      sources: [{
                        src: liveProgram.videoUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // Fallback for demo
                        type: 'application/x-mpegURL'
                      }],
                      poster: liveProgram.thumbnailUrl || '/images/live-poster.jpg'
                    }}
                 />
             ) : (
                <div className="flex items-center justify-center h-full bg-slate-900 text-white flex-col gap-4">
                    <p className="text-xl font-bold">Aucun direct en cours</p>
                    <p className="text-slate-400">Retrouvez nos replays ci-dessous</p>
                </div>
             )}
           </div>

           {/* Video Info Section */}
           {liveProgram && (
               <div className="flex flex-col gap-4">
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                     {liveProgram.title}
                  </h1>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
                           <Image 
                             src="https://i.pravatar.cc/150?u=church" 
                             alt="Channel Avatar" 
                             fill
                             className="object-cover"
                             unoptimized
                           />
                        </div>
                        <div>
                           <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Jetemoigne TV</h3>
                           <p className="text-xs text-slate-500 dark:text-slate-400">12k abonnés</p>
                        </div>
                        <Button className="ml-4 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black font-semibold h-9 px-5">
                           S&apos;abonner
                        </Button>
                     </div>

                     <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                        <Button variant="secondary" className="rounded-full gap-2 h-9 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white">
                           <span className="font-bold">{liveProgram.viewsCount || "0"}</span> Vues
                        </Button>
                        <Button variant="secondary" className="rounded-full gap-2 h-9 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white">
                           <Share2 className="w-4 h-4" /> Partager
                        </Button>
                        <Button variant="secondary" className="rounded-full h-9 w-9 p-0 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white flex items-center justify-center">
                           <MoreVertical className="w-4 h-4" />
                        </Button>
                     </div>
                  </div>

                  {/* Description Box */}
                  <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300">
                     <div className="flex gap-2 font-bold mb-2">
                        <span>{new Date().toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-red-600">EN DIRECT</span>
                     </div>
                     <p>
                        {liveProgram.description}
                     </p>
                     <Button variant="link" className="p-0 h-auto text-slate-500 mt-2 font-semibold">Plus</Button>
                  </div>
                  
                  {/* Comments Section Placeholder */}
                  <div className="hidden md:block mt-4">
                     <h3 className="font-bold text-lg mb-4">Commentaires</h3>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 overflow-hidden relative">
                           <Image 
                             src="https://i.pravatar.cc/150?u=user" 
                             alt="User" 
                             width={40} 
                             height={40} 
                             className="object-cover"
                             unoptimized
                           />
                        </div>
                        <input 
                           type="text" 
                           placeholder="Ajouter un commentaire..." 
                           className="w-full border-b border-slate-200 dark:border-slate-800 bg-transparent py-2 focus:outline-hidden focus:border-blue-500 transition-colors"
                        />
                     </div>
                  </div>
               </div>
           )}
        </div>

        {/* Sidebar / Up Next Column (Scrollable) */}
        <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-4 h-fit">
           
           {/* Donation CTA (Sticky on top of sidebar if needed, or just part of flow) */}
           <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-md flex items-center justify-between gap-4">
              <div>
                 <h3 className="font-bold text-sm">Soutenez le live</h3>
                 <p className="text-blue-100 text-xs">Votre don fait la différence.</p>
              </div>
              <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-50 font-bold border-0 shadow-none whitespace-nowrap">
                 Faire un don
              </Button>
           </div>

           {/* Filter Chips (Horizontal Scroll) */}
           <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer">Tout</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors">Pour vous</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors">En direct</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors">Récents</span>
           </div>

           {/* Video List */}
           <div className="flex flex-col gap-2">
              {otherPrograms.map((program) => (
                 <LiveStreamCard 
                    key={program.id} 
                    item={{
                        id: program.id,
                        title: program.title,
                        subtitle: program.category,
                        image: program.thumbnailUrl || "",
                        time: program.publishedAt ? new Date(program.publishedAt).toLocaleDateString() : ""
                    }} 
                    isActive={false}
                 />
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
