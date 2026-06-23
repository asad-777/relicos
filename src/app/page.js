'use client';

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Gallery } from "@/components/landing/Gallery";
import { TechStack } from "@/components/landing/TechStack";
import { GuideFAQ } from "@/components/landing/GuideFAQ";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import PixelSnowWrapper from "@/components/PixelSnowWrapper";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content selection:bg-primary selection:text-primary-content scroll-smooth relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <PixelSnowWrapper />
      </div>
      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />
        <main className="flex-grow pt-8">
          <Hero />
          <Gallery />
          <TechStack />
          <GuideFAQ />
          <Features />
        </main>
        <Footer />
      </div>
    </div>
  );
}