import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), 'public', 'screenshots');
    const files = fs.readdirSync(dirPath);
    
    // Filter only .webp files and map them to their public URL paths
    const webpFiles = files
      .filter(file => file.endsWith('.webp'))
      .map(file => `/screenshots/${file}`);
      
    return NextResponse.json({ images: webpFiles });
  } catch (error) {
    console.error('Error reading screenshots:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
