"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Image from "next/image";
import { Program, ProgramCategory, ContentFormat } from "@/types";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2, Plus, Film, Loader2 } from "lucide-react";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New Program Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<ProgramCategory>("info");
  const [newFormat, setNewFormat] = useState<ContentFormat>("video");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newAudioUrl, setNewAudioUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.content.getPrograms();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setNewTitle("");
    setNewDescription("");
    setNewCategory("info");
    setNewFormat("video");
    setNewVideoUrl("");
    setNewAudioUrl("");
    setThumbnailFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Etes-vous sur de vouloir supprimer ce programme ?")) return;
    setIsLoading(true);
    try {
      await api.admin.content.deleteProgram(id);
      fetchPrograms();
    } catch (error) {
      console.error("Failed to delete program:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newTitle || !newCategory) {
      alert("Veuillez remplir le titre et la categorie");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("description", newDescription);
      formData.append("category", newCategory);
      formData.append("format", newFormat);
      if (newVideoUrl) {
        formData.append("videoUrl", newVideoUrl);
      }
      if (newAudioUrl) {
        formData.append("audioUrl", newAudioUrl);
      }
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      await api.admin.content.createProgram(formData);

      setIsDialogOpen(false);
      fetchPrograms();
    } catch (error) {
      console.error("Failed to save program:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryLabel = (category: ProgramCategory) => {
    const labels: Record<ProgramCategory, string> = {
      info: "Info",
      jeunesse_cinema: "Jeunesse & Cinema",
      divertissement: "Divertissement",
      podcast: "Podcast",
      evangelisation: "Evangelisation",
      concert: "Concert",
      temoignage_live: "Temoignage Live",
      autre: "Autre",
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion des Programmes</h1>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Programme
        </Button>
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
                <TableHead className="w-[100px]">Miniature</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vues</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                    Aucun programme trouve.
                  </TableCell>
                </TableRow>
              ) : (
                programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      <div className="relative h-12 w-20 overflow-hidden rounded-md bg-slate-100">
                        {program.thumbnailUrl ? (
                          <Image src={program.thumbnailUrl} alt={program.title} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
                            <Film className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{program.title}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{program.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getCategoryLabel(program.category)}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-500">{program.format}</span>
                    </TableCell>
                    <TableCell>
                      {program.publishedAt
                        ? format(new Date(program.publishedAt), "dd MMM yyyy", { locale: fr })
                        : program.createdAt
                        ? format(new Date(program.createdAt), "dd MMM yyyy", { locale: fr })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-500">{program.viewsCount || "0"}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Supprimer" onClick={() => handleDelete(program.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouveau programme</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Titre</Label>
              <Input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Description</Label>
              <Textarea
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Categorie</Label>
              <Select
                value={newCategory}
                onValueChange={val => setNewCategory(val as ProgramCategory)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Categorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="jeunesse_cinema">Jeunesse & Cinema</SelectItem>
                  <SelectItem value="divertissement">Divertissement</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="evangelisation">Evangelisation</SelectItem>
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="temoignage_live">Temoignage Live</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Format</Label>
              <Select
                value={newFormat}
                onValueChange={val => setNewFormat(val as ContentFormat)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="ecrit">Ecrit</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">URL Video</Label>
              <Input
                placeholder="https://youtube.com/..."
                value={newVideoUrl}
                onChange={e => setNewVideoUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">URL Audio</Label>
              <Input
                placeholder="https://..."
                value={newAudioUrl}
                onChange={e => setNewAudioUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Miniature</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
             <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
