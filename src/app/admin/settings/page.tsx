"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-deep">Paramètres</h1>
      </div>

      <div className="grid gap-6">
        <div className="rounded-md border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Général</h3>
            <div className="grid gap-4 max-w-xl">
                <div className="grid gap-2">
                    <Label htmlFor="siteName">Nom du Site</Label>
                    <Input id="siteName" defaultValue="JeTémoigne TV" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email de Contact</Label>
                    <Input id="email" defaultValue="contact@jetemoigne.tv" />
                </div>
            </div>
        </div>

        <div className="rounded-md border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Sécurité</h3>
            <div className="grid gap-4 max-w-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium">Double Authentification (2FA)</div>
                        <div className="text-sm text-slate-500">Sécuriser l&apos;accès administrateur.</div>
                    </div>
                    <Button variant="outline">Configurer</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium">Mot de passe</div>
                        <div className="text-sm text-slate-500">Dernière modification il y a 3 mois.</div>
                    </div>
                    <Button variant="outline">Changer</Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
