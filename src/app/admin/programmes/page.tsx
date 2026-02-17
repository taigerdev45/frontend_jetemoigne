"use client";

import { useState } from "react";
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
import { Program } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, Edit, Trash2, Plus, Film } from "lucide-react";

// Mock Data
const MOCK_PROGRAMS: Program[] = [
  {
    id: "1",
    title: "Culte du Dimanche",
    description: "Prédication sur la foi et l'espérance.",
    thumbnail: "/images/program-1.jpg",
    category: "Culte",
    date: "2024-03-10",
    duration: "1:30:00",
    status: "published",
  },
  {
    id: "2",
    title: "Étude Biblique",
    description: "Analyse du livre de la Genèse.",
    thumbnail: "/images/program-2.jpg",
    category: "Étude",
    date: "2024-03-12",
    duration: "45:00",
    status: "draft",
  },
  {
    id: "3",
    title: "Concert de Louange",
    description: "Soirée spéciale avec la chorale.",
    thumbnail: "/images/program-3.jpg",
    category: "Musique",
    date: "2024-03-08",
    duration: "2:00:00",
    status: "archived",
  },
];

export default function ProgramsPage() {
  const [programs] = useState<Program[]>(MOCK_PROGRAMS);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500 hover:bg-green-600">Publié</Badge>;
      case "draft":
        return <Badge variant="secondary">Brouillon</Badge>;
      case "archived":
        return <Badge variant="outline">Archivé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion des Programmes</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Programme
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Miniature</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell>
                  <div className="relative h-12 w-20 overflow-hidden rounded-md bg-slate-100">
                     {/* Mock image placeholder */}
                     <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
                        <Film className="h-6 w-6" />
                     </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{program.title}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">{program.description}</span>
                  </div>
                </TableCell>
                <TableCell>{program.category}</TableCell>
                <TableCell>{format(new Date(program.date), "dd MMM yyyy", { locale: fr })}</TableCell>
                <TableCell>{program.duration}</TableCell>
                <TableCell>{getStatusBadge(program.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="Voir">
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Modifier">
                      <Edit className="h-4 w-4 text-orange-500" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Supprimer">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
