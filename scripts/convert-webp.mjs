import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

async function convertWallpapers() {
  const wallpapersDir = path.join(process.cwd(), 'public', 'wallpapers');
  
  try {
    const files = await fs.readdir(wallpapersDir);
    
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const ext = path.extname(file);
        const basename = path.basename(file, ext);
        const inputPath = path.join(wallpapersDir, file);
        const outputPath = path.join(wallpapersDir, `${basename}.webp`);
        
        console.log(`Converting ${file} -> ${basename}.webp...`);
        
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
          
        // Delete original file to save space
        await fs.unlink(inputPath);
        console.log(`Deleted original: ${file}`);
      }
    }
    
    console.log('✅ All wallpapers converted to .webp successfully!');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

convertWallpapers();
