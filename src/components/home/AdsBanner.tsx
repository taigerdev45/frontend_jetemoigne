import React from "react";
import { Button } from "@/components/ui/button";

export function AdsBanner() {
  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-lg relative group">
      <div className="absolute inset-0 bg-linear-to-r from-sky-400 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100"></div>
      <div className="relative z-10 px-8 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
        <div className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Devenez partenaire de l&apos;Espérance
          </h3>
          <p className="text-white/90 max-w-xl">
            Soutenez nos actions d&apos;évangélisation et participez à la diffusion
            de témoignages qui changent des vies.
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded-full px-8 py-6 text-lg font-bold shadow-md hover:scale-105 transition-transform text-blue-600 bg-white hover:bg-white/90"
        >
          Nous Soutenir
        </Button>
      </div>
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
    </div>
  );
}
