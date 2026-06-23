'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('/api/screenshots')
      .then(res => res.json())
      .then(data => {
        if (data.images) setImages(data.images);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section id="gallery" className="py-40 bg-base-200 border-b-2 border-base-content">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-black font-heading uppercase tracking-widest text-base-content mb-12">
          System Interface
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
          {images.map((src, idx) => (
            <div 
              key={idx} 
              className="relative z-10 hover:z-50 border-4 border-base-content shadow-[8px_8px_0px_var(--color-primary)] bg-base-200 flex items-center justify-center transition-transform duration-300 hover:delay-300 hover:scale-150 md:hover:scale-[2]"
            >
              <Image
                src={src}
                alt={`Screenshot ${idx + 1}`}
                width={1280}
                height={720}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
