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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, Check, X, CreditCard, Banknote, Download } from "lucide-react";

// Mock Data for Donations
interface Donation {
  id: string;
  donor: string;
  amount: number;
  currency: string;
  method: "card" | "transfer" | "mobile_money";
  date: string;
  status: "completed" | "pending" | "failed";
  proofUrl?: string; // For transfers
}

const MOCK_DONATIONS: Donation[] = [
  {
    id: "1",
    donor: "Jean Dupont",
    amount: 50.00,
    currency: "EUR",
    method: "card",
    date: "2024-03-15T14:30:00",
    status: "completed",
  },
  {
    id: "2",
    donor: "Marie Curie",
    amount: 10000.00,
    currency: "XAF",
    method: "mobile_money",
    date: "2024-03-14T10:15:00",
    status: "pending",
    proofUrl: "/proofs/donation-2.jpg",
  },
  {
    id: "3",
    donor: "Anonyme",
    amount: 25.00,
    currency: "EUR",
    method: "transfer",
    date: "2024-03-13T09:00:00",
    status: "failed",
  },
];

export default function FinancePage() {
  const [donations] = useState<Donation[]>(MOCK_DONATIONS);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Complet</Badge>;
      case "pending":
        return <Badge className="bg-orange-500 hover:bg-orange-600">En attente</Badge>;
      case "failed":
        return <Badge variant="destructive">Échoué</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "card": return <CreditCard className="h-4 w-4 text-blue-500" />;
      case "transfer": return <Banknote className="h-4 w-4 text-green-500" />;
      case "mobile_money": return <span className="font-bold text-xs text-orange-500">M</span>; // Placeholder for Mobile Money icon
      default: return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion Financière</h1>
        <div className="flex gap-2">
            <Button variant="outline">Exporter CSV</Button>
            <Button>Nouveau Don Manuel</Button>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Méthode</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Donateur</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Preuve</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>{getMethodIcon(donation.method)}</TableCell>
                <TableCell>{format(new Date(donation.date), "dd MMM yyyy HH:mm", { locale: fr })}</TableCell>
                <TableCell className="font-medium">{donation.donor}</TableCell>
                <TableCell className="font-bold text-green-600">{formatAmount(donation.amount, donation.currency)}</TableCell>
                <TableCell>
                  {donation.proofUrl ? (
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-blue-600">
                      <Download className="h-3 w-3" />
                      Voir
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Aucune</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(donation.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {donation.status === "pending" && (
                        <>
                            <Button variant="ghost" size="icon" title="Valider">
                                <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Rejeter">
                                <X className="h-4 w-4 text-red-500" />
                            </Button>
                        </>
                    )}
                    <Button variant="ghost" size="icon" title="Détails">
                      <Eye className="h-4 w-4 text-blue-500" />
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
