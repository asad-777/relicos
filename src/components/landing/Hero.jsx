import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="hero min-h-screen h-full w-full relative overflow-hidden bg-transparent border-b-2 border-base-content">
      <div className="hero-content full w-full text-center relative z-10 px-4 md:px-8 lg:px-16">
        <div className="w-full max-w-6xl flex flex-col items-center space-y-8 bg-base-100/80 p-6 md:p-12 border-4 border-base-content shadow-[8px_8px_0px_var(--color-base-content)] backdrop-blur-sm mx-auto">
          <div className="space-y-6">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl uppercase tracking-widest text-primary leading-tight" 
                style={{ textShadow: "4px 4px 0px var(--color-base-content)" }}>
              The Ultimate<br/>Retro Web OS
            </h1>
            <p className="font-body text-lg md:text-2xl text-base-content opacity-90 max-w-2xl mx-auto font-bold px-4">
              A space to get lost for a while.
            </p>
          </div>

          <div className="px-4 md:px-8 flex flex-col sm:flex-row gap-6 md:gap-12 w-full justify-center items-center">
            <Link href="/os" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg md:text-2xl py-6 md:py-8 px-8 md:px-12 animate-pulse shadow-[6px_6px_0px_var(--color-base-content)] md:shadow-[8px_8px_0px_var(--color-base-content)] hover:shadow-[4px_4px_0px_var(--color-base-content)] font-heading uppercase tracking-widest border-2 border-base-content bg-primary text-primary-content hover:bg-secondary/90 hover:translate-y-1 md:hover:translate-y-2">
                Boot OS
              </Button>
            </Link>
            <Button 
              size="lg" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto text-lg md:text-2xl py-6 md:py-8 px-8 md:px-12 animate-pulse shadow-[6px_6px_0px_var(--color-base-content)] md:shadow-[8px_8px_0px_var(--color-base-content)] hover:shadow-[4px_4px_0px_var(--color-base-content)] font-heading uppercase tracking-widest border-2 border-base-content bg-base-100 text-base-content hover:bg-primary/90 hover:translate-y-1 md:hover:translate-y-2"
            >
              See Features
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
