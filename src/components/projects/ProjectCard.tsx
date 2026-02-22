"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const goal = project.goalAmount ? parseFloat(project.goalAmount) : 1;
  const current = project.currentAmount ? parseFloat(project.currentAmount) : 0;
  const progress = project.progressPercent ?? Math.min((current / goal) * 100, 100);

  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    completed: "bg-blue-500/10 text-blue-600 border-blue-200",
    upcoming: "bg-amber-500/10 text-amber-600 border-amber-200",
    draft: "bg-slate-500/10 text-slate-600 border-slate-200",
  };

  const statusLabels: Record<string, string> = {
    active: "En cours",
    completed: "Termine",
    upcoming: "A venir",
    draft: "Brouillon",
  };

  const statusKey = project.status || "draft";

  return (
    <div
      className="group relative bg-white rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Cover */}
      <div className="relative h-56 w-full overflow-hidden">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
            <span className="text-4xl font-bold opacity-20">PROJET</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-4 right-4">
          <Badge variant="outline" className={`backdrop-blur-md border ${statusColors[statusKey] || statusColors.draft}`}>
            {statusLabels[statusKey] || statusKey}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1">
          {project.vision || ""}
        </p>

        {/* Progress Section */}
        {project.goalAmount && (
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-end text-sm">
              <div>
                <span className="font-bold text-slate-900 text-lg">{current.toLocaleString('fr-FR')} FCFA</span>
                <span className="text-slate-500 ml-1">recoltes</span>
              </div>
              <span className="font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2.5 bg-slate-100" />
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Objectif : {goal.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <Button size="sm" className="rounded-xl gap-2 group/btn ml-auto">
            Soutenir
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
