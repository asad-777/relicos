import { Activity, TerminalSquare, Box, Calculator, Music } from 'lucide-react';

export const APP_REGISTRY = {
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: Activity,
    type: 'settings',
    color: '#FFBDff',
    defaultWidth: 800,
    defaultHeight: 600,
    isDesktopIcon: true,
  },

  games: {
    id: 'games',
    title: 'Game Directory',
    icon: Box,
    type: 'directory',
    color: '#27C93F',
    defaultWidth: 800,
    defaultHeight: 600,
    isDesktopIcon: true,
  },
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    icon: Calculator,
    type: 'calculator',
    color: '#00BFFF',
    defaultWidth: 320,
    defaultHeight: 480,
    isDesktopIcon: true,
  },
  music: {
    id: 'music',
    title: 'Music Player',
    icon: Music,
    type: 'music',
    color: '#FF1493',
    defaultWidth: 400,
    defaultHeight: 500,
    isDesktopIcon: true,
  }
};
