import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jetemoigne-TV | Plateforme Chrétienne de Témoignages",
  description: "Découvrez des témoignages inspirants, des programmes chrétiens et soutenez nos projets d'évangélisation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased font-sans bg-background text-text-deep min-h-screen flex flex-col`}
      >
        <ReduxProvider>
          <Header />
          <main className="grow pt-20">
            {children}
          </main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
