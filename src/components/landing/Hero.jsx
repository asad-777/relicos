import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="hero min-h-screen relative overflow-hidden bg-transparent pt-24">
      <div className="hero-content text-center relative z-10">
        <div className="max-w-3xl flex flex-col items-center space-y-8">
          <div className="space-y-6">
            <h1 className="font-heading text-5xl md:text-7xl uppercase tracking-widest text-primary leading-tight" 
                style={{ textShadow: "6px 6px 0px var(--color-base-content)" }}>
              The Ultimate<br/>Retro Web OS
            </h1>
            <p className="font-body text-xl md:text-2xl text-base-content opacity-90 max-w-2xl mx-auto">
              Old soul. New games. A web platform for discovering and playing curated web-based indie games from itch.io, running entirely in your browser.
            </p>
          </div>

          <div className="pt-8">
            <Link href="/os">
              <Button size="lg" className="text-2xl py-8 px-12 animate-pulse shadow-[8px_8px_0px_var(--color-base-content)] hover:shadow-[6px_6px_0px_var(--color-base-content)]">
                Insert Coin to Start
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
