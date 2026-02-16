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
        <div className={cn("flex min-w-full shrink-0 gap-4 items-center px-2", animationDirection, speedClass[speed])}>
          {items.map((item) => (
            <MarqueeCard key={item.id} item={item} highlight={highlight} />
          ))}
        </div>
        {/* Duplicate for infinite loop */}
        <div className={cn("flex min-w-full shrink-0 gap-4 items-center px-2", animationDirection, speedClass[speed])} aria-hidden="true">
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
          ? "w-[280px] h-[160px] md:w-[350px] md:h-[200px] border-primary/20 shadow-blue-100 hover:shadow-xl hover:border-primary" 
          : "w-[200px] h-[100px] md:w-[250px] md:h-[120px] border-border shadow-sm hover:shadow-md"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent z-0" />
      
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
            "font-bold leading-tight line-clamp-2",
            highlight ? "text-lg md:text-xl text-text-deep" : "text-sm md:text-base text-text-deep/80"
          )}>
            {item.title}
          </h4>
        </div>

        {highlight && (
          <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
            Lire le témoignage &rarr;
          </div>
        )}
      </div>
      
      {/* Decorative accent for highlight cards */}
      {highlight && (
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
      )}
    </div>
  );
};
