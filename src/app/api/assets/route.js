import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    
    // Read wallpapers
    const wallpapersPath = path.join(publicDir, 'wallpapers');
    let wallpapers = [];
    try {
      const wallpaperFiles = await fs.readdir(wallpapersPath);
      wallpapers = wallpaperFiles
        .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
        .map(file => file.replace(/\.[^/.]+$/, "")); // remove extension
    } catch (e) {
      console.warn('Could not read wallpapers directory:', e.message);
    }

    // Read music
    const musicPath = path.join(publicDir, 'music');
    let music = [];
    try {
      const musicFiles = await fs.readdir(musicPath);
      music = musicFiles
        .filter(file => file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.ogg'));
    } catch (e) {
      console.warn('Could not read music directory:', e.message);
    }

    return NextResponse.json({
      wallpapers,
      music
    });
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
