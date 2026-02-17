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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Target, 
  Users, 
  CheckCircle2, 
  Circle,
  Calendar as CalendarIcon
} from "lucide-react";
import { Project, ProjectMilestone, ProjectTeamMember } from "@/types";

// Mock Users for Team Selection
const MOCK_USERS = [
  { id: "u1", name: "Alice Admin", role: "Super Admin" },
  { id: "u2", name: "Bob Builder", role: "Gestionnaire" },
  { id: "u3", name: "Charlie Comptable", role: "Comptable" },
  { id: "u4", name: "David Dev", role: "Bénévole" },
];

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Construction Orphelinat",
    description: "Construction d'un nouveau bâtiment pour 50 enfants.",
    image: "/images/project1.jpg",
    category: "Construction",
    goal: 50000,
    raised: 15000,
    donorsCount: 120,
    endDate: "2024-12-31",
    status: "active",
    budget: 50000,
    objectives: ["Fondations terminées", "Toiture posée", "Inauguration"],
    team: [
      { userId: "u2", name: "Bob Builder", role: "Chef de Projet" }
    ],
    milestones: [
      { title: "Achat Terrain", date: "2024-01-15", completed: true },
      { title: "Permis de Construire", date: "2024-03-01", completed: true },
      { title: "Fondations", date: "2024-06-01", completed: false },
    ]
  },
  {
    id: "2",
    title: "Campagne de Vaccination",
    description: "Campagne médicale dans les zones rurales.",
    image: "/images/project2.jpg",
    category: "Santé",
    goal: 10000,
    raised: 8000,
    donorsCount: 300,
    endDate: "2024-06-30",
    status: "active",
    budget: 12000,
    objectives: ["Vacciner 1000 enfants", "Distribuer 500 kits"],
    team: [
      { userId: "u4", name: "David Dev", role: "Coordinateur" }
    ],
    milestones: [
      { title: "Recrutement Médecins", date: "2024-02-01", completed: true },
      { title: "Début Campagne", date: "2024-04-01", completed: false },
    ]
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form State
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: "",
    description: "",
    category: "Humanitaire",
    goal: 0,
    budget: 0,
    objectives: [],
    team: [],
    milestones: []
  });

  // Local state for dynamic list inputs
  const [newObjective, setNewObjective] = useState("");
  const [newMilestone, setNewMilestone] = useState<Partial<ProjectMilestone>>({ title: "", date: "", completed: false });
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState("");

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setCurrentProject({
        ...currentProject,
        objectives: [...(currentProject.objectives || []), newObjective]
      });
      setNewObjective("");
    }
  };

  const handleAddMilestone = () => {
    if (newMilestone.title && newMilestone.date) {
      setCurrentProject({
        ...currentProject,
        milestones: [...(currentProject.milestones || []), newMilestone as ProjectMilestone]
      });
      setNewMilestone({ title: "", date: "", completed: false });
    }
  };

  const handleAddTeamMember = () => {
    if (selectedTeamMemberId) {
      const user = MOCK_USERS.find(u => u.id === selectedTeamMemberId);
      if (user) {
        // Check if already added
        if (currentProject.team?.some(m => m.userId === user.id)) return;

        const newMember: ProjectTeamMember = {
          userId: user.id,
          name: user.name,
          role: "Membre" // Default role, could be editable
        };
        setCurrentProject({
          ...currentProject,
          team: [...(currentProject.team || []), newMember]
        });
        setSelectedTeamMemberId("");
      }
    }
  };

  const handleSaveProject = () => {
    if (!currentProject.title || !currentProject.goal) return;

    const projectToSave: Project = {
      id: currentProject.id || Math.random().toString(36).substr(2, 9),
      title: currentProject.title!,
      description: currentProject.description || "",
      image: currentProject.image || "/placeholder.jpg",
      category: currentProject.category || "General",
      goal: Number(currentProject.goal),
      raised: currentProject.raised || 0,
      donorsCount: currentProject.donorsCount || 0,
      endDate: currentProject.endDate || new Date().toISOString(),
      status: currentProject.status || "active",
      budget: Number(currentProject.budget),
      objectives: currentProject.objectives || [],
      team: currentProject.team || [],
      milestones: currentProject.milestones || []
    };

    if (currentProject.id) {
      setProjects(projects.map(p => p.id === projectToSave.id ? projectToSave : p));
    } else {
      setProjects([...projects, projectToSave]);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentProject({
      title: "",
      description: "",
      category: "Humanitaire",
      goal: 0,
      budget: 0,
      objectives: [],
      team: [],
      milestones: []
    });
  };

  const handleEdit = (project: Project) => {
    setCurrentProject({ ...project });
    setIsDialogOpen(true);
  };

  const getProgress = (project: Project) => {
    if (!project.milestones || project.milestones.length === 0) return 0;
    const completed = project.milestones.filter(m => m.completed).length;
    return Math.round((completed / project.milestones.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion des Projets</h1>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Nouveau Projet
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projet</TableHead>
              <TableHead>Budget / Objectif</TableHead>
              <TableHead>Équipe</TableHead>
              <TableHead>Progression</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="font-medium">{project.title}</div>
                  <div className="text-sm text-slate-500 truncate max-w-[200px]">{project.description}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{project.budget?.toLocaleString()} € (Budget)</div>
                  <div className="text-xs text-slate-500">Objectif Don: {project.goal.toLocaleString()} €</div>
                </TableCell>
                <TableCell>
                  <div className="flex -space-x-2 overflow-hidden">
                    {project.team?.map((member, i) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-800" title={member.name}>
                        {member.name.charAt(0)}
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
                  <div className="text-xs text-slate-500 mt-1">
                    {project.milestones?.filter(m => m.completed).length}/{project.milestones?.length} étapes
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={project.status === "active" ? "default" : "secondary"}>
                    {project.status === "active" ? "En cours" : project.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentProject.id ? "Modifier le Projet" : "Créer un Projet"}</DialogTitle>
            <DialogDescription>Définissez les objectifs, le budget et l'équipe.</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* General Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du projet</Label>
                <Input 
                  id="title" 
                  value={currentProject.title} 
                  onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={currentProject.category} 
                  onValueChange={(val) => setCurrentProject({...currentProject, category: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Humanitaire">Humanitaire</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Santé">Santé</SelectItem>
                    <SelectItem value="Éducation">Éducation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={currentProject.description} 
                  onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})} 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="budget">Budget Global (€)</Label>
                <Input 
                  id="budget" 
                  type="number" 
                  value={currentProject.budget} 
                  onChange={(e) => setCurrentProject({...currentProject, budget: Number(e.target.value)})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Objectif de Don (€)</Label>
                <Input 
                  id="goal" 
                  type="number" 
                  value={currentProject.goal} 
                  onChange={(e) => setCurrentProject({...currentProject, goal: Number(e.target.value)})} 
                />
              </div>
            </div>

            {/* Team Assignment */}
            <div className="space-y-2 border p-4 rounded-md bg-slate-50">
                <Label className="font-bold flex items-center gap-2"><Users className="h-4 w-4" /> Équipe & Intervenants</Label>
                <div className="flex gap-2">
                    <Select value={selectedTeamMemberId} onValueChange={setSelectedTeamMemberId}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Choisir un membre" />
                        </SelectTrigger>
                        <SelectContent>
                            {MOCK_USERS.map(user => (
                                <SelectItem key={user.id} value={user.id}>{user.name} ({user.role})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="button" variant="secondary" onClick={handleAddTeamMember}>Ajouter</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {currentProject.team?.map((member, idx) => (
                        <Badge key={idx} variant="outline" className="pl-2 pr-1 py-1 flex items-center gap-1 bg-white">
                            {member.name}
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 ml-1 hover:text-red-500"
                                onClick={() => {
                                    const newTeam = [...(currentProject.team || [])];
                                    newTeam.splice(idx, 1);
                                    setCurrentProject({...currentProject, team: newTeam});
                                }}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                    {(!currentProject.team || currentProject.team.length === 0) && <span className="text-sm text-slate-400 italic">Aucun membre assigné</span>}
                </div>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><Target className="h-4 w-4" /> Objectifs</Label>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Nouvel objectif..." 
                        value={newObjective}
                        onChange={(e) => setNewObjective(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddObjective()}
                    />
                    <Button type="button" variant="secondary" onClick={handleAddObjective}>Ajouter</Button>
                </div>
                <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                    {currentProject.objectives?.map((obj, idx) => (
                        <li key={idx} className="flex justify-between items-center group">
                            {obj}
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 opacity-0 group-hover:opacity-100 text-red-500"
                                onClick={() => {
                                    const newObjs = [...(currentProject.objectives || [])];
                                    newObjs.splice(idx, 1);
                                    setCurrentProject({...currentProject, objectives: newObjs});
                                }}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Milestones (Suivi) */}
            <div className="space-y-2 border p-4 rounded-md bg-slate-50">
                <Label className="font-bold flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> Étapes (Milestones)</Label>
                <div className="grid grid-cols-3 gap-2">
                    <Input 
                        placeholder="Titre de l'étape" 
                        value={newMilestone.title}
                        onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                        className="col-span-1"
                    />
                    <Input 
                        type="date"
                        value={newMilestone.date}
                        onChange={(e) => setNewMilestone({...newMilestone, date: e.target.value})}
                        className="col-span-1"
                    />
                    <Button type="button" variant="secondary" onClick={handleAddMilestone}>Ajouter Étape</Button>
                </div>
                
                <div className="space-y-2 mt-4">
                    {currentProject.milestones?.map((milestone, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border">
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={milestone.completed ? "text-green-500" : "text-slate-300"}
                                    onClick={() => {
                                        const newMilestones = [...(currentProject.milestones || [])];
                                        newMilestones[idx].completed = !newMilestones[idx].completed;
                                        setCurrentProject({...currentProject, milestones: newMilestones});
                                    }}
                                >
                                    {milestone.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                </Button>
                                <div>
                                    <div className={`font-medium ${milestone.completed ? "line-through text-slate-400" : ""}`}>{milestone.title}</div>
                                    <div className="text-xs text-slate-500">{format(new Date(milestone.date), "dd MMM yyyy", { locale: fr })}</div>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500 h-6 w-6"
                                onClick={() => {
                                    const newMilestones = [...(currentProject.milestones || [])];
                                    newMilestones.splice(idx, 1);
                                    setCurrentProject({...currentProject, milestones: newMilestones});
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveProject}>Enregistrer le Projet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
