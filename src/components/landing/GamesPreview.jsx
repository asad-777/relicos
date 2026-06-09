export function GamesPreview() {
  const games = [
    { title: "Celeste Classic", genre: "Platformer", author: "Maddy Thorson" },
    { title: "Friday Night Funkin'", genre: "Rhythm", author: "ninjamuffin99" },
    { title: "Sort the Court!", genre: "Simulation", author: "graebor" },
    { title: "A Dark Room", genre: "Text Adventure", author: "doublespeak" },
  ];

  return (
    <section id="games" className="py-24 bg-transparent">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-2 border-base-content pb-4 gap-4">
          <div>
            <h2 className="font-heading text-4xl uppercase tracking-widest text-primary mb-2" style={{ textShadow: "3px 3px 0px var(--color-base-content)" }}>
              Featured Cartridges
            </h2>
            <p className="font-body opacity-80">Top rated indie games available on Relic OS.</p>
          </div>
          <div className="hidden md:block font-heading text-xl uppercase animate-pulse text-primary">
            Insert Coin &gt;
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {games.map((game, i) => (
            <div key={i} className="group cursor-pointer">
              {/* Cartridge shape */}
              <div className="bg-base-200 border-2 border-base-content aspect-[3/4] p-3 flex flex-col shadow-[4px_4px_0px_var(--color-base-content)] relative overflow-hidden group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0px_var(--color-base-content)] transition-all">
                {/* Cartridge grooves */}
                <div className="flex gap-2 mb-3 px-2">
                  <div className="h-1 w-full bg-base-content/20 rounded-full"></div>
                  <div className="h-1 w-full bg-base-content/20 rounded-full"></div>
                  <div className="h-1 w-full bg-base-content/20 rounded-full"></div>
                </div>
                {/* Fake cartridge sticker */}
                <div className="flex-1 border-2 border-base-content bg-base-100 p-4 flex flex-col justify-between">
                  <div className="font-body text-xs uppercase opacity-50 text-right font-bold">RC-00{i+1}</div>
                  <div>
                    <h3 className="font-heading text-xl uppercase mb-2 leading-tight">{game.title}</h3>
                    <p className="font-body text-sm opacity-70 uppercase">{game.genre}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
