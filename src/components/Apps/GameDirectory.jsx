'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useWindowStore } from '@/lib/stores/windowStore';

export default function GameDirectory() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openWindow } = useWindowStore();

  useEffect(() => {
    fetch('/api/games')
      .then(res => res.json())
      .then(data => {
        setGames(data.games || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4 font-mono text-primary animate-pulse">Loading database...</div>;
  }

  return (
    <div className="p-4 grid grid-cols-2 gap-4 h-full overflow-y-auto" data-lenis-prevent="true">
      {games.map(game => (
        <div 
          key={game.id} 
          className="border-2 border-base-content bg-base-200 cursor-pointer hover:bg-primary hover:text-primary-content transition-colors group p-2 flex flex-col"
          onClick={() => {
            openWindow({
              id: `game-${game.id}`,
              title: game.title,
              type: 'iframe',
              url: game.embed_url,
              width: 800,
              height: 600
            });
          }}
        >
          <div className="aspect-video relative mb-2 border-2 border-base-content bg-base-300 shrink-0">
            {game.thumbnail ? (
              <Image src={game.thumbnail} alt={game.title} fill className="object-cover" unoptimized />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-mono text-xs">No Image</div>
            )}
          </div>
          <h3 className="font-heading uppercase truncate text-sm">{game.title}</h3>
          <p className="font-body text-xs mt-1 opacity-80 line-clamp-2">{game.description}</p>
        </div>
      ))}
    </div>
  );
}
