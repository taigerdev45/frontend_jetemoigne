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
import { Testimony } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, X, Eye, FileText, Video, Mic } from "lucide-react";

// Mock Data
const MOCK_TESTIMONIES: Testimony[] = [
  {
    id: "1",
    type: "video",
    author: { name: "Sophie Martin", role: "Membre" },
    title: "Ma guérison miraculeuse",
    content: "https://example.com/video1.mp4",
    thumbnail: "/images/testimony-thumb-1.jpg",
    duration: "4:30",
    date: "2024-03-15",
    category: "Guérison",
    status: "pending",
  },
  {
    id: "2",
    type: "text",
    author: { name: "Jean Dupont", role: "Visiteur" },
    title: "Une rencontre inattendue",
    content: "C'était un soir d'hiver...",
    date: "2024-03-14",
    category: "Conversion",
    status: "approved",
  },
  {
    id: "3",
    type: "audio",
    author: { name: "Marie Curie", role: "Partenaire" },
    title: "La paix retrouvée",
    content: "https://example.com/audio1.mp3",
    duration: "12:00",
    date: "2024-03-13",
    category: "Paix intérieure",
    status: "rejected",
  },
];

export default function TestimoniesPage() {
  const [testimonies, setTestimonies] = useState<Testimony[]>(MOCK_TESTIMONIES);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filteredTestimonies = testimonies.filter(
    (t) => filter === "all" || t.status === filter
  );

  const handleStatusChange = (id: string, newStatus: "approved" | "rejected") => {
    setTestimonies(testimonies.map((t) => 
      t.id === id ? { ...t, status: newStatus } : t
    ));
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Validé</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">En attente</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4 text-blue-500" />;
      case "audio": return <Mic className="h-4 w-4 text-purple-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Modération des Témoignages</h1>
        <div className="flex gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            onClick={() => setFilter("all")}
          >
            Tout
          </Button>
          <Button 
            variant={filter === "pending" ? "default" : "outline"} 
            onClick={() => setFilter("pending")}
            className={filter === "pending" ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            En attente
          </Button>
          <Button 
            variant={filter === "approved" ? "default" : "outline"} 
            onClick={() => setFilter("approved")}
            className={filter === "approved" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            Validés
          </Button>
          <Button 
            variant={filter === "rejected" ? "default" : "outline"} 
            onClick={() => setFilter("rejected")}
            className={filter === "rejected" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            Rejetés
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTestimonies.map((testimony) => (
              <TableRow key={testimony.id}>
                <TableCell>{getTypeIcon(testimony.type)}</TableCell>
                <TableCell>{format(new Date(testimony.date), "dd MMM yyyy", { locale: fr })}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{testimony.author.name}</span>
                    <span className="text-xs text-muted-foreground">{testimony.author.role}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{testimony.title}</TableCell>
                <TableCell>{testimony.category}</TableCell>
                <TableCell>{getStatusBadge(testimony.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="Voir">
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                    {testimony.status === "pending" && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleStatusChange(testimony.id, "approved")}
                          title="Valider"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleStatusChange(testimony.id, "rejected")}
                          title="Rejeter"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
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
