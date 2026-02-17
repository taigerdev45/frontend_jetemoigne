"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
}

export function KPICard({ title, value, change, changeType = "neutral", icon: Icon, description }: KPICardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      {(change || description) && (
        <div className="mt-4 flex items-center gap-2">
          {change && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                changeType === "positive" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                changeType === "negative" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                changeType === "neutral" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              )}
            >
              {change}
            </span>
          )}
          {description && (
            <span className="text-sm text-slate-500 dark:text-slate-400">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
