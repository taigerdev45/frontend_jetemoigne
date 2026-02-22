"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Users,
  Loader2,
  Eye,
} from "lucide-react";
import { Project, Profile } from "@/types";
import { api } from "@/lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamUsers, setTeamUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [projectsData, usersData] = await Promise.all([
          api.projects.findAll(),
          api.admin.team.getUsers(),
        ]);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setTeamUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProgress = (project: Project) => {
    if (project.progressPercent !== null && project.progressPercent !== undefined) {
      return project.progressPercent;
    }
    if (!project.milestones || project.milestones.length === 0) return 0;
    const completed = project.milestones.filter(m => m.isCompleted).length;
    return Math.round((completed / project.milestones.length) * 100);
  };

  const formatAmount = (amount: string | null) => {
    if (!amount) return "-";
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return num.toLocaleString("fr-FR") + " XAF";
  };

  const getTeamMemberName = (userId: string) => {
    const user = teamUsers.find(u => u.id === userId);
    return user?.fullName || "Inconnu";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion des Projets</h1>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        {isLoading ? (
             <div className="flex justify-center items-center py-20">
             <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
           </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projet</TableHead>
                <TableHead>Objectif / Collecte</TableHead>
                <TableHead>Equipe</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                  <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                    Aucun projet trouve.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {project.coverImageUrl && (
                          <div className="h-10 w-10 relative overflow-hidden rounded">
                            <Image src={project.coverImageUrl} alt={project.title} className="object-cover h-full w-full" fill sizes="40px" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-slate-500 truncate max-w-[200px]">{project.vision || "-"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatAmount(project.goalAmount)}</div>
                      <div className="text-xs text-slate-500">
                        Collecte: {formatAmount(project.currentAmount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2 overflow-hidden">
                        {project.team?.map((member, i) => (
                          <div
                            key={i}
                            className="h-8 w-8 rounded-full ring-2 ring-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-800"
                            title={getTeamMemberName(member.userId)}
                          >
                            {getTeamMemberName(member.userId).charAt(0)}
                          </div>
                        ))}
                        {(!project.team || project.team.length === 0) && <span className="text-slate-400 text-sm">-</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={getProgress(project)} className="w-[60px]" />
                        <span className="text-xs font-medium">{getProgress(project)}%</span>
                      </div>
                      {project.milestones && project.milestones.length > 0 && (
                        <div className="text-xs text-slate-500 mt-1">
                          {project.milestones.filter(m => m.isCompleted).length}/{project.milestones.length} etapes
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.status === "active" ? "default" : "secondary"}>
                        {project.status === "active" ? "En cours" : project.status || "-"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
