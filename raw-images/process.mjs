/**
 * Turns the raw photos pulled from the old Wix site into optimised assets in
 * public/images. Run with `node raw-images/process.mjs`.
 *
 * Every source here is Solden's own photography, except the three noted as
 * STOCK in the manifest below (they were already stock on the old site).
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "raw-images";
const OUT = "public/images";
fs.mkdirSync(`${OUT}/gallery`, { recursive: true });
fs.mkdirSync(`${OUT}/brand`, { recursive: true });

/**
 * The green "S" swoosh is a JPEG on solid black, so it has no alpha and would
 * sit in a black box on a light background. Luminance maps cleanly onto opacity
 * here (black background -> transparent, green glow -> opaque), so derive the
 * alpha channel from the brightest colour channel per pixel.
 */
async function logoWithAlpha(input, output, size) {
  const trimmed = await sharp(input).trim({ threshold: 12 }).toBuffer();
  const { data, info } = await sharp(trimmed)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const alpha = Math.max(data[i], data[i + 1], data[i + 2]);
    data[i + 3] = alpha;
    // Re-saturate: dividing the colour back out stops the glow going muddy
    // once it is composited over a light background.
    if (alpha > 0) {
      const boost = 255 / alpha;
      data[i] = Math.min(255, Math.round(data[i] * boost));
      data[i + 1] = Math.min(255, Math.round(data[i + 1] * boost));
      data[i + 2] = Math.min(255, Math.round(data[i + 2] * boost));
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(output);
  console.log(`brand: ${path.basename(output)} (${info.width}x${info.height})`);
}

/** Gallery / content photo: cap the long edge and convert to WebP. */
async function photo(src, out, { width = 1600, height = null, quality = 80 } = {}) {
  const pipeline = sharp(`${SRC}/${src}`).rotate();
  if (height === null) {
    pipeline.resize({ width, withoutEnlargement: true });
  } else {
    pipeline.resize(width, height, { fit: "cover", position: "centre" });
  }
  await pipeline.webp({ quality }).toFile(`${OUT}/${out}`);
  const meta = await sharp(`${OUT}/${out}`).metadata();
  console.log(`  ${out} — ${meta.width}x${meta.height}, ${(fs.statSync(`${OUT}/${out}`).size / 1024).toFixed(0)}KB`);
}

await logoWithAlpha(`${SRC}/src-01.jpg`, `${OUT}/brand/swoosh.png`, 512);

// MTA Queensland membership mark, on white.
await sharp(`${SRC}/src-27.jpg`)
  .resize({ width: 360, withoutEnlargement: true })
  .png()
  .toFile(`${OUT}/brand/mta-queensland.png`);
console.log("brand: mta-queensland.png");

/**
 * Manifest. `cat` drives the gallery filter; `alt` is written from actually
 * looking at each photo, not guessed from the filename.
 */
const MANIFEST = [
  // --- hero / feature ----------------------------------------------------
  { src: "src-12.jpg", out: "hero-workshop.webp", w: 2000, h: 1200, note: "dark HSV front, workshop" },
  { src: "src-04.jpg", out: "premises.webp", w: 1600, h: 1000, note: "Solden signage, vehicle on site" },
  { src: "src-24.jpg", out: "feature-respray.webp", w: 1600, h: 1000 },
  { src: "src-15.jpg", out: "feature-wheels.webp", w: 1200, h: 900 },
  { src: "src-13.jpg", out: "feature-stripdown.webp", w: 1400, h: 950 },
  { src: "src-19.jpg", out: "feature-liner.webp", w: 1200, h: 900 },
  { src: "src-09.jpg", out: "feature-truck.webp", w: 1200, h: 900 },
  { src: "src-07.jpg", out: "feature-motorbike.webp", w: 1200, h: 800 },
  { src: "src-28.png", out: "feature-paint.webp", w: 1200, h: 800, stock: true },

  // --- gallery -----------------------------------------------------------
  { src: "src-02.jpg", out: "gallery/respray-hsv-yellow.webp", cat: "resprays" },
  { src: "src-11.jpg", out: "gallery/respray-hsv-yellow-front.webp", cat: "resprays" },
  { src: "src-16.jpg", out: "gallery/respray-blue-quarter.webp", cat: "resprays" },
  { src: "src-24.jpg", out: "gallery/respray-red-mazda.webp", cat: "resprays" },
  { src: "src-05.jpg", out: "gallery/moto-blue-custom.webp", cat: "motorbikes" },
  { src: "src-06.jpg", out: "gallery/moto-honda-tank.webp", cat: "motorbikes" },
  { src: "src-07.jpg", out: "gallery/moto-kawasaki-zxr.webp", cat: "motorbikes" },
  { src: "src-08.jpg", out: "gallery/truck-isuzu-front.webp", cat: "trucks" },
  { src: "src-09.jpg", out: "gallery/truck-fuso-front.webp", cat: "trucks" },
  { src: "src-10.jpg", out: "gallery/truck-panel-damage.webp", cat: "trucks" },
  { src: "src-12.jpg", out: "gallery/colour-change-hsv.webp", cat: "colour-change" },
  { src: "src-03.jpg", out: "gallery/colour-change-commodore.webp", cat: "colour-change" },
  { src: "src-15.jpg", out: "gallery/wheels-alloy.webp", cat: "wheels" },
  { src: "src-18.jpg", out: "gallery/wheels-blue-quarter.webp", cat: "wheels" },
  { src: "src-17.jpg", out: "gallery/smash-blue-bar.webp", cat: "smash" },
  { src: "src-22.jpg", out: "gallery/smash-red-quarter.webp", cat: "smash" },
  { src: "src-23.jpg", out: "gallery/smash-red-rear.webp", cat: "smash" },
  { src: "src-13.jpg", out: "gallery/smash-stripdown.webp", cat: "smash" },
  { src: "src-19.jpg", out: "gallery/liner-black-tray.webp", cat: "liners" },
  { src: "src-20.jpg", out: "gallery/liner-black-detail.webp", cat: "liners" },
  { src: "src-21.jpg", out: "gallery/liner-red-tray.webp", cat: "liners" },
  { src: "src-14.jpg", out: "gallery/detail-carbon-brake.webp", cat: "detailing" },
];

console.log("photos:");
for (const item of MANIFEST) {
  await photo(item.src, item.out, {
    width: item.w ?? 1400,
    height: item.h ?? null,
    quality: item.out.startsWith("hero") ? 82 : 80,
  });
}

const total = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .reduce(
      (sum, e) =>
        e.isDirectory()
          ? sum + total(path.join(dir, e.name))
          : sum + fs.statSync(path.join(dir, e.name)).size,
      0,
    );
console.log(`\ntotal public/images: ${(total(OUT) / 1024 / 1024).toFixed(2)}MB`);
