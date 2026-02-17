"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VolunteerForm } from "./VolunteerForm";
import { PartnershipForm } from "./PartnershipForm";
import { DonationForm } from "./DonationForm";
import { Heart, Handshake, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ActionCenter() {
  const [activeTab, setActiveTab] = useState<"donate" | "volunteer" | "partner">("donate");

  const tabs = [
    { id: "donate", label: "Faire un Don", icon: Heart },
    { id: "volunteer", label: "Bénévolat", icon: Handshake },
    { id: "partner", label: "Partenariat", icon: Briefcase },
  ] as const;

  return (
    <section className="py-12 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Centre d&apos;Action</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Choisissez comment vous souhaitez contribuer à l&apos;œuvre. Chaque geste compte.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all text-sm sm:text-base",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "donate" && <DonationForm />}
                {activeTab === "volunteer" && <VolunteerForm />}
                {activeTab === "partner" && <PartnershipForm />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
