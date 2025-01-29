const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

async function downloadTile(z, x, y, folder = "tiles") {
  const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  const tilePath = path.join(__dirname, folder, `${z}/${x}`);
  const filePath = path.join(tilePath, `${y}.png`);

  if (!fs.existsSync(tilePath)) {
    fs.mkdirSync(tilePath, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    const response = await fetch(url);
    if (response.ok) {
      const buffer = await response.buffer();
      fs.writeFileSync(filePath, buffer);
      console.log(`Downloaded: ${filePath}`);
    } else {
      console.log(`Failed to download: ${url}`);
    }
  } else {
    console.log(`Tile already exists: ${filePath}`);
  }
}

async function downloadMap(
  zRange = [10, 12],
  xRange = [500, 520],
  yRange = [380, 800]
) {
  for (let z = zRange[0]; z <= zRange[1]; z++) {
    for (let x = xRange[0]; x <= xRange[1]; x++) {
      for (let y = yRange[0]; y <= yRange[1]; y++) {
        await downloadTile(z, x, y);
      }
    }
  }
}

downloadMap();
