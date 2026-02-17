"use client";

import { useState } from "react";
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
  Edit, 
  Trash2, 
  Plus, 
  Film, 
  Play, 
  Mic, 
  Check, 
  X, 
  Calendar as CalendarIcon,
  FileText
} from "lucide-react";
import { Program, Testimony } from "@/types";

// Mock Data
const MOCK_PROGRAMS: Program[] = [
  {
    id: "1",
    title: "Culte du Dimanche - La Foi qui déplace les montagnes",
    description: "Enseignement puissant sur la foi.",
    thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800",
    category: "Culte Live",
    format: "Video",
    date: "2024-03-10",
    duration: "1h 45m",
    status: "published",
    externalUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "2",
    title: "Interview Spéciale - Pasteur Jean",
    description: "Retour sur la conférence annuelle.",
    thumbnail: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=800",
    category: "Interview",
    format: "Video",
    date: "2024-03-12",
    duration: "45m",
    status: "draft",
    externalUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
];

const MOCK_TESTIMONIES: Testimony[] = [
  {
    id: "1",
    type: "video",
    author: { name: "Sarah Connor", role: "Fidèle" },
    title: "Guérison miraculeuse",
    content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    duration: "12:45",
    date: "2024-03-14",
    category: "Guérison",
    status: "pending",
  },
  {
    id: "2",
    type: "text",
    author: { name: "Marc Dupont" },
    title: "Restauration financière",
    content: "Dieu a restauré mes finances après une période difficile...",
    date: "2024-03-13",
    category: "Finance",
    status: "pending",
  },
];

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("programs");
  const [programs, setPrograms] = useState<Program[]>(MOCK_PROGRAMS);
  const [testimonies, setTestimonies] = useState<Testimony[]>(MOCK_TESTIMONIES);
  
  // Program Form State
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);
  const [newProgram, setNewProgram] = useState<Partial<Program>>({
    title: "",
    category: "Culte Live",
    format: "Video",
    externalUrl: "",
  });

  // Testimony Workflow State
  const [selectedTestimony, setSelectedTestimony] = useState<Testimony | null>(null);
  const [isTestimonyDialogOpen, setIsTestimonyDialogOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3>(1); // 1: View, 2: Decision, 3: Schedule
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date());

  // Program Handlers
  const handleAddProgram = () => {
    if (!newProgram.title || !newProgram.externalUrl) return;
    
    const program: Program = {
      id: Math.random().toString(36).substr(2, 9),
      title: newProgram.title,
      description: newProgram.description || "",
      thumbnail: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=800", // Placeholder
      category: newProgram.category as string,
      format: newProgram.format,
      externalUrl: newProgram.externalUrl,
      date: new Date().toISOString(),
      status: "draft",
    };

    setPrograms([program, ...programs]);
    setIsProgramDialogOpen(false);
    setNewProgram({ title: "", category: "Culte Live", format: "Video", externalUrl: "" });
  };

  // Testimony Handlers
  const openTestimonyWorkflow = (testimony: Testimony) => {
    setSelectedTestimony(testimony);
    setWorkflowStep(1);
    setIsTestimonyDialogOpen(true);
  };

  const handleTestimonyDecision = (decision: "approve" | "reject") => {
    if (decision === "reject") {
      if (confirm("Êtes-vous sûr de vouloir rejeter ce témoignage ?")) {
        setTestimonies(testimonies.map(t => t.id === selectedTestimony?.id ? { ...t, status: "rejected" } : t));
        setIsTestimonyDialogOpen(false);
      }
    } else {
      setWorkflowStep(3); // Move to scheduling
    }
  };

  const handleScheduleTestimony = () => {
    if (!selectedTestimony || !scheduleDate) return;
    
    if (confirm(`Confirmer la programmation pour le ${format(scheduleDate, "dd MMM yyyy")} ?`)) {
        setTestimonies(testimonies.map(t => 
            t.id === selectedTestimony.id 
            ? { ...t, status: "scheduled", date: scheduleDate.toISOString() } 
            : t
        ));
        setIsTestimonyDialogOpen(false);
    }
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    // Simple youtube ID extraction for demo
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
       return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion du Contenu</h1>
      </div>

      <Tabs defaultValue="programs" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="programs">Programmes</TabsTrigger>
          <TabsTrigger value="testimonies">Témoignages</TabsTrigger>
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
                  <DialogDescription>Remplissez les détails du programme. L&apos;embed sera généré automatiquement.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Titre</Label>
                    <Input 
                      id="title" 
                      value={newProgram.title} 
                      onChange={(e) => setNewProgram({...newProgram, title: e.target.value})}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Catégorie</Label>
                    <Select 
                      value={newProgram.category} 
                      onValueChange={(val) => setNewProgram({...newProgram, category: val})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Culte Live">Culte Live</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Talk Show">Talk Show</SelectItem>
                        <SelectItem value="Enseignement">Enseignement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="format" className="text-right">Format</Label>
                    <Select 
                      value={newProgram.format} 
                      onValueChange={(val) => setNewProgram({...newProgram, format: val})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Video">Vidéo</SelectItem>
                        <SelectItem value="Audio">Audio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">URL Externe</Label>
                    <Input 
                      id="url" 
                      placeholder="https://youtube.com/..."
                      value={newProgram.externalUrl} 
                      onChange={(e) => setNewProgram({...newProgram, externalUrl: e.target.value})}
                      className="col-span-3" 
                    />
                  </div>
                  
                  {newProgram.externalUrl && (
                    <div className="col-span-4 mt-2">
                      <Label className="mb-2 block">Aperçu Embed</Label>
                      <div className="aspect-video w-full rounded-md overflow-hidden bg-slate-100">
                         <iframe 
                           src={getEmbedUrl(newProgram.externalUrl)} 
                           className="w-full h-full" 
                           title="Preview" 
                           allowFullScreen 
                         />
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddProgram}>Enregistrer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Média</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      <div className="h-10 w-16 relative rounded overflow-hidden bg-slate-100">
                         {/* Placeholder for thumbnail */}
                         <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                            <Film className="h-4 w-4" />
                         </div>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(program.date), "dd MMM yyyy", { locale: fr })}</TableCell>
                    <TableCell className="font-medium">{program.title}</TableCell>
                    <TableCell><Badge variant="outline">{program.category}</Badge></TableCell>
                    <TableCell>{program.format}</TableCell>
                    <TableCell>
                        <Badge variant={program.status === "published" ? "default" : "secondary"}>
                            {program.status === "published" ? "Publié" : "Brouillon"}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* --- TESTIMONIES TAB --- */}
        <TabsContent value="testimonies" className="space-y-4 mt-6">
           <div className="rounded-md border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Réception</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonies.map((testimony) => (
                  <TableRow key={testimony.id}>
                    <TableCell>
                        {testimony.type === "video" && <Play className="h-4 w-4 text-red-500" />}
                        {testimony.type === "audio" && <Mic className="h-4 w-4 text-blue-500" />}
                        {testimony.type === "text" && <FileText className="h-4 w-4 text-emerald-500" />}
                    </TableCell>
                    <TableCell>{format(new Date(testimony.date), "dd MMM yyyy", { locale: fr })}</TableCell>
                    <TableCell>{testimony.author.name}</TableCell>
                    <TableCell className="font-medium">{testimony.title}</TableCell>
                    <TableCell>
                        {testimony.status === "pending" && <Badge className="bg-orange-500">En attente</Badge>}
                        {testimony.status === "approved" && <Badge className="bg-green-500">Validé</Badge>}
                        {testimony.status === "rejected" && <Badge variant="destructive">Rejeté</Badge>}
                        {testimony.status === "scheduled" && <Badge className="bg-blue-600">Programmé</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      {testimony.status === "pending" ? (
                        <Button size="sm" onClick={() => openTestimonyWorkflow(testimony)}>
                            Voir / Traiter
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">Traité</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* WORKFLOW DIALOG */}
          <Dialog open={isTestimonyDialogOpen} onOpenChange={setIsTestimonyDialogOpen}>
             <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Traitement du Témoignage</DialogTitle>
                    <DialogDescription>
                        Étape {workflowStep} / 3 : {workflowStep === 1 ? "Visionnage & Lecture" : workflowStep === 2 ? "Décision" : "Programmation"}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {/* STEP 1: VIEW */}
                    {workflowStep === 1 && selectedTestimony && (
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-lg border">
                                <h3 className="font-bold text-lg mb-2">{selectedTestimony.title}</h3>
                                <div className="text-sm text-slate-500 mb-4">Par {selectedTestimony.author.name} - {format(new Date(selectedTestimony.date), "dd MMMM yyyy", { locale: fr })}</div>
                                
                                {selectedTestimony.type === "text" ? (
                                    <div className="prose prose-sm max-w-none bg-white p-4 rounded border">
                                        {selectedTestimony.content}
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-black rounded flex items-center justify-center text-white">
                                        {/* Mock Player */}
                                        <Play className="h-12 w-12 opacity-50" />
                                        <span className="ml-2">Lecture du média...</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={() => setWorkflowStep(2)}>
                                    Passer à la décision <Check className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DECISION */}
                    {workflowStep === 2 && (
                        <div className="space-y-6 text-center py-8">
                            <h3 className="text-xl font-medium">Quelle action souhaitez-vous entreprendre ?</h3>
                            <div className="flex justify-center gap-4">
                                <Button variant="outline" className="h-24 w-32 flex-col gap-2 border-2 hover:bg-slate-50">
                                    <Edit className="h-6 w-6" />
                                    Modifier
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-24 w-32 flex-col gap-2 border-2 border-red-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                    onClick={() => handleTestimonyDecision("reject")}
                                >
                                    <X className="h-6 w-6" />
                                    Rejeter
                                </Button>
                                <Button 
                                    className="h-24 w-32 flex-col gap-2 bg-green-600 hover:bg-green-700"
                                    onClick={() => handleTestimonyDecision("approve")}
                                >
                                    <Check className="h-6 w-6" />
                                    Valider
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
