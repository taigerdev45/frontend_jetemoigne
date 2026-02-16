import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProjectsTileProps {
  className?: string;
  projectName?: string;
  progress?: number;
}

export function ProjectsTile({
  className,
  projectName = "Construction Studio",
  progress = 65,
}: ProjectsTileProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl p-6 shadow-blue-100 border border-border flex flex-col justify-between h-full",
        className
      )}
    >
      <div>
        <h3 className="font-bold text-text-deep mb-4">{projectName}</h3>
        <div className="mb-2">
          <Progress value={progress} className="h-2 bg-muted" />
        </div>
        <span className="text-xs text-text-deep/60 font-medium">
          {progress}% de l&apos;objectif atteint
        </span>
      </div>
      <Button
        variant="outline"
        className="mt-4 w-full rounded-xl border-primary text-primary hover:bg-primary/5 text-xs"
      >
        Contribuer
      </Button>
    </div>
  );
}
