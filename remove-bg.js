const Jimp = require('jimp');

async function processImages() {
  const files = ['health.png'];
  for (const file of files) {
    const imgPath = './public/assets/bug-hunter/' + file;
    try {
      const image = await Jimp.read(imgPath);
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        const red = this.bitmap.data[idx + 0];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];
        // If the pixel is very dark (almost black), make it completely transparent
        if (red < 25 && green < 25 && blue < 25) {
          this.bitmap.data[idx + 3] = 0; // alpha = 0
        }
      });
      await image.writeAsync(imgPath);
      console.log(`Processed ${file}`);
    } catch (e) {
      console.error(`Failed to process ${file}`, e);
    }
  }
}

processImages();
