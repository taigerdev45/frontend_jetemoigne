"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { AppSettings } from "@/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [airtelNumber, setAirtelNumber] = useState("");
  const [moovNumber, setMoovNumber] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [donationRules, setDonationRules] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await api.admin.hub.getSettings();
        if (data) {
          setSettings(data);
          setAirtelNumber(data.airtelNumber || "");
          setMoovNumber(data.moovNumber || "");
          setContactEmail(data.contactEmail || "");
          setDonationRules(data.donationRules || "");
          setMaintenanceMode(data.maintenanceMode || false);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await api.admin.hub.updateSettings({
        airtelNumber: airtelNumber || null,
        moovNumber: moovNumber || null,
        contactEmail: contactEmail || null,
        donationRules: donationRules || null,
        maintenanceMode,
      });
      setSettings(updated);
      alert("Parametres sauvegardes avec succes.");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Erreur lors de la sauvegarde des parametres.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Parametres</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sauvegarder
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Contact & General */}
        <div className="rounded-md border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">General</h3>
            <div className="grid gap-4 max-w-xl">
                <div className="grid gap-2">
                    <Label htmlFor="contactEmail">Email de Contact</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="contact@jetemoigne.tv"
                    />
                </div>
            </div>
        </div>

        {/* Mobile Money Numbers */}
        <div className="rounded-md border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Numeros Mobile Money</h3>
            <div className="grid gap-4 max-w-xl">
                <div className="grid gap-2">
                    <Label htmlFor="airtelNumber">Numero Airtel Money</Label>
                    <Input
                      id="airtelNumber"
                      value={airtelNumber}
                      onChange={(e) => setAirtelNumber(e.target.value)}
                      placeholder="+242 XX XXX XXXX"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="moovNumber">Numero Moov Money</Label>
                    <Input
                      id="moovNumber"
                      value={moovNumber}
                      onChange={(e) => setMoovNumber(e.target.value)}
                      placeholder="+242 XX XXX XXXX"
                    />
                </div>
            </div>
        </div>

        {/* Donation Rules */}
        <div className="rounded-md border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Regles de Don</h3>
            <div className="grid gap-4 max-w-xl">
                <div className="grid gap-2">
                    <Label htmlFor="donationRules">Instructions pour les donateurs</Label>
                    <Textarea
                      id="donationRules"
                      value={donationRules}
                      onChange={(e) => setDonationRules(e.target.value)}
                      placeholder="Instructions affichees aux donateurs..."
                      rows={5}
                    />
                </div>
            </div>
        </div>

        {/* Maintenance Mode */}
        <div className="rounded-md border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Maintenance</h3>
            <div className="grid gap-4 max-w-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium">Mode Maintenance</div>
                        <div className="text-sm text-slate-500">
                          Activer le mode maintenance desactive le site public.
                        </div>
                    </div>
                    <Button
                      variant={maintenanceMode ? "destructive" : "outline"}
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                    >
                      {maintenanceMode ? "Desactiver" : "Activer"}
                    </Button>
                </div>
                {maintenanceMode && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                    Le mode maintenance est actif. Le site public est indisponible.
                  </div>
                )}
            </div>
        </div>

        {settings?.updatedAt && (
          <div className="text-sm text-slate-400 text-right">
            Derniere mise a jour : {new Date(settings.updatedAt).toLocaleString("fr-FR")}
          </div>
        )}
      </div>
    </div>
  );
}
