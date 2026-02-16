import React from "react";
import { cn } from "@/lib/utils";

export interface MarqueeItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string; // Placeholder for future images
  highlight?: boolean;
}

interface CategoryMarqueeProps {
  title: string;
  items: MarqueeItem[];
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  className?: string;
  highlight?: boolean; // Special emphasis for Testimonies
}

export const CategoryMarquee = ({
  title,
  items,
  direction = "left",
  speed = "normal",
  className,
  highlight = false,
}: CategoryMarqueeProps) => {
  const speedClass = {
    slow: "duration-[60s]",
    normal: "duration-[40s]",
    fast: "duration-[20s]",
  };

  const animationDirection = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className={cn("flex flex-col gap-4 py-6 w-full overflow-hidden", className)}>
      <h3 className={cn(
        "px-6 text-xl font-bold uppercase tracking-wider",
        highlight ? "text-primary text-2xl" : "text-text-deep/40"
      )}>
        {title}
      </h3>
      
      <div className="relative w-full flex overflow-hidden mask-gradient-sides">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-10 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-10 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Marquee Content */}
        <div className={cn("flex min-w-full shrink-0 gap-2 items-center px-1", animationDirection, speedClass[speed])}>
          {items.map((item) => (
            <MarqueeCard key={item.id} item={item} highlight={highlight} />
          ))}
        </div>
        {/* Duplicate for infinite loop */}
        <div className={cn("flex min-w-full shrink-0 gap-2 items-center px-1", animationDirection, speedClass[speed])} aria-hidden="true">
          {items.map((item) => (
            <MarqueeCard key={`${item.id}-copy`} item={item} highlight={highlight} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MarqueeCard = ({ item, highlight }: { item: MarqueeItem; highlight: boolean }) => {
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-2xl border transition-all duration-300 cursor-pointer hover:scale-105 group overflow-hidden bg-white",
        highlight 
          ? "w-[320px] h-[220px] md:w-[450px] md:h-[280px] border-primary/20 shadow-blue-100 hover:shadow-xl hover:border-primary" 
          : "w-[260px] h-[180px] md:w-[320px] md:h-[200px] border-border shadow-sm hover:shadow-md"
      )}
    >
      {/* Background Image Placeholder or Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent z-0" />
      
      {item.image && (
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity z-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
      )}
      
      <div className="relative z-10 p-5 flex flex-col justify-between h-full">
        <div>
           {item.subtitle && (
            <span className={cn(
              "text-xs font-bold uppercase tracking-wider mb-2 block",
              highlight ? "text-secondary" : "text-text-deep/40"
            )}>
              {item.subtitle}
            </span>
          )}
          <h4 className={cn(
            "font-bold leading-tight line-clamp-3",
            highlight ? "text-xl md:text-2xl text-text-deep" : "text-base md:text-lg text-text-deep/80"
          )}>
            {item.title}
          </h4>
        </div>

        {/* Call To Action Button (Always visible now for better UX on mobile) */}
        <div className="mt-auto pt-4">
          <button className={cn(
            "w-full py-2 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
            highlight 
              ? "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg" 
              : "bg-muted text-text-deep hover:bg-secondary hover:text-white"
          )}>
            {highlight ? "Lire le témoignage" : "Découvrir"} &rarr;
          </button>
        </div>
      </div>
      
      {/* Decorative accent for highlight cards */}
      {highlight && (
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all pointer-events-none" />
      )}
    </div>
  );
};
