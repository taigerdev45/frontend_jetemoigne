"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Program } from "@/types";

interface ProgramCardProps {
  program: Program;
  onClick?: () => void;
}

export const ProgramCard = ({ program, onClick }: ProgramCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-3xl bg-white border border-border shadow-sm hover:shadow-blue-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 h-[320px] flex flex-col"
      )}
    >
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 bg-gray-100 group-hover:scale-105 transition-transform duration-700">
         {program.thumbnailUrl ? (
            <Image 
              src={program.thumbnailUrl} 
              alt={program.title} 
              fill
              className="object-cover"
              unoptimized
            />
         ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200" />
         )}
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col justify-end h-full">
        {program.category && (
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {program.category.replace('_', ' ')}
          </span>
        )}
        <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-blue-50 transition-colors mb-4">
          {program.title}
        </h3>
        
        <div className="w-full h-1 bg-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </div>
  );
};
