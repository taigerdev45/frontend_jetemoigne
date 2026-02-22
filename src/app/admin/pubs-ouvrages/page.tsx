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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Plus, Trash2, Eye, Image as ImageIcon, Book, LinkIcon, Loader2 } from "lucide-react";
import { Ad, Book as BookType } from "@/types";
import { api } from "@/lib/api";

export default function PubsOuvragesPage() {
  const [activeTab, setActiveTab] = useState("pubs");
  const [isLoading, setIsLoading] = useState(false);

  // State for Ads
  const [ads, setAds] = useState<Ad[]>([]);
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  const [newAdClientName, setNewAdClientName] = useState("");
  const [newAdRedirectUrl, setNewAdRedirectUrl] = useState("");
  const [newAdStartDate, setNewAdStartDate] = useState("");
  const [newAdEndDate, setNewAdEndDate] = useState("");
  const [adFile, setAdFile] = useState<File | null>(null);

  // State for Books
  const [books, setBooks] = useState<BookType[]>([]);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookPrice, setNewBookPrice] = useState("0");
  const [newBookDescription, setNewBookDescription] = useState("");
  const [bookCoverFile, setBookCoverFile] = useState<File | null>(null);
  const [bookPdfFile, setBookPdfFile] = useState<File | null>(null);

  const fetchAds = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.ads.findActive();
      setAds(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.content.getBooks();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "pubs") {
      fetchAds();
    } else {
      fetchBooks();
    }
  }, [activeTab, fetchAds, fetchBooks]);

  const handleSaveAd = async () => {
    if (!newAdClientName) {
      alert("Le nom du client est requis");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("clientName", newAdClientName);
      if (newAdRedirectUrl) formData.append("redirectUrl", newAdRedirectUrl);
      if (newAdStartDate) formData.append("startDate", newAdStartDate);
      if (newAdEndDate) formData.append("endDate", newAdEndDate);

      if (adFile) {
        formData.append("media", adFile);
      }

      await api.admin.content.createAd(formData);

      await fetchAds();
      setIsAdDialogOpen(false);
      resetAdForm();
    } catch (error) {
      console.error("Failed to save ad:", error);
      alert("Erreur lors de l'enregistrement de la campagne");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAdForm = () => {
    setNewAdClientName("");
    setNewAdRedirectUrl("");
    setNewAdStartDate("");
    setNewAdEndDate("");
    setAdFile(null);
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm("Etes-vous sur de vouloir supprimer cette campagne ?")) return;
    try {
      await api.admin.content.deleteAd(id);
      setAds(ads.filter(a => a.id !== id));
    } catch (error) {
      console.error("Failed to delete ad:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleSaveBook = async () => {
    if (!newBookTitle || !newBookAuthor) {
      alert("Titre et auteur sont requis");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", newBookTitle);
      formData.append("author", newBookAuthor);
      formData.append("price", newBookPrice);
      if (newBookDescription) formData.append("description", newBookDescription);

      if (bookCoverFile) {
        formData.append("cover", bookCoverFile);
      }
      if (bookPdfFile) {
        formData.append("pdf", bookPdfFile);
      }

      await api.admin.content.createBook(formData);

      await fetchBooks();
      setIsBookDialogOpen(false);
      resetBookForm();
    } catch (error) {
      console.error("Failed to save book:", error);
      alert("Erreur lors de l'enregistrement du livre");
    } finally {
      setIsLoading(false);
    }
  };

  const resetBookForm = () => {
    setNewBookTitle("");
    setNewBookAuthor("");
    setNewBookPrice("0");
    setNewBookDescription("");
    setBookCoverFile(null);
    setBookPdfFile(null);
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Etes-vous sur de vouloir supprimer ce livre ?")) return;
    try {
      await api.admin.content.deleteBook(id);
      setBooks(books.filter(b => b.id !== id));
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const formatPrice = (price: string | null, isFree: boolean) => {
    if (isFree) return "Gratuit";
    if (!price || parseFloat(price) === 0) return "Gratuit";
    return `${parseFloat(price).toLocaleString("fr-FR")} XAF`;
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion Pubs & Ouvrages</h1>
      </div>

      <Tabs defaultValue="pubs" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="pubs">Publicites</TabsTrigger>
          <TabsTrigger value="books">Ouvrages (Livres)</TabsTrigger>
        </TabsList>

        {/* --- ADS TAB --- */}
        <TabsContent value="pubs" className="space-y-4 mt-6">
           <div className="flex justify-end">
            <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
                <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" /> Nouvelle Campagne</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Creer une campagne publicitaire</DialogTitle>
                        <DialogDescription>Configurez la banniere, le lien et la duree.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Client</Label>
                            <Input className="col-span-3" value={newAdClientName} onChange={e => setNewAdClientName(e.target.value)} placeholder="Nom du client" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Redirection</Label>
                            <Input className="col-span-3" placeholder="https://..." value={newAdRedirectUrl} onChange={e => setNewAdRedirectUrl(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Debut</Label>
                            <Input type="date" className="col-span-3" value={newAdStartDate} onChange={e => setNewAdStartDate(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Fin</Label>
                            <Input type="date" className="col-span-3" value={newAdEndDate} onChange={e => setNewAdEndDate(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Media</Label>
                            <div className="col-span-3">
                                <Input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) => setAdFile(e.target.files?.[0] || null)}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveAd} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Lancer la campagne
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
           </div>

           <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Periode</TableHead>
                        <TableHead>Stats</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ads.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-slate-500">
                                {isLoading ? "Chargement..." : "Aucune campagne trouvee"}
                            </TableCell>
                        </TableRow>
                    ) : (
                        ads.map(ad => (
                        <TableRow key={ad.id}>
                            <TableCell className="font-medium">{ad.clientName}</TableCell>
                            <TableCell>{ad.mediaType === "image" ? <ImageIcon className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</TableCell>
                            <TableCell className="text-sm">
                                {ad.startDate ? format(new Date(ad.startDate), "dd/MM") : "-"} - {ad.endDate ? format(new Date(ad.endDate), "dd/MM/yyyy") : "-"}
                            </TableCell>
                            <TableCell className="text-sm text-slate-500">
                                {ad.viewsCount || 0} vues / {ad.clicksCount || 0} clics
                            </TableCell>
                            <TableCell>
                                <Badge variant={ad.isActive ? "default" : "secondary"}>
                                  {ad.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteAd(ad.id)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>
           </div>
        </TabsContent>

        {/* --- BOOKS TAB --- */}
        <TabsContent value="books" className="space-y-4 mt-6">
           <div className="flex justify-end">
            <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
                <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" /> Ajouter un Ouvrage</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter un Livre</DialogTitle>
                        <DialogDescription>Uploadez le PDF et definissez le prix.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Titre</Label>
                            <Input className="col-span-3" value={newBookTitle} onChange={e => setNewBookTitle(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Auteur</Label>
                            <Input className="col-span-3" value={newBookAuthor} onChange={e => setNewBookAuthor(e.target.value)} />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Prix (XAF)</Label>
                            <Input
                                type="number"
                                className="col-span-3"
                                placeholder="0 pour Gratuit"
                                value={newBookPrice}
                                onChange={e => setNewBookPrice(e.target.value)}
                            />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Fichiers</Label>
                            <div className="col-span-3 space-y-2">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="cover">Couverture</Label>
                                    <Input id="cover" type="file" accept="image/*" onChange={(e) => setBookCoverFile(e.target.files?.[0] || null)} />
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="pdf">PDF du livre</Label>
                                    <Input id="pdf" type="file" accept=".pdf" onChange={(e) => setBookPdfFile(e.target.files?.[0] || null)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveBook} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Publier
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
           </div>

           <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Auteur</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Telechargements</TableHead>
                        <TableHead>Fichier</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {books.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-slate-500">
                                {isLoading ? "Chargement..." : "Aucun livre trouve"}
                            </TableCell>
                        </TableRow>
                    ) : (
                        books.map(book => (
                        <TableRow key={book.id}>
                            <TableCell className="font-medium flex items-center gap-3">
                                <div className="h-10 w-8 bg-slate-200 rounded overflow-hidden relative">
                                    {book.coverUrl ? (
                                        <Image src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" fill sizes="32px" />
                                    ) : (
                                        <div className="w-full h-full bg-blue-900/20 flex items-center justify-center">
                                            <Book className="h-4 w-4 text-blue-900" />
                                        </div>
                                    )}
                                </div>
                                {book.title}
                            </TableCell>
                            <TableCell>{book.author || "-"}</TableCell>
                            <TableCell>
                                {book.isFree || !book.price || parseFloat(book.price) === 0 ? (
                                  <Badge className="bg-green-500">Gratuit</Badge>
                                ) : (
                                  formatPrice(book.price, book.isFree)
                                )}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-slate-500">{book.downloadsCount || 0}</span>
                            </TableCell>
                            <TableCell>
                                <Button variant="link" className="h-auto p-0 text-blue-600" asChild>
                                    <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer">
                                        <LinkIcon className="mr-1 h-3 w-3" /> PDF
                                    </a>
                                </Button>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteBook(book.id)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>
           </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
