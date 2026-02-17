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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { Plus, Trash2, Upload, Eye, Image as ImageIcon, Book, LinkIcon, Edit } from "lucide-react";
import { Advertisement, Book as BookType } from "@/types";

// Mock Data
const MOCK_ADS: Advertisement[] = [
  { id: "1", title: "Campagne Hiver", type: "image", mediaUrl: "/ads/winter.jpg", redirectUrl: "https://partner.com", startDate: "2024-11-01", endDate: "2024-12-31", status: "ended", views: 1500, clicks: 120 },
  { id: "2", title: "Promo Conférence", type: "video", mediaUrl: "/ads/conf.mp4", redirectUrl: "https://conf.org", startDate: "2024-03-01", endDate: "2024-04-01", status: "active", views: 500, clicks: 45 },
];

const MOCK_BOOKS: BookType[] = [
  { id: "1", title: "La Foi Triomphante", author: "Pasteur Jean", price: 0, coverUrl: "/books/foi.jpg", pdfUrl: "/books/foi.pdf", publishedDate: "2023-05-15", status: "published" },
  { id: "2", title: "Principes de Vie", author: "Dr. Martin", price: 15.99, coverUrl: "/books/principles.jpg", pdfUrl: "/books/principles.pdf", publishedDate: "2024-01-20", status: "published" },
];

export default function PubsOuvragesPage() {
  const [activeTab, setActiveTab] = useState("pubs");
  
  // State for Ads
  const [ads, setAds] = useState<Advertisement[]>(MOCK_ADS);
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  const [newAd, setNewAd] = useState<Partial<Advertisement>>({ type: "image", status: "scheduled" });

  // State for Books
  const [books, setBooks] = useState<BookType[]>(MOCK_BOOKS);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [newBook, setNewBook] = useState<Partial<BookType>>({ price: 0, status: "draft" });

  const handleSaveAd = () => {
    if (!newAd.title || !newAd.startDate || !newAd.endDate) return;
    const ad: Advertisement = {
        id: Math.random().toString(36).substr(2, 9),
        title: newAd.title,
        type: newAd.type || "image",
        mediaUrl: newAd.mediaUrl || "https://placehold.co/600x400",
        redirectUrl: newAd.redirectUrl || "#",
        startDate: newAd.startDate,
        endDate: newAd.endDate,
        status: "active",
        views: 0,
        clicks: 0
    };
    setAds([...ads, ad]);
    setIsAdDialogOpen(false);
    setNewAd({ type: "image", status: "scheduled" });
  };

  const handleSaveBook = () => {
    if (!newBook.title || !newBook.author) return;
    const book: BookType = {
        id: Math.random().toString(36).substr(2, 9),
        title: newBook.title,
        author: newBook.author,
        price: Number(newBook.price) || 0,
        coverUrl: newBook.coverUrl || "https://placehold.co/200x300",
        pdfUrl: newBook.pdfUrl || "#",
        publishedDate: new Date().toISOString(),
        status: "published"
    };
    setBooks([...books, book]);
    setIsBookDialogOpen(false);
    setNewBook({ price: 0, status: "draft" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Gestion Pubs & Ouvrages</h1>
      </div>

      <Tabs defaultValue="pubs" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="pubs">Publicités</TabsTrigger>
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
                        <DialogTitle>Créer une campagne publicitaire</DialogTitle>
                        <DialogDescription>Configurez la bannière, le lien et la durée.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Titre</Label>
                            <Input className="col-span-3" value={newAd.title || ""} onChange={e => setNewAd({...newAd, title: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Type</Label>
                            <Select value={newAd.type} onValueChange={(val: "image"|"video") => setNewAd({...newAd, type: val})}>
                                <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="video">Vidéo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Redirection</Label>
                            <Input className="col-span-3" placeholder="https://..." value={newAd.redirectUrl || ""} onChange={e => setNewAd({...newAd, redirectUrl: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Début</Label>
                            <Input type="date" className="col-span-3" value={newAd.startDate || ""} onChange={e => setNewAd({...newAd, startDate: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Fin</Label>
                            <Input type="date" className="col-span-3" value={newAd.endDate || ""} onChange={e => setNewAd({...newAd, endDate: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Média</Label>
                            <div className="col-span-3 flex items-center gap-2">
                                <Button variant="secondary" size="sm" className="w-full"><Upload className="mr-2 h-4 w-4" /> Uploader {newAd.type}</Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveAd}>Lancer la campagne</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
           </div>

           <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Campagne</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Période</TableHead>
                        <TableHead>Stats</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ads.map(ad => (
                        <TableRow key={ad.id}>
                            <TableCell className="font-medium">{ad.title}</TableCell>
                            <TableCell>{ad.type === "image" ? <ImageIcon className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</TableCell>
                            <TableCell className="text-sm">
                                {format(new Date(ad.startDate), "dd/MM")} - {format(new Date(ad.endDate), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="text-sm text-slate-500">
                                {ad.views} vues / {ad.clicks} clics
                            </TableCell>
                            <TableCell>
                                <Badge variant={ad.status === "active" ? "default" : "secondary"}>{ad.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
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
                        <DialogDescription>Uploadez le PDF et définissez le prix.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Titre</Label>
                            <Input className="col-span-3" value={newBook.title || ""} onChange={e => setNewBook({...newBook, title: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Auteur</Label>
                            <Input className="col-span-3" value={newBook.author || ""} onChange={e => setNewBook({...newBook, author: e.target.value})} />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Prix (€)</Label>
                            <Input 
                                type="number" 
                                className="col-span-3" 
                                placeholder="0 pour Gratuit"
                                value={newBook.price} 
                                onChange={e => setNewBook({...newBook, price: Number(e.target.value)})} 
                            />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Fichiers</Label>
                            <div className="col-span-3 space-y-2">
                                <Button variant="outline" size="sm" className="w-full justify-start"><Upload className="mr-2 h-4 w-4" /> Couverture (JPG/PNG)</Button>
                                <Button variant="outline" size="sm" className="w-full justify-start"><Upload className="mr-2 h-4 w-4" /> Livre (PDF)</Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveBook}>Publier</Button>
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
                        <TableHead>Fichier</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {books.map(book => (
                        <TableRow key={book.id}>
                            <TableCell className="font-medium flex items-center gap-3">
                                <div className="h-10 w-8 bg-slate-200 rounded overflow-hidden">
                                    {/* Mock cover */}
                                    <div className="w-full h-full bg-blue-900/20 flex items-center justify-center">
                                        <Book className="h-4 w-4 text-blue-900" />
                                    </div>
                                </div>
                                {book.title}
                            </TableCell>
                            <TableCell>{book.author}</TableCell>
                            <TableCell>
                                {book.price === 0 ? <Badge className="bg-green-500">Gratuit</Badge> : `${book.price} €`}
                            </TableCell>
                            <TableCell>
                                <Button variant="link" className="h-auto p-0 text-blue-600">
                                    <LinkIcon className="mr-1 h-3 w-3" /> PDF
                                </Button>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
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
