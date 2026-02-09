import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-text-deep text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="font-bold text-lg tracking-tight">JETEMOIGNE-TV</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            La plateforme chrétienne dédiée aux témoignages, à l&apos;évangélisation et à la transformation des vies à travers le monde.
          </p>
        </div>

        {/* Liens Rapides */}
        <div>
          <h3 className="font-bold mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/direct" className="hover:text-primary transition-colors">Direct</Link></li>
            <li><Link href="/programmes" className="hover:text-primary transition-colors">Programmes</Link></li>
            <li><Link href="/temoignages" className="hover:text-primary transition-colors">Témoignages</Link></li>
            <li><Link href="/projets" className="hover:text-primary transition-colors">Projets</Link></li>
          </ul>
        </div>

        {/* Soutenir */}
        <div>
          <h3 className="font-bold mb-4">Soutenir</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/soutenir" className="hover:text-primary transition-colors">Faire un Don</Link></li>
            <li><Link href="/soutenir" className="hover:text-primary transition-colors">Devenir Partenaire</Link></li>
            <li><Link href="/soutenir" className="hover:text-primary transition-colors">Bénévolat</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Email: contact@jetemoigne.tv</li>
            <li>Suivez-nous sur les réseaux sociaux</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Jetemoigne-TV. Tous droits réservés. Inspiré par la Foi.
      </div>
    </footer>
  );
};

export default Footer;
