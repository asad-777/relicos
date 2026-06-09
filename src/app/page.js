import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-base-100 text-base-content">
      <div className="flex flex-col items-center space-y-12 max-w-2xl text-center px-4">
        
        {/* Title Section */}
        <div className="space-y-4">
          <h1 className="font-heading text-4xl md:text-6xl uppercase tracking-widest text-primary" style={{ textShadow: "4px 4px 0px var(--color-base-content)" }}>
            Relic OS
          </h1>
          <p className="font-body text-xl md:text-2xl text-base-content opacity-90">
            Old soul. New games.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link href="/os">
            <Button size="lg" className="text-xl animate-pulse">
              Insert Coin to Start
            </Button>
          </Link>
        </div>

        {/* Footer/Hint */}
        <p className="font-body text-sm opacity-70 mt-16 max-w-md">
          A web platform for discovering and playing curated web-based indie games from itch.io, running entirely in your browser.
        </p>


      </div>
    </main>
  );
}