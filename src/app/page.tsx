import React from "react";
import { Button } from "@/components/ui/button";
import { LiveTile } from "@/components/home/LiveTile";
import { ProjectsTile } from "@/components/home/ProjectsTile";
import { AdsBanner } from "@/components/home/AdsBanner";
import { BooksCarousel } from "@/components/home/BooksCarousel";
import { CategoryMarquee, MarqueeItem } from "@/components/home/CategoryMarquee";
import { LatestUpdatesMarquee } from "@/components/home/LatestUpdatesMarquee";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { CategoryFilters } from "@/components/ui/CategoryFilters";

// --- DONNÉES MOCKÉES ---
const LIVE_ITEMS: MarqueeItem[] = [
  { id: "l1", title: "Culte en Direct - Église de Paris", subtitle: "Maintenant" },
  { id: "l2", title: "Concert de Louange - Groupe Espoir", subtitle: "En Direct" },
  { id: "l3", title: "Intercession Matinale", subtitle: "En Direct" },
  { id: "l4", title: "Talk Show : La Foi au Quotidien", subtitle: "Rediffusion" },
  { id: "l5", title: "Conférence : Guérison Divine", subtitle: "Bientôt" },
];

const PROGRAM_ITEMS: MarqueeItem[] = [
  { id: "p1", title: "Étude sur l'Apocalypse", subtitle: "Enseignement" },
  { id: "p2", title: "Les Héros de la Foi : David", subtitle: "Documentaire" },
  { id: "p3", title: "Chants de Victoire Vol. 2", subtitle: "Musique" },
  { id: "p4", title: "Débat : Science et Foi", subtitle: "Talk Show" },
  { id: "p5", title: "Dessins Animés Bibliques", subtitle: "Jeunesse" },
];

const TESTIMONY_ITEMS: MarqueeItem[] = [
  { id: "t1", title: "J'ai été guéri du cancer après la prière", subtitle: "Guérison" },
  { id: "t2", title: "Délivré de l'alcoolisme après 20 ans", subtitle: "Délivrance" },
  { id: "t3", title: "Dieu a restauré mon mariage brisé", subtitle: "Famille" },
  { id: "t4", title: "J'ai retrouvé du travail miraculeusement", subtitle: "Provision" },
  { id: "t5", title: "La paix de Dieu a inondé mon cœur", subtitle: "Paix" },
];

const PROJECT_ITEMS: MarqueeItem[] = [
  { id: "pr1", title: "Construction d'un orphelinat à Abidjan", subtitle: "Humanitaire" },
  { id: "pr2", title: "Distribution de Bibles en milieu rural", subtitle: "Évangélisation" },
  { id: "pr3", title: "Soutien aux veuves et orphelins", subtitle: "Social" },
  { id: "pr4", title: "Création d'une radio chrétienne locale", subtitle: "Média" },
  { id: "pr5", title: "Aide d'urgence pour les réfugiés", subtitle: "Urgence" },
];

const PARTNER_ITEMS: MarqueeItem[] = [
  { id: "pt1", title: "Librairie Chrétienne CLC", subtitle: "Partenaire" },
  { id: "pt2", title: "Radio Phare FM", subtitle: "Média" },
  { id: "pt3", title: "Mission Intérieure", subtitle: "Mission" },
  { id: "pt4", title: "TopChrétien", subtitle: "Web" },
  { id: "pt5", title: "Alliance Biblique Française", subtitle: "Institution" },
];

const PROGRAM_FILTERS = [
  { value: "all", label: "Tous les Programmes" },
  { value: "teaching", label: "Enseignements" },
  { value: "documentary", label: "Documentaires" },
  { value: "music", label: "Louange & Adoration" },
  { value: "youth", label: "Jeunesse" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-0 overflow-x-hidden">
      {/* Barre d'actualités */}
      <LatestUpdatesMarquee />

      {/* Hero Section - Bento Grid */}
      <section className="px-6 pt-0 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          {/* Tuile XL - Direct (Main) */}
          <div className="md:col-span-2 md:row-span-2">
            <LiveTile className="h-full" />
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
          <div className="bg-white rounded-3xl p-0 shadow-blue-100 border border-border flex flex-col justify-between overflow-hidden">
             <ProjectsTile className="h-full w-full border-none shadow-none rounded-none" />
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

      {/* Section Bandes Défilantes (Carrousels par Interface) */}
      <section className="flex flex-col gap-8 w-full border-t border-border/50 bg-muted/20 py-10">
        
        {/* Bande Direct (Marquee Automatique) */}
        <CategoryMarquee 
          title="En Direct & Replay" 
          items={LIVE_ITEMS} 
          speed="normal" 
          direction="left"
          mode="auto"
        />

        {/* Section Programmes avec Filtres */}
        <div className="flex flex-col gap-4">
          <div className="px-6 flex items-center justify-between flex-wrap gap-4">
             <h3 className="text-xl font-bold uppercase tracking-wider text-text-deep/40 hidden md:block">
                Nos Programmes
             </h3>
             <CategoryFilters 
                categories={PROGRAM_FILTERS} 
                defaultValue="all" 
                className="w-full md:w-auto"
             />
          </div>
          <CategoryMarquee 
            title="Nos Programmes" 
            items={PROGRAM_ITEMS} 
            speed="slow" 
            direction="right" 
            className="bg-muted/30"
            mode="manual"
          />
        </div>

        {/* Bande Témoignages (Marquee Automatique - Highlight) */}
        <div className="py-8 bg-primary/5 border-y border-primary/10">
          <CategoryMarquee 
            title="Témoignages Impactants" 
            items={TESTIMONY_ITEMS} 
            speed="slow" 
            direction="left" 
            highlight={true} 
            mode="auto"
          />
        </div>

        {/* Bande Projets (Scroll Manuel) */}
        <CategoryMarquee 
          title="Projets & Missions" 
          items={PROJECT_ITEMS} 
          speed="fast" 
          direction="right" 
          mode="manual"
        />

         {/* Bande Partenaires (Marquee Logos Automatique) */}
         <CategoryMarquee 
          title="Nos Partenaires" 
          items={PARTNER_ITEMS} 
          speed="normal" 
          direction="left" 
          mode="auto"
          type="logo"
        />
      </section>

      {/* Section Statistiques */}
      <section className="px-6 max-w-7xl mx-auto w-full">
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

      {/* Section Démo Vidéo (HLS Player) */}
      <section className="px-6 max-w-5xl mx-auto w-full py-10">
         <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-text-deep">À la Une : Culte de Dimanche</h2>
               <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">LIVE</span>
            </div>
            <VideoPlayer 
               options={{
                  autoplay: false,
                  controls: true,
                  responsive: true,
                  fluid: true,
                  sources: [{
                     src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                     type: 'application/x-mpegURL'
                  }],
                  poster: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg' // Placeholder poster
               }}
            />
         </div>
      </section>

      {/* Section Publicité (Bannière) */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <AdsBanner />
      </section>

      {/* Section Ouvrages (Carrousel) */}
      <section className="bg-muted/30 w-full">
         <BooksCarousel />
      </section>
    </div>
  );
}
