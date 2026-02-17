"use client";

import Image from "next/image";
import { Download, ShoppingCart, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  price?: number; // if 0 or undefined, it's free
  coverUrl?: string;
  pdfUrl?: string;
  isFree: boolean;
}

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
      {/* Cover */}
      <div className="relative aspect-2/3 bg-slate-100 overflow-hidden">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized // Mock images often need this
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 text-blue-200 p-4 text-center">
            <BookOpen className="w-12 h-12 mb-2" />
            <span className="text-xs font-bold text-blue-300 uppercase">{book.title}</span>
          </div>
        )}
        
        {/* Badge Price/Free */}
        <div className="absolute top-3 right-3 z-10">
          {book.isFree ? (
            <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none text-white shadow-sm">Gratuit</Badge>
          ) : (
            <Badge variant="secondary" className="font-bold bg-white/90 backdrop-blur-sm text-slate-900 shadow-sm">
              {book.price} FCFA
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 mb-1" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">{book.author}</p>
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            {book.isFree ? (
                 <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl" size="sm">
                    <Download className="w-4 h-4" />
                    Télécharger
                 </Button>
            ) : (
                <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl" size="sm">
                    <ShoppingCart className="w-4 h-4" />
                    Acheter
                </Button>
            )}
        </div>
      </div>
    </div>
  );
};
