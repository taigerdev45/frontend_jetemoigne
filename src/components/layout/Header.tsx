"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Direct", href: "/direct" },
    { name: "Programmes", href: "/programmes" },
    { name: "Témoignages", href: "/temoignages" },
    { name: "Projets", href: "/projets" },
    { name: "Ouvrages", href: "/ouvrages" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-100 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-white/20 py-3"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">J</span>
          </div>
          <span className="text-text-deep font-bold text-xl tracking-tight hidden md:block">
            JETEMOIGNE<span className="text-primary">-TV</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-text-deep/80 hover:text-primary font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link href="/soutenir" className="hidden sm:block">
            <Button className="rounded-2xl bg-secondary hover:bg-primary text-white px-6 shadow-md transition-all">
              Soutenir
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="text-text-deep hover:bg-primary/10 rounded-2xl lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xl overflow-hidden"
          >
            <nav className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-text-deep/80 hover:text-primary transition-colors py-2 border-b border-gray-100 last:border-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 sm:hidden">
                <Link href="/soutenir" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full rounded-2xl bg-secondary hover:bg-primary text-white py-6 shadow-md transition-all text-lg">
                    Soutenir
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
