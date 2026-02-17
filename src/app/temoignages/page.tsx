"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { TestimonyCard, Testimony } from "@/components/testimonies/TestimonyCard";
import { TestimonyForm } from "@/components/testimonies/TestimonyForm";
import { CategoryFilters } from "@/components/ui/CategoryFilters";
import { Modal } from "@/components/ui/modal";

const TESTIMONIES: Testimony[] = [
  {
    id: "1",
    type: "video",
    title: "Guéri miraculeusement après 10 ans de maladie",
    content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Mock URL
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: "12:45",
    author: { name: "Sarah Connor", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    date: "Il y a 2 jours",
    category: "Guérison",
  },
  {
    id: "2",
    type: "audio",
    title: "Comment j'ai retrouvé la paix intérieure",
    content: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Mock Audio
    author: { name: "Marc Dupont", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
    date: "Il y a 1 semaine",
    category: "Délivrance",
  },
  {
    id: "3",
    type: "text",
    title: "Une rencontre inattendue",
    content: "C'était un soir d'hiver, je marchais seul dans la rue quand soudain une lumière m'a ébloui. J'ai senti une chaleur envahir mon cœur et j'ai su que je n'étais plus seul. Depuis ce jour, ma vie a complètement changé. J'ai trouvé une communauté aimante et un but à mon existence.",
    author: { name: "Julie Martin" },
    date: "Il y a 3 semaines",
    category: "Foi",
  },
  {
    id: "4",
    type: "video",
    title: "Témoignage de restauration familiale",
    content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: "08:30",
    author: { name: "Paul & Marie", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026703d" },
    date: "Il y a 1 mois",
    category: "Famille",
  },
  {
    id: "5",
    type: "text",
    title: "Sorti de la dépression",
    content: "Pendant des années, j'ai lutté contre des pensées sombres. Rien ne semblait pouvoir m'aider, ni les médicaments ni les thérapies. Un jour, un ami m'a invité à une réunion de prière. J'y suis allé à reculons, mais ce que j'y ai vécu dépasse l'entendement...",
    author: { name: "Thomas L." },
    date: "Il y a 2 mois",
    category: "Guérison",
  },
];

const FILTERS = [
  { value: "all", label: "Tous" },
  { value: "Guérison", label: "Guérison" },
  { value: "Délivrance", label: "Délivrance" },
  { value: "Foi", label: "Foi" },
  { value: "Famille", label: "Famille" },
];

export default function TemoignagesPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTestimonies = TESTIMONIES.filter((t) => {
    const matchesFilter = activeFilter === "all" || t.category === activeFilter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 max-w-7xl mx-auto flex flex-col gap-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Témoignages</h1>
          <p className="text-slate-600 max-w-2xl">
            Découvrez comment Dieu agit dans la vie de personnes ordinaires. Des histoires de transformation, de guérison et d&apos;espoir.
          </p>
        </div>
        
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Je Témoigne
        </button>
      </div>

      {/* Search & Filters */}
      <div className="sticky top-20 z-10 bg-white/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-slate-100 space-y-4">
         <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
               <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
               <input 
                 type="text" 
                 placeholder="Rechercher un témoignage..." 
                 className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden bg-slate-50"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            
            <CategoryFilters 
              categories={FILTERS} 
              defaultValue="all" 
              className="w-max"
              onChange={(val) => setActiveFilter(val)}
            />
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonies.map((testimony) => (
          <div key={testimony.id} className="h-full">
            <TestimonyCard testimony={testimony} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTestimonies.length === 0 && (
         <div className="text-center py-20">
            <p className="text-slate-500 text-lg">Aucun témoignage ne correspond à votre recherche.</p>
         </div>
      )}

      {/* Form Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title="Partager mon témoignage"
        className="max-w-3xl"
      >
         <TestimonyForm />
      </Modal>
    </div>
  );
}
