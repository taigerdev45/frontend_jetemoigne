"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Trash2,
  Plus,
  Film,
  Play,
  Mic,
  Check,
  X,
  Calendar as CalendarIcon,
  FileText,
  Loader2
} from "lucide-react";
import { Program, TestimonyWithReviewer, ProgramCategory, ContentFormat } from "@/types";
import { api } from "@/lib/api";

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("programs");
  const [isLoading, setIsLoading] = useState(false);

  // Programs state
  const [programs, setPrograms] = useState<Program[]>([]);

  // Testimonies state
  const [testimonies, setTestimonies] = useState<TestimonyWithReviewer[]>([]);

  // Program Form State
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);
  const [newProgramTitle, setNewProgramTitle] = useState("");
  const [newProgramCategory, setNewProgramCategory] = useState<ProgramCategory>("info");
  const [newProgramFormat, setNewProgramFormat] = useState<ContentFormat>("video");
  const [newProgramVideoUrl, setNewProgramVideoUrl] = useState("");
  const [newProgramDescription, setNewProgramDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Testimony Workflow State
  const [selectedTestimony, setSelectedTestimony] = useState<TestimonyWithReviewer | null>(null);
  const [isTestimonyDialogOpen, setIsTestimonyDialogOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3>(1);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date());

  const fetchPrograms = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.content.getPrograms();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTestimonies = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.testimonies.findAll();
      setTestimonies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch testimonies:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "programs") {
      fetchPrograms();
    } else {
      fetchTestimonies();
    }
  }, [activeTab, fetchPrograms, fetchTestimonies]);

  // Program Handlers
  const handleAddProgram = async () => {
    if (!newProgramTitle) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", newProgramTitle);
      formData.append("category", newProgramCategory);
      formData.append("format", newProgramFormat);
      if (newProgramDescription) formData.append("description", newProgramDescription);
      if (newProgramVideoUrl) formData.append("videoUrl", newProgramVideoUrl);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

      await api.admin.content.createProgram(formData);
      setIsProgramDialogOpen(false);
      resetProgramForm();
      fetchPrograms();
    } catch (error) {
      console.error("Failed to create program:", error);
      alert("Erreur lors de la creation du programme.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Supprimer ce programme ?")) return;
    try {
      await api.admin.content.deleteProgram(id);
      setPrograms(programs.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete program:", error);
      alert("Erreur lors de la suppression.");
    }
  };

  const resetProgramForm = () => {
    setNewProgramTitle("");
    setNewProgramCategory("info");
    setNewProgramFormat("video");
    setNewProgramVideoUrl("");
    setNewProgramDescription("");
    setThumbnailFile(null);
  };

  // Testimony Handlers
  const openTestimonyWorkflow = (testimony: TestimonyWithReviewer) => {
    setSelectedTestimony(testimony);
    setWorkflowStep(1);
    setIsTestimonyDialogOpen(true);
  };

  const handleTestimonyDecision = async (decision: "approve" | "reject") => {
    if (!selectedTestimony) return;

    if (decision === "reject") {
      if (!confirm("Etes-vous sur de vouloir rejeter ce temoignage ?")) return;
      // Rejection is handled by validate with rejection (the API doesn't have a reject endpoint for testimonies,
      // so we just mark it locally or call validate with appropriate data)
      try {
        // Note: The admin testimonies API doesn't have a direct "reject" endpoint.
        // The validate endpoint can be used to mark as validated.
        // For now we update locally - in a real scenario, you'd need a reject endpoint or use validate differently.
        setTestimonies(testimonies.map(t =>
          t.id === selectedTestimony.id ? { ...t, status: "rejete" } : t
        ));
        setIsTestimonyDialogOpen(false);
      } catch (error) {
        console.error("Failed to reject testimony:", error);
      }
    } else {
      // Approve -> move to scheduling step
      setWorkflowStep(3);
    }
  };

  const handleScheduleTestimony = async () => {
    if (!selectedTestimony || !scheduleDate) return;

    if (confirm(`Confirmer la programmation pour le ${format(scheduleDate, "dd MMM yyyy")} ?`)) {
      try {
        const updated = await api.admin.testimonies.schedule(selectedTestimony.id, {
          scheduledFor: scheduleDate.toISOString(),
        });
        setTestimonies(testimonies.map(t =>
          t.id === selectedTestimony.id
            ? { ...t, status: updated.status, scheduledFor: updated.scheduledFor }
            : t
        ));
        setIsTestimonyDialogOpen(false);
      } catch (error) {
        console.error("Failed to schedule testimony:", error);
        alert("Erreur lors de la programmation.");
      }
    }
  };

  const handleValidateTestimony = async (id: string) => {
    try {
      const updated = await api.admin.testimonies.validate(id);
      setTestimonies(testimonies.map(t =>
        t.id === id ? { ...t, status: updated.status } : t
      ));
      setIsTestimonyDialogOpen(false);
    } catch (error) {
      console.error("Failed to validate testimony:", error);
      alert("Erreur lors de la validation.");
    }
  };

  const getEmbedUrl = (url?: string | null) => {
    if (!url) return "";
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
       return url.replace("watch?v=", "embed/");
    }
    return url;
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
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion du Contenu</h1>
      </div>

      <Tabs defaultValue="programs" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="programs">Programmes</TabsTrigger>
          <TabsTrigger value="testimonies">Temoignages</TabsTrigger>
        </TabsList>

        {/* --- PROGRAMS TAB --- */}
        <TabsContent value="programs" className="space-y-4 mt-6">
          <div className="flex justify-end">
            <Dialog open={isProgramDialogOpen} onOpenChange={setIsProgramDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Nouveau Programme
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un Programme</DialogTitle>
                  <DialogDescription>Remplissez les details du programme.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Titre</Label>
                    <Input
                      id="title"
                      value={newProgramTitle}
                      onChange={(e) => setNewProgramTitle(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Description</Label>
                    <Input
                      value={newProgramDescription}
                      onChange={(e) => setNewProgramDescription(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Categorie</Label>
                    <Select
                      value={newProgramCategory}
                      onValueChange={(val) => setNewProgramCategory(val as ProgramCategory)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selectionner une categorie" />
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
                    <Label htmlFor="format" className="text-right">Format</Label>
                    <Select
                      value={newProgramFormat}
                      onValueChange={(val) => setNewProgramFormat(val as ContentFormat)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selectionner un format" />
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
                    <Label htmlFor="url" className="text-right">URL Video</Label>
                    <Input
                      id="url"
                      placeholder="https://youtube.com/..."
                      value={newProgramVideoUrl}
                      onChange={(e) => setNewProgramVideoUrl(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Miniature</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                      className="col-span-3"
                    />
                  </div>

                  {newProgramVideoUrl && (
                    <div className="col-span-4 mt-2">
                      <Label className="mb-2 block">Apercu Embed</Label>
                      <div className="aspect-video w-full rounded-md overflow-hidden bg-slate-100">
                         <iframe
                           src={getEmbedUrl(newProgramVideoUrl)}
                           className="w-full h-full"
                           title="Preview"
                           allowFullScreen
                         />
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={handleAddProgram} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border bg-white shadow-sm">
            {isLoading && activeTab === "programs" ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Media</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Categorie</TableHead>
                    <TableHead>Format</TableHead>
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
                          <div className="h-10 w-16 relative rounded overflow-hidden bg-slate-100">
                            {program.thumbnailUrl ? (
                              <Image src={program.thumbnailUrl} alt={program.title} className="h-full w-full object-cover" fill sizes="64px" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                <Film className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {program.createdAt ? format(new Date(program.createdAt), "dd MMM yyyy", { locale: fr }) : "-"}
                        </TableCell>
                        <TableCell className="font-medium">{program.title}</TableCell>
                        <TableCell><Badge variant="outline">{getCategoryLabel(program.category)}</Badge></TableCell>
                        <TableCell>{program.format}</TableCell>
                        <TableCell><span className="text-sm text-slate-500">{program.viewsCount || "0"}</span></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteProgram(program.id)}>
                              <Trash2 className="h-4 w-4" />
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
        </TabsContent>

        {/* --- TESTIMONIES TAB --- */}
        <TabsContent value="testimonies" className="space-y-4 mt-6">
          <div className="rounded-md border bg-white shadow-sm">
            {isLoading && activeTab === "testimonies" ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Reception</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                        Aucun temoignage trouve.
                      </TableCell>
                    </TableRow>
                  ) : (
                    testimonies.map((testimony) => (
                      <TableRow key={testimony.id}>
                        <TableCell>
                            {testimony.mediaType === "video" && <Play className="h-4 w-4 text-red-500" />}
                            {testimony.mediaType === "audio" && <Mic className="h-4 w-4 text-blue-500" />}
                            {(testimony.mediaType === "ecrit" || testimony.mediaType === "image" || !testimony.mediaType) && <FileText className="h-4 w-4 text-emerald-500" />}
                        </TableCell>
                        <TableCell>
                          {testimony.createdAt ? format(new Date(testimony.createdAt), "dd MMM yyyy", { locale: fr }) : "-"}
                        </TableCell>
                        <TableCell>{testimony.authorName || "Anonyme"}</TableCell>
                        <TableCell className="font-medium">{testimony.title || "-"}</TableCell>
                        <TableCell>
                            {testimony.status === "recu" && <Badge variant="secondary">Recu</Badge>}
                            {testimony.status === "en_lecture" && <Badge className="bg-blue-500">En lecture</Badge>}
                            {testimony.status === "valide" && <Badge className="bg-green-500">Valide</Badge>}
                            {testimony.status === "rejete" && <Badge variant="destructive">Rejete</Badge>}
                            {testimony.status === "programme" && <Badge className="bg-purple-600">Programme</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          {(testimony.status === "recu" || testimony.status === "en_lecture") ? (
                            <Button size="sm" onClick={() => openTestimonyWorkflow(testimony)}>
                                Voir / Traiter
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400">Traite</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* WORKFLOW DIALOG */}
          <Dialog open={isTestimonyDialogOpen} onOpenChange={setIsTestimonyDialogOpen}>
             <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Traitement du Temoignage</DialogTitle>
                    <DialogDescription>
                        Etape {workflowStep} / 3 : {workflowStep === 1 ? "Visionnage & Lecture" : workflowStep === 2 ? "Decision" : "Programmation"}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {/* STEP 1: VIEW */}
                    {workflowStep === 1 && selectedTestimony && (
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-lg border">
                                <h3 className="font-bold text-lg mb-2">{selectedTestimony.title || "Sans titre"}</h3>
                                <div className="text-sm text-slate-500 mb-4">
                                  Par {selectedTestimony.authorName || "Anonyme"} - {selectedTestimony.createdAt ? format(new Date(selectedTestimony.createdAt), "dd MMMM yyyy", { locale: fr }) : ""}
                                </div>

                                {selectedTestimony.mediaType === "ecrit" || !selectedTestimony.mediaUrl ? (
                                    <div className="prose prose-sm max-w-none bg-white p-4 rounded border">
                                        {selectedTestimony.contentText || "Aucun contenu texte."}
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-black rounded flex items-center justify-center text-white">
                                        <Play className="h-12 w-12 opacity-50" />
                                        <span className="ml-2">
                                          <a href={selectedTestimony.mediaUrl} target="_blank" rel="noopener noreferrer" className="underline">
                                            Ouvrir le media
                                          </a>
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={() => setWorkflowStep(2)}>
                                    Passer a la decision <Check className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DECISION */}
                    {workflowStep === 2 && (
                        <div className="space-y-6 text-center py-8">
                            <h3 className="text-xl font-medium">Quelle action souhaitez-vous entreprendre ?</h3>
                            <div className="flex justify-center gap-4">
                                <Button
                                    variant="outline"
                                    className="h-24 w-32 flex-col gap-2 border-2 border-red-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                    onClick={() => handleTestimonyDecision("reject")}
                                >
                                    <X className="h-6 w-6" />
                                    Rejeter
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-24 w-32 flex-col gap-2 border-2 border-green-100 hover:bg-green-50 hover:text-green-600"
                                    onClick={() => selectedTestimony && handleValidateTestimony(selectedTestimony.id)}
                                >
                                    <Check className="h-6 w-6" />
                                    Valider
                                </Button>
                                <Button
                                    className="h-24 w-32 flex-col gap-2 bg-purple-600 hover:bg-purple-700"
                                    onClick={() => handleTestimonyDecision("approve")}
                                >
                                    <CalendarIcon className="h-6 w-6" />
                                    Programmer
                                </Button>
                            </div>
                            <Button variant="ghost" onClick={() => setWorkflowStep(1)} className="mt-4">
                                Retour au visionnage
                            </Button>
                        </div>
                    )}

                    {/* STEP 3: SCHEDULE */}
                    {workflowStep === 3 && (
                        <div className="space-y-4">
                            <div className="grid place-items-center">
                                <Label className="mb-4 text-lg">Choisir la date de publication</Label>
                                <div className="border rounded-md p-4">
                                    <Calendar
                                        mode="single"
                                        selected={scheduleDate}
                                        onSelect={setScheduleDate}
                                        className="rounded-md border"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between mt-6">
                                <Button variant="outline" onClick={() => setWorkflowStep(2)}>Retour</Button>
                                <Button onClick={handleScheduleTestimony}>
                                    Confirmer la programmation <CalendarIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
             </DialogContent>
          </Dialog>

        </TabsContent>
      </Tabs>
    </div>
  );
}
