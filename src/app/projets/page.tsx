"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

// Mock Data for Projects
const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Construction du Studio TV",
    description: "Aidez-nous à bâtir un studio professionnel pour produire des émissions de qualité et diffuser l'Évangile à grande échelle.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
    category: "Infrastructure",
    goal: 15000000,
    raised: 8500000,
    donorsCount: 124,
    endDate: "2026-12-31",
    status: "active",
    milestones: [
      { title: "Acquisition du terrain", date: "2025-01-15", completed: true },
      { title: "Fondations", date: "2025-06-01", completed: false }
    ]
  },
  {
    id: "2",
    title: "Campagne d'Évangélisation 2026",
    description: "Soutenez notre grande tournée nationale pour apporter le message d'espoir dans 10 villes du pays.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
    category: "Mission",
    goal: 5000000,
    raised: 1200000,
    donorsCount: 45,
    endDate: "2026-08-15",
    status: "active"
  },
  {
    id: "3",
    title: "Application Mobile Jetemoigne",
    description: "Financement du développement de l'application mobile pour rendre les témoignages accessibles partout, même hors ligne.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    category: "Technologie",
    goal: 3000000,
    raised: 2800000,
    donorsCount: 89,
    endDate: "2026-05-30",
    status: "active"
  },
  {
    id: "4",
    title: "Formation des Bénévoles",
    description: "Programme de formation pour équiper nos 50 bénévoles avec les compétences techniques et spirituelles nécessaires.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    category: "Formation",
    goal: 1000000,
    raised: 1000000,
    donorsCount: 30,
    endDate: "2026-03-01",
    status: "completed"
  }
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Vision 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Nos Projets <span className="text-primary">Communautaires</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Découvrez les initiatives qui façonnent l&apos;avenir de Jetemoigne-TV. 
              Chaque don, chaque prière et chaque partage contribue à faire avancer l&apos;œuvre.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <ProjectCard project={project as Project} />
              </motion.div>
            ))}
          </div>

          {/* Empty State / CTA */}
          <div className="mt-20 text-center bg-white rounded-3xl p-12 border border-border shadow-sm max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Vous avez un projet à cœur ?
            </h3>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              Nous sommes toujours à l&apos;écoute de nouvelles idées pour étendre notre impact. 
              Rejoignez l&apos;équipe de bénévoles pour proposer vos initiatives.
            </p>
            <Button size="lg" className="rounded-full px-8 gap-2">
              Devenir Bénévole
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
