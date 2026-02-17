"use client";

import React from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: {
    value: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function CategoryFilters({
  categories,
  defaultValue,
  onChange,
  className,
}: CategoryFilterProps) {
  return (
    <ToggleGroup
      type="single"
      defaultValue={defaultValue}
      onValueChange={(value) => {
        if (value && onChange) onChange(value);
      }}
      className={cn("flex flex-wrap gap-2 justify-start", className)}
    >
      {categories.map((category) => (
        <ToggleGroupItem
          key={category.value}
          value={category.value}
          aria-label={category.label}
          className="rounded-full px-4 py-2 border border-border data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:border-primary hover:bg-muted hover:text-primary transition-all duration-200"
        >
          {category.icon && <span className="mr-2">{category.icon}</span>}
          {category.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
