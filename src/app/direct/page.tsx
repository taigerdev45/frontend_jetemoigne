"use client";

import React from "react";
import Image from "next/image";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Share2, MoreVertical } from "lucide-react";
import { LiveStreamCard } from "@/components/direct/LiveStreamCard";
import { MarqueeItem } from "@/components/home/CategoryMarquee";

// Mock data for other live streams / recommendations
const OTHER_LIVES: (MarqueeItem & { viewers?: number; time?: string })[] = [
  { id: "l1", title: "Concert de Louange - Groupe Espoir", subtitle: "Louange", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop", viewers: 342 },
  { id: "l2", title: "Intercession Matinale", subtitle: "Prière", image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop", viewers: 156 },
  { id: "l3", title: "Talk Show : La Foi au Quotidien", subtitle: "Débat", image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop", time: "14:00" },
  { id: "l4", title: "Conférence : Guérison Divine", subtitle: "Enseignement", image: "https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2070&auto=format&fit=crop", time: "16:00" },
  { id: "l5", title: "Les Héros de la Foi : David", subtitle: "Documentaire", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop", time: "18:00" },
  { id: "l6", title: "Chants de Victoire Vol. 2", subtitle: "Musique", image: "https://images.unsplash.com/photo-1459749411177-0473ef716175?q=80&w=2070&auto=format&fit=crop", time: "20:00" },
  { id: "l7", title: "Étude Biblique Interactive", subtitle: "Étude", image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1974&auto=format&fit=crop", time: "Demain" },
];

export default function DirectPage() {
  return (
    <div className="min-h-screen pt-20 pb-0 bg-white dark:bg-black">
      
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        
        {/* Main Player Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-4">
           {/* Video Player Container */}
           <div className="rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video relative w-full">
             <VideoPlayer 
                options={{
                  autoplay: true,
                  controls: true,
                  responsive: true,
                  fluid: true,
                  sources: [{
                    src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                    type: 'application/x-mpegURL'
                  }],
                  poster: '/images/live-poster.jpg' // Placeholder if available
                }}
             />
           </div>

           {/* Video Info Section */}
           <div className="flex flex-col gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                 Culte de Dimanche : La Puissance de la Résurrection
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
                       <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Église Principale de Paris</h3>
                       <p className="text-xs text-slate-500 dark:text-slate-400">12k abonnés</p>
                    </div>
                    <Button className="ml-4 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black font-semibold h-9 px-5">
                       S&apos;abonner
                    </Button>
                 </div>

                 <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    <Button variant="secondary" className="rounded-full gap-2 h-9 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white">
                       <span className="font-bold">1.2k</span> J&apos;aime
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
                    <span>24 oct. 2023</span>
                    <span>•</span>
                    <span className="text-red-600">EN DIRECT</span>
                 </div>
                 <p>
                    Rejoignez-nous pour ce moment exceptionnel de louange et d&apos;adoration. 
                    Le pasteur Jean Dupont nous partagera un message inspirant sur la foi.
                    N&apos;oubliez pas de liker et partager !
                 </p>
                 <Button variant="link" className="p-0 h-auto text-slate-500 mt-2 font-semibold">Plus</Button>
              </div>
              
              {/* Comments Section Placeholder */}
              <div className="hidden md:block mt-4">
                 <h3 className="font-bold text-lg mb-4">128 Commentaires</h3>
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
              {OTHER_LIVES.map((item) => (
                 <LiveStreamCard 
                    key={item.id} 
                    item={item} 
                    isActive={item.viewers !== undefined}
                 />
              ))}
              {/* Duplicate for demo scroll length */}
               {OTHER_LIVES.map((item) => (
                 <LiveStreamCard 
                    key={`${item.id}-copy`} 
                    item={item} 
                    isActive={false}
                 />
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
