import { TransparencyDashboard } from "@/components/soutenir/TransparencyDashboard";
import { ActionCenter } from "@/components/soutenir/ActionCenter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nous Soutenir - Je Témoigne",
  description: "Participez à l'œuvre par vos dons, votre bénévolat ou un partenariat.",
};

export default function SoutenirPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-900/50"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Ensemble, Impactons des Vies
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Votre soutien est le moteur de notre mission. Découvrez comment vous pouvez contribuer aujourd&apos;hui.
          </p>
        </div>
      </section>

      <TransparencyDashboard />
      <ActionCenter />
    </main>
  );
}
