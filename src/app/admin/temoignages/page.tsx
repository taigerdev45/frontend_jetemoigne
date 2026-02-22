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
import { TestimonyWithReviewer, TestimonyStatus } from "@/types";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, X, Eye, FileText, Video, Mic, Loader2, BookOpen, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FilterValue = "all" | TestimonyStatus;

export default function TestimoniesPage() {
  const [testimonies, setTestimonies] = useState<TestimonyWithReviewer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>("all");

  // Schedule dialog state
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");

  useEffect(() => {
    fetchTestimonies();
  }, [filter]);

  const fetchTestimonies = async () => {
    setIsLoading(true);
    try {
      const statusParam = filter === "all" ? undefined : filter;
      const data = await api.admin.testimonies.findAll(statusParam);
      setTestimonies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch testimonies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      const updated = await api.admin.testimonies.markRead(id);
      setTestimonies(testimonies.map((t) =>
        t.id === id ? { ...t, status: updated.status } : t
      ));
    } catch (error) {
      console.error("Failed to mark as read:", error);
      alert("Erreur lors du marquage en lecture.");
    }
  };

  const handleValidate = async (id: string) => {
    try {
      const updated = await api.admin.testimonies.validate(id);
      setTestimonies(testimonies.map((t) =>
        t.id === id ? { ...t, status: updated.status } : t
      ));
    } catch (error) {
      console.error("Failed to validate:", error);
      alert("Erreur lors de la validation.");
    }
  };

  const handleSchedule = async () => {
    if (!scheduleId || !scheduleDate) return;
    try {
      const updated = await api.admin.testimonies.schedule(scheduleId, { scheduledFor: scheduleDate });
      setTestimonies(testimonies.map((t) =>
        t.id === scheduleId ? { ...t, status: updated.status, scheduledFor: updated.scheduledFor } : t
      ));
      setIsScheduleDialogOpen(false);
      setScheduleId(null);
      setScheduleDate("");
    } catch (error) {
      console.error("Failed to schedule:", error);
      alert("Erreur lors de la programmation.");
    }
  };

  const openScheduleDialog = (id: string) => {
    setScheduleId(id);
    setScheduleDate("");
    setIsScheduleDialogOpen(true);
  };

  const getStatusBadge = (status?: TestimonyStatus) => {
    switch (status) {
      case "recu":
        return <Badge variant="secondary">Recu</Badge>;
      case "en_lecture":
        return <Badge className="bg-blue-500 hover:bg-blue-600">En lecture</Badge>;
      case "valide":
        return <Badge className="bg-green-500 hover:bg-green-600">Valide</Badge>;
      case "rejete":
        return <Badge variant="destructive">Rejete</Badge>;
      case "programme":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Programme</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4 text-blue-500" />;
      case "audio": return <Mic className="h-4 w-4 text-purple-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const filterButtons: { label: string; value: FilterValue; colorClass?: string }[] = [
    { label: "Tout", value: "all" },
    { label: "Recus", value: "recu", colorClass: "bg-slate-500 hover:bg-slate-600" },
    { label: "En lecture", value: "en_lecture", colorClass: "bg-blue-500 hover:bg-blue-600" },
    { label: "Valides", value: "valide", colorClass: "bg-green-500 hover:bg-green-600" },
    { label: "Rejetes", value: "rejete", colorClass: "bg-red-500 hover:bg-red-600" },
    { label: "Programmes", value: "programme", colorClass: "bg-purple-500 hover:bg-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Moderation des Temoignages</h1>
        <div className="flex gap-2 flex-wrap">
          {filterButtons.map((btn) => (
            <Button
              key={btn.value}
              variant={filter === btn.value ? "default" : "outline"}
              onClick={() => setFilter(btn.value)}
              className={filter === btn.value && btn.colorClass ? btn.colorClass : ""}
              size="sm"
            >
              {btn.label}
            </Button>
          ))}
        </div>
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
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonies.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                     Aucun temoignage trouve.
                   </TableCell>
                 </TableRow>
              ) : (
                testimonies.map((testimony) => (
                  <TableRow key={testimony.id}>
                    <TableCell>{getTypeIcon(testimony.mediaType)}</TableCell>
                    <TableCell>
                      {testimony.createdAt ? format(new Date(testimony.createdAt), "dd MMM yyyy", { locale: fr }) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{testimony.authorName || "Anonyme"}</span>
                        <span className="text-xs text-muted-foreground">{testimony.authorEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{testimony.title || "-"}</TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-500">
                        {testimony.reviewer?.fullName || "-"}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(testimony.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {testimony.mediaUrl && (
                          <Button variant="ghost" size="icon" title="Voir le media" onClick={() => window.open(testimony.mediaUrl!, "_blank")}>
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>
                        )}
                        {testimony.status === "recu" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkRead(testimony.id)}
                            title="Marquer en lecture"
                          >
                            <BookOpen className="h-4 w-4 text-blue-500" />
                          </Button>
                        )}
                        {(testimony.status === "recu" || testimony.status === "en_lecture") && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleValidate(testimony.id)}
                              title="Valider"
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openScheduleDialog(testimony.id)}
                              title="Programmer"
                            >
                              <Calendar className="h-4 w-4 text-purple-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Programmer le temoignage</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Date</Label>
              <Input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSchedule} disabled={!scheduleDate}>
              Confirmer la programmation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
