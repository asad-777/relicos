const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'public', 'screenshots');

fs.readdir(dir, (err, files) => {
  if (err) throw err;
  
  files.forEach(file => {
    if (file.endsWith('.png')) {
      const name = path.parse(file).name;
      const webpPath = path.join(dir, `${name}.webp`);
      
      sharp(path.join(dir, file))
        .webp()
        .toFile(webpPath)
        .then(() => console.log(`Converted ${file} to ${name}.webp`))
        .catch(err => console.error(`Error converting ${file}:`, err));
    }
  });
});
