"use client";

import { useState, useEffect } from "react";
import { BookCard } from "@/components/resources/BookCard";
import { AdWall } from "@/components/resources/AdWall";
import { Book, Ad } from "@/types";
import { BookOpen, MonitorPlay, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export default function OuvragesPage() {
  const [activeTab, setActiveTab] = useState<"books" | "ads">("books");
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, adsData] = await Promise.all([
          api.library.findAll(),
          api.ads.findActive()
        ]);
        // Access .items from PaginatedResponse
        setBooks(booksData.items || []);
        setAds(Array.isArray(adsData) ? adsData : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (book.author || "").toLowerCase().includes(searchQuery.toLowerCase())
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
           {isLoading ? (
             <div className="flex justify-center items-center h-64">
               <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
             </div>
           ) : (
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
                    {ads.length > 0 ? (
                      <AdWall ads={ads} />
                    ) : (
                      <div className="text-center py-20 text-slate-500">
                        <p>Aucune publicité pour le moment.</p>
                      </div>
                    )}
                 </motion.div>
               )}
             </AnimatePresence>
           )}
        </div>
      </div>
    </main>
  );
}
