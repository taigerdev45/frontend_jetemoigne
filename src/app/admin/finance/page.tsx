"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Check, X, CreditCard, Banknote, Filter, Loader2 } from "lucide-react";
import { Transaction, TransactionStatus } from "@/types";
import { api } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const statusParam = filterStatus === "all" ? undefined : (filterStatus as TransactionStatus);
      const data = await api.admin.finances.findAll(statusParam);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleValidate = async (id: string) => {
    try {
      const updated = await api.admin.finances.validate(id);
      setTransactions(transactions.map((t) =>
        t.id === id ? { ...t, status: updated.status } : t
      ));
    } catch (error) {
      console.error("Failed to validate transaction:", error);
      alert("Erreur lors de la validation.");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Etes-vous sur de vouloir rejeter cette transaction ?")) return;
    try {
      const updated = await api.admin.finances.reject(id);
      setTransactions(transactions.map((t) =>
        t.id === id ? { ...t, status: updated.status } : t
      ));
    } catch (error) {
      console.error("Failed to reject transaction:", error);
      alert("Erreur lors du rejet.");
    }
  };

  const getStatusBadge = (status?: TransactionStatus) => {
    switch (status) {
      case "verifie":
        return <Badge className="bg-green-500 hover:bg-green-600">Verifie</Badge>;
      case "en_attente":
        return <Badge className="bg-orange-500 hover:bg-orange-600">En attente</Badge>;
      case "rejete":
        return <Badge variant="destructive">Rejete</Badge>;
      default:
        return <Badge variant="secondary">{status || "Inconnu"}</Badge>;
    }
  };

  const getTypeIcon = (paymentMethod?: string | null) => {
    if (paymentMethod === "notchpay" || paymentMethod === "online") {
      return <span title="Paiement en ligne"><CreditCard className="h-4 w-4 text-purple-500" /></span>;
    }
    return <span title="Virement / Manuel"><Banknote className="h-4 w-4 text-green-500" /></span>;
  };

  const formatAmount = (amount: string | number, currency: string | null = "XAF") => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return String(amount);
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency || 'XAF' }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion Financiere (Dons)</h1>
        <div className="flex gap-2 items-center">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="verifie">Verifie</SelectItem>
                <SelectItem value="rejete">Rejete</SelectItem>
              </SelectContent>
            </Select>
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
                <TableHead>Mode</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Donateur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Preuve</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-slate-500">
                    Aucune transaction trouvee.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{getTypeIcon(transaction.paymentMethod)}</TableCell>
                    <TableCell>
                      {transaction.createdAt ? format(new Date(transaction.createdAt), "dd MMM yyyy HH:mm", { locale: fr }) : "-"}
                    </TableCell>
                    <TableCell className="font-medium">{transaction.donorName || "Anonyme"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span>{transaction.donorEmail}</span>
                        <span>{transaction.donorPhone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-700">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-500">{transaction.transactionType}</span>
                    </TableCell>
                    <TableCell>
                      {transaction.proofScreenshotUrl ? (
                        <Button variant="link" className="h-auto p-0 text-blue-600" asChild>
                          <a href={transaction.proofScreenshotUrl} target="_blank" rel="noopener noreferrer">
                            Voir la preuve
                          </a>
                        </Button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Aucune</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {transaction.status === "en_attente" && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              title="Valider"
                              onClick={() => handleValidate(transaction.id)}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              title="Rejeter"
                              onClick={() => handleReject(transaction.id)}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                        {transaction.transactionRefId && (
                          <span className="text-xs text-slate-400 ml-2" title="Ref. transaction">
                            Ref: {transaction.transactionRefId}
                          </span>
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
    </div>
  );
}
