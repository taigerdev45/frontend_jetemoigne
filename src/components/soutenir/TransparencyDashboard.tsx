"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Users, Handshake, TrendingUp } from "lucide-react";

const Counter = ({ end, label, icon: Icon, suffix = "" }: { end: number; label: string; icon: React.ElementType; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 flex items-center space-x-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-900 dark:text-white">
          {count}{suffix}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {label}
        </div>
      </div>
    </div>
  );
};

export function TransparencyDashboard() {
  const [progress, setProgress] = useState(0);
  const targetAmount = 50000;
  const currentAmount = 32500;
  const percentage = (currentAmount / targetAmount) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Notre Impact en Chiffres</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            La transparence est au cœur de notre mission. Voici un aperçu de notre communauté et de nos ressources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Counter end={1250} label="Bénévoles Actifs" icon={Users} />
          <Counter end={45} label="Partenaires Engagés" icon={Handshake} />
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 col-span-1 md:col-span-1 flex flex-col justify-center">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">Objectif Financier</span>
                </div>
                <span className="text-sm font-bold text-green-600">{Math.round(percentage)}%</span>
             </div>
             <Progress value={progress} className="h-3 mb-2" />
             <div className="flex justify-between text-xs text-slate-500">
                <span>{currentAmount.toLocaleString()}€ collectés</span>
                <span>Obj. {targetAmount.toLocaleString()}€</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
