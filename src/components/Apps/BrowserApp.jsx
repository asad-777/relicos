'use client';

import { useState, useEffect } from 'react';
import { Search, RotateCw, Globe, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBrowserStore } from '@/lib/stores/browserStore';

export default function BrowserApp() {
  const { tabs, activeTabId, addTab, closeTab, setActiveTab, navigateSearch, navigateWeb } = useBrowserStore();
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);

  // Sync input value with active tab's state
  useEffect(() => {
    if (activeTab.type === 'search') {
      setInputValue(activeTab.query || '');
    } else {
      setInputValue(activeTab.url || '');
    }
  }, [activeTab.id, activeTab.type, activeTab.url, activeTab.query]);

  // Fetch search results when a tab's type is search and has a query
  useEffect(() => {
    let isMounted = true;
    
    async function fetchResults() {
      if (activeTab.type === 'search' && activeTab.query) {
        setIsLoading(true);
        setSearchError(null);
        
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(activeTab.query)}`);
          if (!res.ok) throw new Error('Failed to fetch');
          const data = await res.json();
          if (isMounted) {
            setSearchResults(data.results || []);
          }
        } catch (err) {
          if (isMounted) setSearchError('Failed to load search results.');
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else if (activeTab.type === 'search' && !activeTab.query) {
        setSearchResults(null);
      }
    }

    fetchResults();

    return () => { isMounted = false; };
  }, [activeTab.id, activeTab.type, activeTab.query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.trim();
    
    // Check if it's a URL
    if (query.match(/^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i) || (query.includes('.') && !query.includes(' '))) {
      let targetUrl = query;
      if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
      }
      navigateWeb(activeTabId, targetUrl);
    } else {
      // It's a search
      navigateSearch(activeTabId, query);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-base-100 text-base-content overflow-hidden font-body relative" data-lenis-prevent="true">
        {/* Tab Bar */}
        <div className="flex items-center bg-base-300 pt-2 px-2 gap-1 shrink-0 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center min-w-[120px] max-w-[200px] h-8 px-3 rounded-t-lg cursor-pointer transition-colors border-x border-t border-base-content/10 select-none ${
                activeTabId === tab.id 
                  ? 'bg-base-200/80 text-base-content font-bold shadow-[0_-2px_5px_rgba(0,0,0,0.05)]' 
                  : 'bg-base-300 text-base-content/60 hover:bg-base-200/50'
              }`}
            >
              <Globe size={12} className="mr-2 opacity-60 shrink-0" />
              <span className="flex-1 text-xs truncate mr-2">{tab.title}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                className={`p-0.5 rounded-full hover:bg-base-content/20 ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button onClick={addTab} className="p-1.5 ml-1 rounded hover:bg-base-content/10 text-base-content/70">
            <Plus size={16} />
          </button>
        </div>

        {/* Browser Chrome */}
        <div className="flex items-center gap-2 p-2 bg-base-200/80 border-b-2 border-base-content/20 shrink-0">
          <div className="flex gap-1">
            <button className="p-1.5 rounded hover:bg-base-content/20 opacity-50 cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-base-content/20 opacity-50 cursor-not-allowed">
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => {
                if (activeTab.type === 'web') {
                  const iframe = document.getElementById(`iframe-${activeTab.id}`);
                  if (iframe) iframe.src = iframe.src;
                } else if (activeTab.type === 'search' && activeTab.query) {
                  navigateSearch(activeTab.id, activeTab.query);
                }
              }}
              className="p-1.5 rounded hover:bg-base-content/20 active:scale-95 transition-all"
            >
              <RotateCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-base-100 border-2 border-base-content/40 rounded-sm overflow-hidden px-2 shadow-inner h-9">
            <Search size={14} className="opacity-50 mr-2 shrink-0" strokeWidth={2.5} />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search the web or enter URL"
              className="flex-1 bg-transparent py-1.5 text-sm font-bold outline-none w-full"
            />
          </form>
        </div>
        
        {/* Browser Content */}
        <div className="flex-1 relative bg-white overflow-hidden">
          {activeTab.type === 'search' ? (
            <div className="w-full h-full bg-base-100 overflow-y-auto p-6 md:p-10" data-lenis-prevent="true">
              {!activeTab.query ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <Globe size={64} className="mb-4" />
                  <h2 className="text-2xl font-black uppercase tracking-widest">Internet Search</h2>
                  <p className="font-bold">Powered by Wikipedia</p>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center pt-20">
                  <RotateCw size={32} className="animate-spin text-primary opacity-50" />
                </div>
              ) : searchError ? (
                <div className="text-red-500 font-bold p-4 bg-red-500/10 rounded-lg">{searchError}</div>
              ) : searchResults?.length === 0 ? (
                <div className="font-bold text-xl opacity-60 pt-10 text-center">No results found.</div>
              ) : (
                <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-base-content/10 pb-4 mb-6">
                    <h3 className="text-sm font-bold opacity-50 uppercase tracking-wider">Search Results for</h3>
                    <h2 className="text-2xl font-black">{activeTab.query}</h2>
                  </div>
                  
                  {searchResults?.map((result, idx) => (
                    <div key={idx} className="group cursor-pointer" onClick={() => navigateWeb(activeTab.id, result.url, result.title)}>
                      <p className="text-xs font-bold text-primary opacity-70 mb-1 truncate">{result.url}</p>
                      <h3 className="text-xl font-bold text-[#1a0dab] group-hover:underline leading-tight mb-2">{result.title}</h3>
                      <p className="text-sm opacity-80 leading-relaxed line-clamp-2">{result.snippet}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <iframe
              id={`iframe-${activeTab.id}`}
              src={activeTab.url}
              className="w-full h-full border-none absolute inset-0 bg-white"
              title="Browser Content"
            />
          )}
      </div>
      </div>
  );
}
