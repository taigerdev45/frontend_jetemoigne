"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Profile, Volunteer, Partner, UserRole } from "@/types";
import { Mail, Phone, Filter, Shield, Briefcase, MapPin, Loader2, Eye } from "lucide-react";
import { api } from "@/lib/api";

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Gestionnaire",
  accountant: "Comptable",
  observer: "Observateur",
};

export default function PersonnelPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(false);

  // Data State
  const [users, setUsers] = useState<Profile[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  // Filters State
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [volunteerSkillFilter, setVolunteerSkillFilter] = useState<string>("all");
  const [partnerDomainFilter, setPartnerDomainFilter] = useState<string>("all");
  const [partnerCountryFilter, setPartnerCountryFilter] = useState<string>("all");

  // Role change dialog state
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("observer");

  // Volunteer detail dialog state
  const [isVolunteerDialogOpen, setIsVolunteerDialogOpen] = useState(false);
  const [viewingVolunteer, setViewingVolunteer] = useState<Volunteer | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.team.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVolunteers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.team.getVolunteers();
      setVolunteers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch volunteers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPartners = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.team.getPartners();
      setPartners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch partners:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    else if (activeTab === "volunteers") fetchVolunteers();
    else if (activeTab === "partners") fetchPartners();
  }, [activeTab, fetchUsers, fetchVolunteers, fetchPartners]);

  // --- HANDLERS: ROLE CHANGE ---
  const openRoleDialog = (user: Profile) => {
    setEditingUserId(user.id);
    setSelectedRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = async () => {
    if (!editingUserId) return;
    setIsLoading(true);
    try {
      const updated = await api.admin.team.updateRole(editingUserId, selectedRole);
      setUsers(users.map((u) => (u.id === editingUserId ? { ...u, role: updated.role } : u)));
      setIsRoleDialogOpen(false);
      setEditingUserId(null);
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Erreur lors de la mise a jour du role.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLERS: VOLUNTEER ---
  const handleViewVolunteer = (vol: Volunteer) => {
    setViewingVolunteer(vol);
    setIsVolunteerDialogOpen(true);
  };

  // Derived Data (Filtering)
  const filteredUsers = users.filter(u => userRoleFilter === "all" || u.role === userRoleFilter);

  const filteredVolunteers = volunteers.filter(v =>
    volunteerSkillFilter === "all" || (v.skills && v.skills.includes(volunteerSkillFilter))
  );

  const filteredPartners = partners.filter(p =>
    (partnerDomainFilter === "all" || p.activityDomain === partnerDomainFilter) &&
    (partnerCountryFilter === "all" || p.country === partnerCountryFilter)
  );

  // Extract unique values for filters
  const allSkills = Array.from(new Set(volunteers.flatMap(v => v.skills || [])));
  const allDomains = Array.from(new Set(partners.map(p => p.activityDomain || ""))).filter(Boolean);
  const allCountries = Array.from(new Set(partners.map(p => p.country || ""))).filter(Boolean);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion du Personnel (RH)</h1>
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
          <TabsTrigger value="users">Utilisateurs (Staff)</TabsTrigger>
          <TabsTrigger value="volunteers">Benevoles</TabsTrigger>
          <TabsTrigger value="partners">Partenaires</TabsTrigger>
        </TabsList>

        {/* --- USERS TAB --- */}
        <TabsContent value="users" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filtrer par role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les roles</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Gestionnaire</SelectItem>
                        <SelectItem value="accountant">Comptable</SelectItem>
                        <SelectItem value="observer">Observateur</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div className="rounded-md border bg-white shadow-sm">
            {isLoading && activeTab === "users" ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-slate-500">
                        Aucun utilisateur trouve.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold overflow-hidden">
                                {user.avatarUrl ? (
                                  <Image src={user.avatarUrl} alt={user.fullName || ""} width={32} height={32} className="h-full w-full object-cover" unoptimized />
                                ) : (
                                  (user.fullName || "?").charAt(0).toUpperCase()
                                )}
                            </div>
                            {user.fullName || "Sans nom"}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className="flex w-fit items-center gap-1">
                                <Shield className="h-3 w-3" /> {ROLE_LABELS[user.role] || user.role}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => openRoleDialog(user)}>
                                Changer le role
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

        {/* --- VOLUNTEERS TAB --- */}
        <TabsContent value="volunteers" className="space-y-4 mt-6">
           <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <Select value={volunteerSkillFilter} onValueChange={setVolunteerSkillFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Competence" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes competences</SelectItem>
                        {allSkills.map(skill => (
                            <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div className="rounded-md border bg-white shadow-sm">
            {isLoading && activeTab === "volunteers" ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Benevole</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Competences</TableHead>
                    <TableHead>Disponibilite</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVolunteers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                        Aucun benevole trouve.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVolunteers.map((vol) => (
                      <TableRow key={vol.id}>
                        <TableCell className="font-medium">{vol.fullName}</TableCell>
                        <TableCell>
                            <div className="flex flex-col text-sm">
                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {vol.email || "-"}</span>
                                {vol.phone && <span className="flex items-center gap-1 text-slate-500"><Phone className="h-3 w-3" /> {vol.phone}</span>}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-1 flex-wrap">
                                {(vol.skills || []).map(skill => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                                {(!vol.skills || vol.skills.length === 0) && <span className="text-xs text-slate-400">-</span>}
                            </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-500">{vol.availability || "-"}</span>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleViewVolunteer(vol)}>
                                <Eye className="h-4 w-4 text-blue-500" />
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

        {/* --- PARTNERS TAB --- */}
        <TabsContent value="partners" className="space-y-4 mt-6">
           <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <Select value={partnerDomainFilter} onValueChange={setPartnerDomainFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Domaine" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous domaines</SelectItem>
                        {allDomains.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={partnerCountryFilter} onValueChange={setPartnerCountryFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pays" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous pays</SelectItem>
                        {allCountries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div className="rounded-md border bg-white shadow-sm">
            {isLoading && activeTab === "partners" ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partenaire</TableHead>
                    <TableHead>Domaine</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Site Web</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-slate-500">
                        Aucun partenaire trouve.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPartners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          {partner.logoUrl && (
                            <Image src={partner.logoUrl} alt={partner.name} width={32} height={32} className="h-8 w-8 rounded object-contain" unoptimized />
                          )}
                          {partner.name}
                        </TableCell>
                        <TableCell><Badge variant="outline"><Briefcase className="h-3 w-3 mr-1" />{partner.activityDomain || "-"}</Badge></TableCell>
                        <TableCell><span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {partner.country || "-"}</span></TableCell>
                        <TableCell>
                          {partner.websiteUrl ? (
                            <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                              {partner.websiteUrl}
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* --- ROLE CHANGE DIALOG --- */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer le role de l&apos;utilisateur</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(val) => setSelectedRole(val as UserRole)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Choisir un role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Gestionnaire</SelectItem>
                  <SelectItem value="accountant">Comptable</SelectItem>
                  <SelectItem value="observer">Observateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveRole} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- VOLUNTEER DETAIL DIALOG --- */}
      <Dialog open={isVolunteerDialogOpen} onOpenChange={setIsVolunteerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Details du Benevole</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Nom</Label>
              <Input value={viewingVolunteer?.fullName || ""} disabled className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Email</Label>
              <Input value={viewingVolunteer?.email || ""} disabled className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Telephone</Label>
              <Input value={viewingVolunteer?.phone || ""} disabled className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Competences</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                 {viewingVolunteer?.skills?.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                 {(!viewingVolunteer?.skills || viewingVolunteer.skills.length === 0) && <span className="text-sm text-slate-400">Aucune</span>}
              </div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Disponibilite</Label>
              <Input value={viewingVolunteer?.availability || "-"} disabled className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Statut</Label>
              <Input value={viewingVolunteer?.status || "-"} disabled className="col-span-3" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
