"use client";

import React from "react";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Clock, Share2, MessageCircle } from "lucide-react";

// Mock data for the schedule
const LIVE_SCHEDULE = [
  { id: "1", title: "Culte de Dimanche", time: "10:00 - 12:00", active: true, description: "Louange et adoration avec le groupe Espoir." },
  { id: "2", title: "Intercession", time: "14:00 - 15:30", active: false, description: "Moment de prière pour les malades." },
  { id: "3", title: "Étude Biblique", time: "18:00 - 19:30", active: false, description: "Livre de l'Apocalypse, chapitre 4." },
  { id: "4", title: "Rediffusion : Talk Show", time: "21:00 - 22:00", active: false, description: "La foi au quotidien." },
];

export default function DirectPage() {
  return (
    <div className="min-h-screen pt-24 pb-10 px-6 max-w-7xl mx-auto flex flex-col gap-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                EN DIRECT
             </span>
             <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" /> 10:42
             </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Culte de Dimanche</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">En direct depuis l'église principale de Paris.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="gap-2 rounded-full">
              <Share2 className="w-4 h-4" /> Partager
           </Button>
           <Button className="gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white">
              <MessageCircle className="w-4 h-4" /> Chat
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Player Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-black aspect-video relative group">
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
           
           {/* Description / Actions */}
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-xl mb-4">À propos de ce programme</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Rejoignez-nous pour notre culte dominical spécial. Au programme : louange prophétique, témoignages poignants et un message puissant sur la foi inébranlable.
                N'hésitez pas à partager vos sujets de prière dans le chat.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                 <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">Louange</div>
                 <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold">Enseignement</div>
                 <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold">Famille</div>
              </div>
           </div>
        </div>

        {/* Sidebar Schedule */}
        <div className="flex flex-col gap-6">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-fit sticky top-24">
             <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Programme du Jour
             </h3>
             <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-8 py-2">
               {LIVE_SCHEDULE.map((item, index) => (
                 <div key={item.id} className="relative pl-8 group">
                   {/* Timeline Dot */}
                   <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-all ${
                     item.active 
                       ? 'bg-red-500 border-red-200 shadow-[0_0_0_4px_rgba(239,68,68,0.2)]' 
                       : 'bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-600'
                   }`} />
                   
                   <div className={`transition-all ${item.active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                     <span className={`text-xs font-bold block mb-1 ${item.active ? 'text-red-500' : 'text-slate-400'}`}>
                       {item.time}
                     </span>
                     <h4 className={`font-bold text-base mb-1 ${item.active ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                       {item.title}
                     </h4>
                     <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                       {item.description}
                     </p>
                   </div>
                 </div>
               ))}
             </div>
             
             <Button variant="ghost" className="w-full mt-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                Voir le programme complet &rarr;
             </Button>
           </div>
           
           {/* Donation CTA */}
           <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg text-center">
              <h3 className="font-bold text-lg mb-2">Soutenez notre mission</h3>
              <p className="text-blue-100 text-sm mb-4">Votre générosité nous permet de continuer à diffuser l'évangile.</p>
              <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl shadow-none border-0">
                 Faire un don
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
