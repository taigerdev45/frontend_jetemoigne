import React from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section - Bento Grid */}
      <section className="px-6 pt-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          {/* Tuile XL - Direct (Main) */}
          <div className="md:col-span-2 md:row-span-2 bg-text-deep rounded-3xl p-8 relative overflow-hidden group shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent opacity-50"></div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <div className="flex items-center space-x-2 mb-4">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-white/80 text-sm font-bold uppercase tracking-wider">En Direct</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Le Direct de la Foi : Évangélisation 2026
              </h2>
              <p className="text-white/60 mb-6 max-w-md">
                Rejoignez-nous maintenant pour un moment intense de prière et de témoignages en direct.
              </p>
              <Button className="w-fit bg-primary hover:bg-secondary text-white rounded-2xl px-8 py-6 text-lg shadow-lg shadow-primary/20 transition-all">
                Regarder Maintenant
              </Button>
            </div>
            {/* Placeholder pour image/video overlay */}
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-32 h-32 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
               </svg>
            </div>
          </div>

          {/* Tuile L - Programme Vedette */}
          <div className="md:col-span-2 bg-secondary rounded-3xl p-6 relative overflow-hidden shadow-lg">
            <div className="relative z-10 flex flex-col justify-between h-full">
               <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                  Nouveauté
               </span>
               <div>
                  <h3 className="text-xl font-bold text-white mb-2">Jeunesse & Cinéma</h3>
                  <p className="text-white/70 text-sm mb-4">Découvrez nos derniers courts-métrages inspirants.</p>
                  <Button variant="link" className="text-white p-0 hover:text-white/80">
                    Découvrir &rarr;
                  </Button>
               </div>
            </div>
          </div>

          {/* Tuile M - Projet du Moment */}
          <div className="bg-white rounded-3xl p-6 shadow-blue-100 border border-border flex flex-col justify-between">
            <div>
               <h3 className="font-bold text-text-deep mb-2">Construction Studio</h3>
               <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div className="bg-primary h-2 rounded-full w-[65%]"></div>
               </div>
               <span className="text-xs text-text-deep/60 font-medium">65% de l&apos;objectif atteint</span>
            </div>
            <Button variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/5 text-xs">
               Contribuer
            </Button>
          </div>

          {/* Tuile S - Témoignage */}
          <div className="bg-primary/10 rounded-3xl p-6 border border-primary/20 flex flex-col justify-between group cursor-pointer hover:bg-primary/20 transition-all">
            <div className="text-primary">
               <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 opacity-50 mb-2">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.437.917-4.012 3.638-4.012 5.849h3.999v10h-9.987z" />
               </svg>
               <p className="text-text-deep font-medium text-sm line-clamp-3">
                  &quot;Ma vie a été totalement transformée après avoir visionné l&apos;enseignement sur la délivrance...&quot;
               </p>
            </div>
            <span className="text-xs font-bold text-primary">Lire la suite &rarr;</span>
          </div>
        </div>
      </section>

      {/* Section Publicité & Partenariats */}
      <section className="bg-muted py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-text-deep mb-2">Nos Partenaires</h3>
            <p className="text-text-deep/60">Ils soutiennent la mission Jetemoigne-TV.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Placeholders logos */}
             <div className="w-32 h-12 bg-text-deep/20 rounded-lg"></div>
             <div className="w-32 h-12 bg-text-deep/20 rounded-lg"></div>
             <div className="w-32 h-12 bg-text-deep/20 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Section Soutenir - Statistiques */}
      <section className="px-6 max-w-7xl mx-auto w-full py-10">
        <div className="bg-white rounded-[2rem] p-10 shadow-blue-100 border border-border grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center">
            <span className="text-4xl font-bold text-primary mb-2 block">1,200+</span>
            <span className="text-text-deep/60 font-medium">Bénévoles engagés</span>
          </div>
          <div className="text-center border-y md:border-y-0 md:border-x border-border py-10 md:py-0">
            <span className="text-4xl font-bold text-secondary mb-2 block">500+</span>
            <span className="text-text-deep/60 font-medium">Témoignages validés</span>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold text-text-deep mb-2 block">15</span>
            <span className="text-text-deep/60 font-medium">Projets réalisés</span>
          </div>
        </div>
      </section>
    </div>
  );
}
