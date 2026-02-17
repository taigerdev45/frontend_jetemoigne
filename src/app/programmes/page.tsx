"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CategoryFilters } from "@/components/ui/CategoryFilters";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { Modal } from "@/components/ui/modal";
import { MarqueeItem } from "@/components/home/CategoryMarquee";

const PROGRAMS: MarqueeItem[] = [
  { id: "p1", title: "Étude sur l'Apocalypse", subtitle: "Enseignement", image: "https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2070&auto=format&fit=crop" },
  { id: "p2", title: "Les Héros de la Foi : David", subtitle: "Documentaire", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" },
  { id: "p3", title: "Chants de Victoire Vol. 2", subtitle: "Louange", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop" },
  { id: "p4", title: "Débat : Science et Foi", subtitle: "Talk Show", image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop" },
  { id: "p5", title: "Dessins Animés Bibliques", subtitle: "Jeunesse", image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1ef4d?q=80&w=2070&auto=format&fit=crop" },
  { id: "p6", title: "La puissance de la Prière", subtitle: "Enseignement", image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop" },
];

const PROGRAM_FILTERS = [
  { value: "all", label: "Tous" },
  { value: "Enseignement", label: "Enseignements" },
  { value: "Documentaire", label: "Documentaires" },
  { value: "Louange", label: "Louange & Adoration" },
  { value: "Jeunesse", label: "Jeunesse" },
];

export default function ProgrammesPage() {
  const [selectedProgram, setSelectedProgram] = useState<MarqueeItem | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredPrograms = activeFilter === "all" 
    ? PROGRAMS 
    : PROGRAMS.filter(p => p.subtitle === activeFilter);

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 max-w-7xl mx-auto flex flex-col gap-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
        <div>
           <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Nos Programmes</h1>
           <p className="text-slate-600 max-w-2xl">
             Explorez notre bibliothèque de contenus inspirants. Des enseignements profonds aux moments de louange, trouvez ce qui nourrit votre foi.
           </p>
        </div>
        
        {/* Search Bar Placeholder */}
        <div className="w-full md:w-auto relative">
           <input 
             type="text" 
             placeholder="Rechercher..." 
             className="w-full md:w-64 px-4 py-2 pl-10 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
           />
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-20 z-10 bg-white/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-slate-100 flex justify-center md:justify-start overflow-x-auto scrollbar-hide">
         <CategoryFilters 
            categories={PROGRAM_FILTERS} 
            defaultValue="all" 
            className="w-max"
            onChange={(val) => setActiveFilter(val)}
         />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPrograms.map((program) => (
          <ProgramCard 
            key={program.id} 
            item={program} 
            onClick={() => setSelectedProgram(program)}
          />
        ))}
      </div>

      {/* Modal Details */}
      <Modal 
        isOpen={!!selectedProgram} 
        onClose={() => setSelectedProgram(null)}
        title={selectedProgram?.title}
        className="w-full max-w-4xl"
      >
        {selectedProgram && (
           <div className="flex flex-col gap-6">
              <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-lg">
                 <iframe 
                   width="100%" 
                   height="100%" 
                   src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
                   title="YouTube video player" 
                   frameBorder="0" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen
                 />
              </div>
              
              <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between flex-wrap gap-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                       {selectedProgram.subtitle}
                    </span>
                    <div className="flex gap-2">
                       <button className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm text-slate-700">
                          + Ma liste
                       </button>
                       <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-md hover:shadow-lg">
                          Partager
                       </button>
                    </div>
                 </div>
                 
                 <div className="prose prose-blue max-w-none text-slate-600">
                    <p>
                       Découvrez cet enseignement puissant qui a transformé la vie de milliers de personnes. 
                       Un message d&apos;espoir et de foi pour votre quotidien.
                    </p>
                 </div>
                 
                 <div className="border-t border-slate-100 pt-4 mt-2">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden relative">
                          <Image 
                            src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
                            alt="Speaker" 
                            fill
                            className="object-cover"
                            unoptimized
                          />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">Pasteur Jean Dupont</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Orateur Principal</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </Modal>
    </div>
  );
}
