"use client";

import React, { useState, useEffect } from "react";
import { CategoryFilters } from "@/components/ui/CategoryFilters";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { Modal } from "@/components/ui/modal";
import { Program } from "@/types";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

const PROGRAM_FILTERS = [
  { value: "all", label: "Tous" },
  { value: "evangelisation", label: "Evangélisation" },
  { value: "jeunesse_cinema", label: "Jeunesse & Cinéma" },
  { value: "divertissement", label: "Divertissement" },
  { value: "podcast", label: "Podcast" },
  { value: "concert", label: "Concert / Louange" },
  { value: "temoignage_live", label: "Témoignage Live" },
  { value: "info", label: "Info" },
];

export default function ProgrammesPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await api.programs.findAll();
        // Access .items from PaginatedResponse
        setPrograms(data.items || []);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter(p => {
     const matchesFilter = activeFilter === "all" || p.category === activeFilter;
     const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
     return matchesFilter && matchesSearch;
  });

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
        
        {/* Search Bar */}
        <div className="w-full md:w-auto relative">
           <input 
             type="text" 
             placeholder="Rechercher..." 
             className="w-full md:w-64 px-4 py-2 pl-10 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
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
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPrograms.map((program) => (
            <ProgramCard 
              key={program.id} 
              program={program} 
              onClick={() => setSelectedProgram(program)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPrograms.length === 0 && (
         <div className="text-center py-20">
            <p className="text-slate-500 text-lg">Aucun programme ne correspond à votre recherche.</p>
         </div>
      )}

      {/* Modal Details */}
      <Modal 
        isOpen={!!selectedProgram} 
        onClose={() => setSelectedProgram(null)}
        title={selectedProgram?.title}
        className="w-full max-w-4xl"
      >
        {selectedProgram && (
           <div className="flex flex-col gap-6">
              {(selectedProgram.videoUrl || selectedProgram.audioUrl) && (
                <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-lg">
                   {selectedProgram.videoUrl ? (
                     <iframe
                       width="100%"
                       height="100%"
                       src={selectedProgram.videoUrl.replace("watch?v=", "embed/")}
                       title={selectedProgram.title}
                       frameBorder="0"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                     />
                   ) : selectedProgram.audioUrl ? (
                     <div className="flex items-center justify-center h-full bg-slate-900">
                       <audio controls src={selectedProgram.audioUrl} className="w-3/4" />
                     </div>
                   ) : null}
                </div>
              )}
              
              <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between flex-wrap gap-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                       {selectedProgram.category?.replace('_', ' ')}
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
                       {selectedProgram.description || "Aucune description disponible."}
                    </p>
                 </div>
                 
                 <div className="border-t border-slate-100 pt-4 mt-2">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden relative flex items-center justify-center">
                          {/* Placeholder for author avatar since Program doesn't have author field yet */}
                          <span className="text-xl font-bold text-slate-500">J</span>
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">Jetemoigne TV</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Chaine Officielle</p>
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
