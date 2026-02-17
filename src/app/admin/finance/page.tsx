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
import { Check, X, CreditCard, Banknote, Package, Filter, Eye } from "lucide-react";
import { FinanceTransaction } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Data
const MOCK_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: "1",
    date: "2024-03-15T14:30:00",
    type: "financier",
    category: "don",
    amount: 50.00,
    sender: "Jean Dupont",
    status: "verified",
  },
  {
    id: "2",
    date: "2024-03-14T10:15:00",
    type: "financier",
    category: "ouvrage",
    amount: 10000.00,
    sender: "Marie Curie",
    status: "pending",
    proofUrl: "/proofs/donation-2.jpg",
  },
  {
    id: "3",
    date: "2024-03-13T09:00:00",
    type: "materiel",
    category: "don",
    amount: 0, // Material donation
    sender: "Anonyme",
    status: "rejected",
  },
  {
    id: "4",
    date: "2024-03-12T16:45:00",
    type: "financier",
    category: "pub",
    amount: 150.00,
    sender: "Entreprise XYZ",
    status: "verified",
  },
];

export default function FinancePage() {
  const [transactions] = useState<FinanceTransaction[]>(MOCK_TRANSACTIONS);
  const [filterType, setFilterType] = useState<string>("all");

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "all") return true;
    return t.category === filterType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500 hover:bg-green-600">Vérifié</Badge>;
      case "pending":
        return <Badge className="bg-orange-500 hover:bg-orange-600">En attente</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "financier": return <Banknote className="h-4 w-4 text-green-500" />;
      case "materiel": return <Package className="h-4 w-4 text-blue-500" />;
      default: return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount); // Assuming EUR for simplicity, or convert based on context
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion Financière</h1>
        <div className="flex gap-2 items-center">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="ouvrage">Ouvrage</SelectItem>
                <SelectItem value="pub">Publicité</SelectItem>
                <SelectItem value="don">Don</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Exporter CSV</Button>
            <Button>Nouveau Don</Button>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Émetteur</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Montant / Détail</TableHead>
              <TableHead>Preuve</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{getTypeIcon(transaction.type)}</TableCell>
                <TableCell>{format(new Date(transaction.date), "dd MMM yyyy", { locale: fr })}</TableCell>
                <TableCell className="font-medium">{transaction.sender}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{transaction.category}</Badge>
                </TableCell>
                <TableCell>
                  {transaction.type === "financier" ? formatAmount(transaction.amount) : "Matériel"}
                </TableCell>
                <TableCell>
                  {transaction.proofUrl ? (
                    <Button variant="link" className="h-auto p-0 text-blue-600" asChild>
                      <a href={transaction.proofUrl} target="_blank" rel="noopener noreferrer">
                        Voir la preuve
                      </a>
                    </Button>
                  ) : (
                    <span className="text-slate-400 text-xs italic">Aucune</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {transaction.status === "pending" && (
                      <>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
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
