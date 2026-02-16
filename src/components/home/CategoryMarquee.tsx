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
  mode?: "auto" | "manual"; // "auto" for Marquee, "manual" for standard scroll
  type?: "card" | "logo";   // "card" for content, "logo" for partners
}

export const CategoryMarquee = ({
  title,
  items,
  direction = "left",
  speed = "normal",
  className,
  highlight = false,
  mode = "auto",
  type = "card",
}: CategoryMarqueeProps) => {
  const speedClass = {
    slow: "duration-[60s]",
    normal: "duration-[40s]",
    fast: "duration-[20s]",
  };

  const animationDirection = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className={cn("flex flex-col gap-6 py-8 w-full overflow-hidden", className)}>
      <h3 className={cn(
        "px-6 text-xl font-bold uppercase tracking-wider",
        highlight ? "text-primary text-3xl" : "text-text-deep/40"
      )}>
        {title}
      </h3>
      
      {mode === "auto" ? (
        /* --- MODE MARQUEE (INFINITE SCROLL) --- */
        <div className="relative w-full flex overflow-hidden mask-gradient-sides">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-10 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-10 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />

          {/* Marquee Content */}
          <div className={cn("flex min-w-full shrink-0 gap-4 items-center px-2", animationDirection, speedClass[speed])}>
            {items.map((item) => (
              type === "logo" 
                ? <LogoCard key={item.id} item={item} />
                : <MarqueeCard key={item.id} item={item} highlight={highlight} />
            ))}
          </div>
          {/* Duplicate for infinite loop */}
          <div className={cn("flex min-w-full shrink-0 gap-4 items-center px-2", animationDirection, speedClass[speed])} aria-hidden="true">
            {items.map((item) => (
              type === "logo"
                ? <LogoCard key={`${item.id}-copy`} item={item} />
                : <MarqueeCard key={`${item.id}-copy`} item={item} highlight={highlight} />
            ))}
          </div>
        </div>
      ) : (
        /* --- MODE MANUAL (HORIZONTAL SCROLL) --- */
        <div className="w-full overflow-x-auto pb-6 px-6 scrollbar-hide snap-x snap-mandatory flex gap-6">
           {items.map((item) => (
              <div key={item.id} className="snap-center shrink-0">
                <MarqueeCard item={item} highlight={highlight} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const LogoCard = ({ item }: { item: MarqueeItem }) => {
  return (
    <div className="w-[200px] h-[100px] md:w-[240px] md:h-[120px] bg-white rounded-xl border border-border/50 shadow-sm flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100">
      {item.image ? (
        <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
      ) : (
        <span className="text-lg font-bold text-text-deep/50 text-center leading-tight">{item.title}</span>
      )}
    </div>
  );
};

const MarqueeCard = ({ item, highlight }: { item: MarqueeItem; highlight: boolean }) => {
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-3xl border transition-all duration-300 cursor-pointer hover:scale-105 group overflow-hidden bg-white",
        highlight 
          ? "w-[340px] h-[240px] md:w-[500px] md:h-[320px] border-primary/20 shadow-blue-100 hover:shadow-2xl hover:border-primary" 
          : "w-[280px] h-[200px] md:w-[360px] md:h-[240px] border-border shadow-sm hover:shadow-xl"
      )}
    >
      {/* Background Image Placeholder or Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent z-0" />
      
      {item.image && (
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity z-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
      )}
      
      <div className="relative z-10 p-6 flex flex-col justify-between h-full">
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
            highlight ? "text-2xl md:text-3xl text-text-deep" : "text-lg md:text-xl text-text-deep/90"
          )}>
            {item.title}
          </h4>
        </div>

        {/* Call To Action Button (Always visible now for better UX on mobile) */}
        <div className="mt-auto pt-4">
          <button className={cn(
            "w-full py-3 px-4 rounded-2xl text-sm md:text-base font-bold transition-all flex items-center justify-center gap-2",
            highlight 
              ? "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5" 
              : "bg-muted text-text-deep hover:bg-secondary hover:text-white"
          )}>
            {highlight ? "Lire le témoignage" : "Découvrir"} &rarr;
          </button>
        </div>
      </div>
      
      {/* Decorative accent for highlight cards */}
      {highlight && (
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all pointer-events-none" />
      )}
    </div>
  );
};
