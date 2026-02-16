import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingBag } from "lucide-react";

const books = [
  {
    id: 1,
    title: "La Puissance du Témoignage",
    author: "MOUSSAVOU",
    price: "15000 FCFA",
    color: "bg-blue-100",
  },
  {
    id: 2,
    title: "Vaincre par la Foi",
    author: "Sarah ",
    price: "12000 FCFA",
    color: "bg-purple-100",
  },
  {
    id: 3,
    title: "L'Amour qui Sauve",
    author: "Pierre Durand",
    price: "18000 FCFA",
    color: "bg-rose-100",
  },
  {
    id: 4,
    title: "Prière et Miracles",
    author: "Wahid",
    price: "20000 FCFA",
    color: "bg-amber-100",
  },
  {
    id: 5,
    title: "Chemins de Lumière",
    author: "Luce",
    price: "14000 FCFA",
    color: "bg-emerald-100",
  },
];

export function BooksCarousel() {
  return (
    <div className="w-full py-10">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-2xl font-bold text-text-deep">Ouvrages Inspirants</h2>
          <p className="text-text-deep/60 text-sm">
            Découvrez notre sélection de livres pour grandir dans la foi.
          </p>
        </div>
        <Button variant="ghost" className="text-primary hover:text-primary/80">
          Voir tout <span className="ml-2">&rarr;</span>
        </Button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-7xl mx-auto px-10 md:px-12"
      >
        <CarouselContent className="-ml-4">
          {books.map((book) => (
            <CarouselItem key={book.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
              <div className="group relative bg-white rounded-2xl border border-border p-4 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                {/* Book Cover Placeholder */}
                <div
                  className={`aspect-2/3 w-full rounded-xl mb-4 ${book.color} flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform`}
                >
                  <BookOpen className="w-12 h-12 text-black/10" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                  
                  {/* Quick Action Overlay */}
                  <div className="absolute bottom-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Button size="icon" className="rounded-full shadow-lg h-10 w-10 bg-white text-primary hover:bg-primary hover:text-white">
                        <ShoppingBag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col grow">
                  <h3 className="font-bold text-lg text-text-deep line-clamp-1 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-text-deep/60 mb-3">{book.author}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-primary text-lg">
                      {book.price}
                    </span>
                    <Button variant="outline" size="sm" className="rounded-full text-xs h-8">
                      Détails
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 md:-left-4" />
        <CarouselNext className="right-0 md:-right-4" />
      </Carousel>
    </div>
  );
}
