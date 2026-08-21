/**
 * Gallery images.
 *
 * Every photo here is Solden's own work, pulled from their existing site at full
 * resolution. Categories match the ones they already use on their gallery page:
 * Resprays, Motorbikes, Trucks & Buses, Colour Change, Tyres & Wheels, Smash
 * Repairs, Protection Liners, Small Panel Repairs.
 *
 * Alt text was written by looking at each photo — not inferred from filenames.
 */

export type GalleryCategory = {
  slug: string;
  label: string;
};

export const galleryCategories: GalleryCategory[] = [
  { slug: "all", label: "All work" },
  { slug: "smash", label: "Smash repairs" },
  { slug: "resprays", label: "Resprays" },
  { slug: "colour-change", label: "Colour change" },
  { slug: "motorbikes", label: "Motorbikes" },
  { slug: "trucks", label: "Trucks & buses" },
  { slug: "liners", label: "Protection liners" },
  { slug: "wheels", label: "Tyres & wheels" },
  { slug: "detailing", label: "Detailing" },
];

export type GalleryImage = {
  src: string;
  alt: string;
  category: string;
  /** Rough aspect hint so the masonry grid doesn't jump before images load. */
  tall?: boolean;
};

export const galleryImages: GalleryImage[] = [
  {
    src: "/images/gallery/respray-hsv-yellow.webp",
    alt: "Bright yellow HSV front bumper and headlight after refinishing",
    category: "resprays",
  },
  {
    src: "/images/gallery/respray-hsv-yellow-front.webp",
    alt: "Front quarter of a yellow HSV showing the finished paintwork",
    category: "resprays",
  },
  {
    src: "/images/gallery/respray-red-mazda.webp",
    alt: "Front quarter, headlight and wheel of a red hatchback after repair",
    category: "resprays",
  },
  {
    src: "/images/gallery/respray-blue-quarter.webp",
    alt: "Deep blue rear quarter panel and glass after refinishing",
    category: "resprays",
  },
  {
    src: "/images/gallery/colour-change-hsv.webp",
    alt: "Dark grey performance sedan with contrasting bonnet graphics",
    category: "colour-change",
  },
  {
    src: "/images/gallery/colour-change-commodore.webp",
    alt: "Black Holden Commodore ute, front on, after paintwork",
    category: "colour-change",
  },
  {
    src: "/images/gallery/moto-blue-custom.webp",
    alt: "Custom blue cruiser motorcycle with chrome wheels",
    category: "motorbikes",
  },
  {
    src: "/images/gallery/moto-honda-tank.webp",
    alt: "Deep red Honda motorcycle tank with gold wing decals",
    category: "motorbikes",
  },
  {
    src: "/images/gallery/moto-kawasaki-zxr.webp",
    alt: "Green and blue Kawasaki ZXR sportbike after paintwork",
    category: "motorbikes",
  },
  {
    src: "/images/gallery/truck-isuzu-front.webp",
    alt: "Front of a white Isuzu truck with bumper damage",
    category: "trucks",
  },
  {
    src: "/images/gallery/truck-fuso-front.webp",
    alt: "Front of a white Fuso truck in the workshop",
    category: "trucks",
  },
  {
    src: "/images/gallery/truck-panel-damage.webp",
    alt: "Dented front panel on a white commercial vehicle before repair",
    category: "trucks",
  },
  {
    src: "/images/gallery/liner-black-tray.webp",
    alt: "Ute tray finished in black Raptor protective liner",
    category: "liners",
  },
  {
    src: "/images/gallery/liner-black-detail.webp",
    alt: "Close detail of a black Raptor liner showing the textured finish",
    category: "liners",
  },
  {
    src: "/images/gallery/liner-red-tray.webp",
    alt: "Ute tray lined in a colour-matched red Raptor coating",
    category: "liners",
  },
  {
    src: "/images/gallery/wheels-alloy.webp",
    alt: "Multi-spoke alloy wheel and tyre on a finished vehicle",
    category: "wheels",
  },
  {
    src: "/images/gallery/wheels-blue-quarter.webp",
    alt: "Blue rear quarter panel and alloy wheel after repair",
    category: "wheels",
  },
  {
    src: "/images/gallery/smash-blue-bar.webp",
    alt: "Scraped front bumper on a blue sedan before repair",
    category: "smash",
  },
  {
    src: "/images/gallery/smash-red-quarter.webp",
    alt: "Damaged rear quarter panel on a red hatchback before repair",
    category: "smash",
  },
  {
    src: "/images/gallery/smash-red-rear.webp",
    alt: "Rear quarter of a red vehicle stripped back during repair",
    category: "smash",
  },
  {
    src: "/images/gallery/smash-stripdown.webp",
    alt: "Vehicle stripped back to bare panels and structure in the workshop",
    category: "smash",
  },
  {
    src: "/images/gallery/detail-carbon-brake.webp",
    alt: "Carbon fibre detail and red brake caliper after detailing",
    category: "detailing",
    tall: true,
  },
];

/** A short strip for the homepage. */
export const featuredGallery = [
  galleryImages[0],
  galleryImages[4],
  galleryImages[8],
  galleryImages[12],
  galleryImages[15],
  galleryImages[20],
];
