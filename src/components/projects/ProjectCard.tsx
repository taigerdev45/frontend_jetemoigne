"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Target, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export interface ProjectMilestone {
  title: string;
  date: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  goal: number;
  raised: number;
  donorsCount: number;
  endDate: string;
  status: "active" | "completed" | "upcoming";
  milestones?: ProjectMilestone[];
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = Math.min((project.raised / project.goal) * 100, 100);
  
  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    completed: "bg-blue-500/10 text-blue-600 border-blue-200",
    upcoming: "bg-amber-500/10 text-amber-600 border-amber-200"
  };

  const statusLabels = {
    active: "En cours",
    completed: "Terminé",
    upcoming: "À venir"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Cover */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized // For external URLs in mock data
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-md border-none shadow-sm">
            {project.category}
          </Badge>
        </div>
        
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className={`backdrop-blur-md border ${statusColors[project.status]}`}>
            {statusLabels[project.status]}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Progress Section */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-end text-sm">
            <div>
              <span className="font-bold text-slate-900 text-lg">{project.raised.toLocaleString('fr-FR')} FCFA</span>
              <span className="text-slate-500 ml-1">récoltés</span>
            </div>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2.5 bg-slate-100" />
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Objectif : {project.goal.toLocaleString('fr-FR')} FCFA</span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {project.donorsCount} donateurs
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Fin : {new Date(project.endDate).toLocaleDateString('fr-FR')}</span>
          </div>
          
          <Button size="sm" className="rounded-xl gap-2 group/btn">
            Soutenir
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
