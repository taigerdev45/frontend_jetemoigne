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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { User, Volunteer, Partner, UserRole } from "@/types";
import { Mail, Phone, MapPin, Briefcase, Shield, Filter } from "lucide-react";

// Mock Data
const MOCK_USERS: User[] = [
  { id: "1", name: "Alice Admin", email: "alice@jetemoigne.tv", role: "Super Admin", status: "active", lastLogin: "2024-03-15T10:00:00" },
  { id: "2", name: "Bob Manager", email: "bob@jetemoigne.tv", role: "Gestionnaire", status: "active", lastLogin: "2024-03-14T14:30:00" },
  { id: "3", name: "Charlie Finance", email: "charlie@jetemoigne.tv", role: "Comptable", status: "inactive", lastLogin: "2024-02-28T09:00:00" },
];

const MOCK_VOLUNTEERS: Volunteer[] = [
  { id: "1", name: "David Dev", email: "david@gmail.com", phone: "+33 6 12 34 56 78", skills: ["Développement Web", "Design"], status: "active", dateJoined: "2023-01-10" },
  { id: "2", name: "Eve Event", email: "eve@yahoo.fr", phone: "+33 6 98 76 54 32", skills: ["Événementiel", "Logistique"], status: "pending", dateJoined: "2024-03-01" },
  { id: "3", name: "Frank Foto", email: "frank@studio.com", skills: ["Photographie", "Vidéo"], status: "active", dateJoined: "2023-05-20" },
];

const MOCK_PARTNERS: Partner[] = [
  { id: "1", name: "Tech Solutions", activityDomain: "Informatique", country: "France", contactEmail: "contact@tech.com", status: "active" },
  { id: "2", name: "Global Charity", activityDomain: "Humanitaire", country: "USA", contactEmail: "info@gcharity.org", status: "active" },
  { id: "3", name: "Print Express", activityDomain: "Imprimerie", country: "Belgique", contactEmail: "order@print.be", status: "pending" },
];

export default function PersonnelPage() {
  const [activeTab, setActiveTab] = useState("users");
  
  // Filters State
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [volunteerSkillFilter, setVolunteerSkillFilter] = useState<string>("all");
  const [partnerDomainFilter, setPartnerDomainFilter] = useState<string>("all");
  const [partnerCountryFilter, setPartnerCountryFilter] = useState<string>("all");

  // Derived Data (Filtering)
  const filteredUsers = MOCK_USERS.filter(u => userRoleFilter === "all" || u.role === userRoleFilter);
  
  const filteredVolunteers = MOCK_VOLUNTEERS.filter(v => 
    volunteerSkillFilter === "all" || v.skills.includes(volunteerSkillFilter)
  );

  const filteredPartners = MOCK_PARTNERS.filter(p => 
    (partnerDomainFilter === "all" || p.activityDomain === partnerDomainFilter) &&
    (partnerCountryFilter === "all" || p.country === partnerCountryFilter)
  );

  // Extract unique values for filters
  const allSkills = Array.from(new Set(MOCK_VOLUNTEERS.flatMap(v => v.skills)));
  const allDomains = Array.from(new Set(MOCK_PARTNERS.map(p => p.activityDomain)));
  const allCountries = Array.from(new Set(MOCK_PARTNERS.map(p => p.country)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion du Personnel (RH)</h1>
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
          <TabsTrigger value="users">Utilisateurs (Staff)</TabsTrigger>
          <TabsTrigger value="volunteers">Bénévoles</TabsTrigger>
          <TabsTrigger value="partners">Partenaires</TabsTrigger>
        </TabsList>

        {/* --- USERS TAB --- */}
        <TabsContent value="users" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filtrer par rôle" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les rôles</SelectItem>
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Gestionnaire">Gestionnaire</SelectItem>
                        <SelectItem value="Comptable">Comptable</SelectItem>
                        <SelectItem value="Observateur">Observateur</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button>Ajouter un Utilisateur</Button>
          </div>

          <div className="rounded-md border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                        </div>
                        {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className="flex w-fit items-center gap-1">
                            <Shield className="h-3 w-3" /> {user.role}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Badge className={user.status === "active" ? "bg-green-500" : "bg-slate-400"}>
                            {user.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Modifier</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* --- VOLUNTEERS TAB --- */}
        <TabsContent value="volunteers" className="space-y-4 mt-6">
           <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <Select value={volunteerSkillFilter} onValueChange={setVolunteerSkillFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Compétence" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes compétences</SelectItem>
                        {allSkills.map(skill => (
                            <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div className="rounded-md border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bénévole</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Compétences</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.map((vol) => (
                  <TableRow key={vol.id}>
                    <TableCell className="font-medium">{vol.name}</TableCell>
                    <TableCell>
                        <div className="flex flex-col text-sm">
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {vol.email}</span>
                            {vol.phone && <span className="flex items-center gap-1 text-slate-500"><Phone className="h-3 w-3" /> {vol.phone}</span>}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-1 flex-wrap">
                            {vol.skills.map(skill => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </TableCell>
                    <TableCell>
                         <Badge variant={vol.status === "active" ? "default" : "outline"}>
                            {vol.status === "active" ? "Actif" : "En attente"}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Détails</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
             <Button>Ajouter un Partenaire</Button>
          </div>

          <div className="rounded-md border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partenaire</TableHead>
                  <TableHead>Domaine</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell><Badge variant="outline"><Briefcase className="h-3 w-3 mr-1" />{partner.activityDomain}</Badge></TableCell>
                    <TableCell><span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {partner.country}</span></TableCell>
                    <TableCell>{partner.contactEmail}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Gérer</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
