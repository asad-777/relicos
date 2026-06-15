'use client';

import React from 'react';

export default function BaseApp({ title, children, sidebar, toolbar }) {
  return (
    <div className="flex flex-col h-full bg-base-100 text-base-content overflow-hidden rounded-b-xl">
      {/* Toolbar - Optional top bar for app actions */}
      {toolbar && (
        <div className="flex-none bg-base-300/50 border-b border-white/10 p-2 flex items-center gap-2 shrink-0">
          {toolbar}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Optional navigation/filters */}
        {sidebar && (
          <div className="w-48 sm:w-64 flex-none bg-base-200/50 border-r border-white/10 p-4 overflow-y-auto hidden md:block" data-lenis-prevent="true">
            {sidebar}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-transparent relative" data-lenis-prevent="true">
          {children}
        </div>
      </div>
    </div>
  );
}
