'use client';

import { Folder, Clock, Calendar, ColorsSwatch, Music, Search, Tv } from 'pixelarticons/react';

const features = [
  {
    icon: Search,
    name: "Web Browser",
    description: "A standalone web browser, providing a complete view of the internet through a unique retro lens.",
    colorVar: "var(--color-primary)",
  },
  {
    icon: Tv,
    name: "YouTube Viewer",
    description: "A dedicated video client built to play YouTube content natively within a custom window frame.",
    colorVar: "var(--color-error)",
  },
  {
    icon: ColorsSwatch,
    name: "Custom Themes",
    description: "A finished collection of 5 distinct hardware-inspired color palettes that set the visual tone.",
    colorVar: "var(--color-accent)",
  },
  {
    icon: Folder,
    name: "Window Manager",
    description: "A complete windowing system that faithfully recreates classic desktop environments.",
    colorVar: "var(--color-info)",
  },
  {
    icon: Music,
    name: "Music Player",
    description: "An integrated audio engine engineered for flawless playback with unified system controls.",
    colorVar: "var(--color-secondary)",
  },
  {
    icon: Calendar,
    name: "Widgets & Apps",
    description: "A full suite of built-in utilities, including a calculator, clock, and calendar.",
    colorVar: "var(--color-warning)",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24    border-b-2 border-base-content px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black font-heading uppercase tracking-widest text-base-content text-center mb-16">
          Core Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={feature.name}
              className={`flex flex-col justify-start border-4 border-base-content bg-base-200 p-6 md:p-8 transition-transform hover:-translate-y-2`}
              style={{ boxShadow: `8px 8px 0px ${feature.colorVar}` }}
            >
              <div 
                className="inline-flex w-fit p-4 border-4 border-base-content bg-base-100 mb-6"
                style={{ boxShadow: `4px 4px 0px ${feature.colorVar}` }}
              >
                <feature.icon className="w-10 h-10 text-base-content" />
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-wider text-base-content mb-4">
                {feature.name}
              </h3>
              <p className="font-body text-lg font-medium text-base-content/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
