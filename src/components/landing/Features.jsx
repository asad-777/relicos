import { Monitor, Grid3x3, Brush } from 'pixelarticons/react';

export function Features() {
  return (
    <section id="features" className="py-24 bg-transparent border-t-2 border-base-content relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl uppercase tracking-widest text-primary mb-4" style={{ textShadow: "3px 3px 0px var(--color-base-content)" }}>
            System Specs
          </h2>
          <p className="font-body text-xl opacity-80">Everything you need to play the best indie games on the web.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Grid3x3 size={48} />}
            title="Window Manager"
            desc="A fully functional desktop environment in your browser. Drag, resize, and multitask like it's 1999."
          />
          <FeatureCard 
            icon={<Monitor size={48} />}
            title="Curated Library"
            desc="Discover hand-picked web-based indie games from itch.io. No downloads, no installations, just play."
          />
          <FeatureCard 
            icon={<Brush size={48} />}
            title="Retro Themes"
            desc="Swap between authentic Game Boy inspired color palettes or create your own custom theme."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-base-100 border-2 border-base-content p-8 flex flex-col items-center text-center shadow-[6px_6px_0px_var(--color-base-content)] hover:-translate-y-2 hover:shadow-[10px_10px_0px_var(--color-base-content)] transition-all duration-300">
      <div className="text-primary mb-6">
        {icon}
      </div>
      <h3 className="font-heading text-2xl uppercase mb-4">{title}</h3>
      <p className="font-body leading-relaxed opacity-80">{desc}</p>
    </div>
  );
}
