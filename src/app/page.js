import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { GamesPreview } from "@/components/landing/GamesPreview";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <GamesPreview />
      </main>
      <Footer />
    </div>
  );
}