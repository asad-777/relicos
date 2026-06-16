'use client';

import { useState, useEffect } from 'react';
import { Search, PlaySquare, Play, X, Video, ArrowLeft, Loader2 } from 'lucide-react';

export default function YoutubeApp() {
  const [view, setView] = useState('home'); // 'home', 'results', 'player'
  const [activeVideo, setActiveVideo] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract YouTube ID from various URL formats
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setError('');
    
    // Check if it's a direct URL or ID
    const directId = (inputValue.length === 11 && !inputValue.includes('/')) ? inputValue : extractVideoId(inputValue);
    
    if (directId) {
      setActiveVideo({ id: directId, title: 'Custom Video' });
      setView('player');
      return;
    }

    // Otherwise, perform text search
    setSearchQuery(inputValue);
    setView('results');
    setIsLoading(true);
    setSearchResults([]);

    try {
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(inputValue)}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      if (data.results) {
        setSearchResults(data.results);
      } else {
        setError('No results found.');
      }
    } catch (err) {
      setError('Failed to fetch YouTube results. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const playVideo = (video) => {
    setActiveVideo(video);
    setView('player');
  };

  const goBack = () => {
    if (view === 'player' && searchResults.length > 0) {
      setView('results');
    } else {
      setView('home');
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-base-100 text-base-content overflow-hidden font-body relative" data-lenis-prevent="true">
      
      {/* Top Bar (Only visible when NOT on home screen) */}
      {view !== 'home' && (
        <div className="flex items-center bg-[#FF0000] text-white p-2 gap-2 shrink-0 shadow-md z-10">
          <button 
            onClick={goBack}
            className="p-1.5 hover:bg-black/20 rounded-lg transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center font-bold">
            <PlaySquare size={20} className="mr-1" />
            <span className="hidden sm:inline">YouTube</span>
          </div>
          
          <form onSubmit={handleSearch} className="flex-1 flex items-center bg-white text-black rounded-sm overflow-hidden px-2 h-8 ml-2 shadow-inner max-w-md">
            <Search size={14} className="opacity-50 mr-2 shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm outline-none w-full"
            />
            {inputValue && (
              <button type="button" onClick={() => setInputValue('')} className="opacity-50 hover:opacity-100 p-1">
                <X size={14} />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-base-200 relative">
        
        {/* VIEW: HOME */}
        {view === 'home' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-base-200">
            <div className="flex items-center gap-3 mb-8 text-[#FF0000]">
              <PlaySquare size={64} strokeWidth={1.5} />
              <h1 className="text-5xl font-black tracking-tighter">YouTube</h1>
            </div>
            
            <form onSubmit={handleSearch} className="w-full max-w-xl relative flex items-center shadow-[4px_4px_0px_var(--color-base-content)] bg-base-100 border-2 border-base-content rounded-full h-14 overflow-hidden px-4 hover:-translate-y-1 hover:shadow-[4px_6px_0px_var(--color-base-content)] transition-all">
              <Search size={20} className="opacity-50 mr-3" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search videos or paste URL..."
                className="flex-1 bg-transparent text-lg font-bold outline-none h-full placeholder:opacity-50"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* VIEW: RESULTS */}
        {view === 'results' && (
          <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-black mb-6 border-b-2 border-base-content/10 pb-2">
              Results for: <span className="opacity-70">{searchQuery}</span>
            </h2>

            {error && (
              <div className="bg-error text-error-content font-bold p-4 rounded-lg mb-4">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <Loader2 size={48} className="animate-spin mb-4" />
                <p className="font-bold">Searching YouTube...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {searchResults.map((video) => (
                  <div 
                    key={video.id} 
                    onClick={() => playVideo(video)}
                    className="flex flex-col sm:flex-row gap-4 group cursor-pointer bg-base-100 p-2 border-2 border-transparent hover:border-base-content/20 rounded-xl transition-all"
                  >
                    <div className="relative w-full sm:w-64 aspect-video bg-black rounded-lg overflow-hidden shrink-0">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex flex-col pt-1">
                      <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-[#FF0000]">{video.title}</h3>
                      <p className="opacity-60 text-sm font-bold mt-2">{video.author}</p>
                      <p className="opacity-50 text-xs mt-1">{video.views}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: PLAYER */}
        {view === 'player' && activeVideo && (
          <div className="flex flex-col h-full bg-black animate-in fade-in duration-300">
            <div className="w-full h-full relative">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                className="w-full h-full absolute inset-0 border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube Video Player"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
