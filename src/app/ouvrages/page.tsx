"use client";

import { useState } from "react";
import { BookCard, Book } from "@/components/resources/BookCard";
import { AdWall, Ad } from "@/components/resources/AdWall";
import { BookOpen, MonitorPlay, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const BOOKS: Book[] = [
  {
    id: "1",
    title: "La Puissance du Témoignage",
    author: "Apôtre Paul",
    price: 15000,
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    isFree: false,
  },
  {
    id: "2",
    title: "Vaincre par la Foi",
    author: "Sarah Connor",
    price: 12000,
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    isFree: false,
  },
  {
    id: "3",
    title: "Guide de Prière Quotidienne",
    author: "Jean Baptiste",
    isFree: true,
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    title: "L'Amour qui Sauve",
    author: "Pierre Durand",
    price: 18000,
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    isFree: false,
  },
  {
    id: "5",
    title: "Les Psaumes expliqués",
    author: "David Roi",
    isFree: true,
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "6",
    title: "Combat Spirituel",
    author: "Gédéon Le Vaillant",
    price: 25000,
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800",
    isFree: false,
  },
];

const ADS: Ad[] = [
  {
    id: "1",
    title: "Conférence Internationale 2026",
    partnerName: "Église de la Ville",
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
    link: "https://example.com",
  },
  {
    id: "2",
    title: "Soutenez les Orphelins",
    partnerName: "Fondation Espoir",
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
    link: "https://example.com",
  },
  {
    id: "3",
    title: "Retraite Spirituelle",
    partnerName: "Centre Béthanie",
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    link: "https://example.com",
  },
  {
    id: "4",
    title: "Album Louange 'Ciel Ouvert'",
    partnerName: "Worship Team",
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=800",
    link: "https://example.com",
  },
   {
    id: "5",
    title: "Campagne d'Évangélisation",
    partnerName: "Mission Globale",
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
    link: "https://example.com",
  },
];

export default function OuvragesPage() {
  const [activeTab, setActiveTab] = useState<"books" | "ads">("books");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = BOOKS.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Ressources & Partenaires
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Une bibliothèque riche pour nourrir votre foi et un espace dédié à nos précieux partenaires.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-full">
            <button
              onClick={() => setActiveTab("books")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300",
                activeTab === "books"
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-md scale-105"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <BookOpen className="w-5 h-5" />
              Bibliothèque
            </button>
            <button
              onClick={() => setActiveTab("ads")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300",
                activeTab === "ads"
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-md scale-105"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <MonitorPlay className="w-5 h-5" />
              Mur Publicitaire
            </button>
          </div>

          {/* Search Bar (Only for Books) */}
          <AnimatePresence>
            {activeTab === "books" && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative w-full max-w-md"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher un livre, un auteur..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
           <AnimatePresence mode="wait">
             {activeTab === "books" ? (
               <motion.div
                 key="books"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 transition={{ duration: 0.3 }}
               >
                 {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBooks.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-20 text-slate-500">
                        <p>Aucun ouvrage trouvé pour &quot;{searchQuery}&quot;</p>
                    </div>
                 )}
               </motion.div>
             ) : (
               <motion.div
                 key="ads"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.3 }}
               >
                 <AdWall ads={ADS} />
               </motion.div>
             )}
           </AnimatePresence>
        </div>

      </div>
    </main>
  );
}
