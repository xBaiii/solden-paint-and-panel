import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const dir = "raw-images";
const files = fs.readdirSync(dir).filter((f) => /^src-\d+\.(jpg|png)$/.test(f)).sort();
const CELL = 300, COLS = 4, ROWS = 4, PER = COLS * ROWS;

for (let sheet = 0; sheet * PER < files.length; sheet++) {
  const batch = files.slice(sheet * PER, sheet * PER + PER);
  const composites = [];
  for (let i = 0; i < batch.length; i++) {
    const buf = await sharp(path.join(dir, batch[i]))
      .resize(CELL, CELL, { fit: "cover" })
      .toBuffer();
    composites.push({
      input: buf,
      left: (i % COLS) * CELL,
      top: Math.floor(i / COLS) * CELL,
    });
    // label strip
    const label = await sharp({
      create: { width: CELL, height: 26, channels: 4, background: "#000000cc" },
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${CELL}" height="26"><text x="6" y="18" font-family="sans-serif" font-size="15" fill="#39FF14">${batch[i]}</text></svg>`,
          ),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();
    composites.push({
      input: label,
      left: (i % COLS) * CELL,
      top: Math.floor(i / COLS) * CELL + CELL - 26,
    });
  }
  const rows = Math.ceil(batch.length / COLS);
  await sharp({
    create: { width: COLS * CELL, height: rows * CELL, channels: 3, background: "#111" },
  })
    .composite(composites)
    .jpeg({ quality: 78 })
    .toFile(`${dir}/sheet-${sheet + 1}.jpg`);
  console.log(`sheet-${sheet + 1}.jpg — ${batch.join(", ")}`);
}
