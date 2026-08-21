/**
 * Service content for the marketing site.
 *
 * CONTENT RULE: the copy here is rewritten and tightened, but every factual
 * claim traces to soldenpaintandpanel.com.au. No invented services, brands,
 * accreditations, timeframes or statistics. If it isn't on their current site,
 * it isn't here. See CLAUDE.md.
 */

export type ServiceFaq = { question: string; answer: string };

export type Service = {
  slug: string;
  name: string;
  /** Short label for chips and nav. */
  shortName: string;
  /** One-line card blurb. */
  excerpt: string;
  image: string;
  imageAlt: string;
  /** Opening paragraph on the detail page. */
  intro: string;
  /** What the job includes. */
  includes: string[];
  /** Body paragraphs. */
  body: string[];
  faqs: ServiceFaq[];
  /** Slugs of related services shown at the foot of the page. */
  related: string[];
};

export const services: Service[] = [
  {
    slug: "smash-repairs",
    name: "Smash repairs",
    shortName: "Smash repairs",
    excerpt:
      "Collision-damaged vehicles returned to pre-accident condition — from a car park ding to a major rebuild.",
    image: "/images/gallery/smash-stripdown.webp",
    imageAlt:
      "A vehicle stripped back to bare panels and structure in the Solden workshop",
    intro:
      "Whether it is a scuffed bumper or a vehicle that arrived on a tilt tray, the goal never changes: put it back the way it was before the accident. We repair everything from the smallest dent through to major collision damage, and we do the structural work in-house rather than farming it out.",
    includes: [
      "Minor dents, scuffs and car park damage",
      "Major collision and structural repairs",
      "Plastic, rust and fibreglass repairs",
      "Minor fabrication, modifications and welding",
      "Colour-matched refinishing to blend the repair",
      "Free quotes — drop in, or we can come to you if the car isn't drivable",
    ],
    body: [
      "Our collision repair centre handles the full job: strip down, panel and structural repair, refinishing and reassembly. Because the paintwork happens under the same roof, the repaired panel is matched and blended to the rest of the car rather than simply painted and bolted back on.",
      "Michael, our managing director, has a background in refinishing, estimating and quality control, and personally inspects and approves each stage of the repair. That is the reason the same customers keep coming back — and the reason we are comfortable backing every repair with a full warranty.",
      "If your vehicle isn't safe to drive, don't drive it. We arrange off-site quotations for non-drivable vehicles by appointment, and there is weekend and night drop-off if you can't get here inside business hours.",
    ],
    faqs: [
      {
        question: "Do I have to use the repairer my insurer suggests?",
        answer:
          "If your policy includes choice of repairer, no — you can choose us. We are an approved repairer for all major insurers with choice of repairer policies, and we'll help you through the claim, liaise with your insurance company and arrange the paperwork.",
      },
      {
        question: "My car isn't drivable. Can you still quote it?",
        answer:
          "Yes. We arrange off-site quotations for non-drivable vehicles by appointment — give us a call on (07) 3205 2988 and we'll organise a time.",
      },
      {
        question: "Is the repair guaranteed?",
        answer:
          "Every repair carries our full repair warranty. If there is ever a problem, we will fix it.",
      },
    ],
    related: ["spray-painting", "paintless-dent-removal", "welding-and-fibreglass"],
  },

  {
    slug: "spray-painting",
    name: "Spray painting & resprays",
    shortName: "Spray painting",
    excerpt:
      "Waterborne refinishing on the Akzo Nobel Sikkens system — from a single blended panel to a full respray.",
    image: "/images/feature-respray.webp",
    imageAlt: "A freshly refinished red hatchback, front quarter and headlight",
    intro:
      "Paint is where a repair is either invisible or obvious. Our refinishing specialists work on the Akzo Nobel Sikkens computerised premium system using environmentally friendly waterborne materials, and our team keeps its training current as refinishing technology changes.",
    includes: [
      "Single panel repairs blended into the surrounding paint",
      "Full resprays and colour changes",
      "Computerised colour matching on the Sikkens system",
      "Environmentally friendly waterborne materials",
      "Daily drivers through to prestige and custom vehicles",
      "Extra-large spray booth for oversized vehicles",
    ],
    body: [
      "Colour matching is the hard part, particularly on modern multi-layer finishes. The Sikkens system lets us mix to the vehicle's exact formula and then tint to the panel in front of us, because a car that has spent ten Queensland summers outside is never quite the colour it left the factory.",
      "Our spray booth is oversized, which means the work isn't limited to cars. Commercial vehicles, boats, caravans, buses and larger transport all fit — see truck and commercial vehicles for more on that side of the shop.",
      "We refinish daily drivers and prestige vehicles alike, and the same standard applies to both.",
    ],
    faqs: [
      {
        question: "Will the new paint match the rest of my car?",
        answer:
          "That's the job. We mix to the vehicle's own formula on the Sikkens system and then blend into the adjacent panels so there is no hard edge between old and new paint.",
      },
      {
        question: "What is waterborne paint?",
        answer:
          "It's a refinishing material that uses water rather than solvent as the carrier — far better environmentally, and it's what the premium Sikkens system we run is built around.",
      },
    ],
    related: ["smash-repairs", "custom-paint", "colour-coding"],
  },

  {
    slug: "paintless-dent-removal",
    name: "Paintless dent removal",
    shortName: "Dent removal",
    excerpt:
      "Reshaping dented panels from behind, leaving the original factory finish completely untouched.",
    image: "/images/gallery/truck-panel-damage.webp",
    imageAlt: "A dented panel on a white vehicle before repair",
    intro:
      "When the paint surface is unbroken, there is often no need to repaint anything at all. Paintless dent removal (PDR) works the metal back into shape from behind the panel, so the original factory finish stays exactly as it is.",
    includes: [
      "Hail damage",
      "Minor creases and bodyline damage",
      "Car park dents and door dings",
      "No filler, no repainting, no colour matching required",
    ],
    body: [
      "PDR is the right answer whenever the dent hasn't cracked or chipped the paint. Because nothing is sanded, filled or resprayed, the panel keeps the finish it left the factory with — which matters for resale, and it's usually quicker and cheaper than a conventional repair.",
      "It isn't right for everything. If the paint is broken, or the metal is stretched too far, a conventional panel repair and refinish will give a better result — and we'll tell you which one your car needs rather than selling you the one we'd prefer to do.",
      "Hail is the classic case: a bonnet and roof full of small dents with the paint intact is exactly what PDR is for.",
    ],
    faqs: [
      {
        question: "How do I know if my dent can be fixed this way?",
        answer:
          "As a rule of thumb, if the paint isn't cracked, chipped or scratched, it's worth looking at. Bring it in or send us a photo through the quote form and we'll tell you.",
      },
      {
        question: "Do you handle hail damage?",
        answer:
          "Yes — hail is one of the most common PDR jobs, and where the paint is intact the panels can usually be reshaped without any refinishing at all.",
      },
    ],
    related: ["smash-repairs", "detailing", "spray-painting"],
  },

  {
    slug: "truck-and-commercial",
    name: "Truck, bus & commercial",
    shortName: "Truck & commercial",
    excerpt:
      "An oversized spray booth that takes trucks, buses, caravans and boats — plus fleet and pre-delivery work.",
    image: "/images/feature-truck.webp",
    imageAlt: "The front of a white Fuso truck in for repair",
    intro:
      "Most panel shops are built around cars, so anything larger becomes someone else's problem. Our spray booth is extra large, which means trucks, buses, caravans, boats and commercial vehicles are all jobs we can actually take.",
    includes: [
      "Light truck and commercial vehicle repairs",
      "Buses, caravans and boats",
      "Fleet repairs and rectifications",
      "Pre-delivery work",
      "Pre-sale and pre-auction detailing for fleet vehicles",
      "Full resprays on oversized vehicles",
    ],
    body: [
      "We work with private, insurance, commercial, fleet and pre-delivery clients, and fleet operators tend to care about two things above all: that the vehicle comes back right, and that it comes back when we said it would. That's the whole idea behind doing it right the first time, on time.",
      "Pre-sale and pre-auction detailing is available for fleet vehicles, which is often the difference between a vehicle presenting as ex-fleet and presenting as well looked after.",
      "If you're running a fleet and want to talk about ongoing work rather than a single job, call the shop and ask for Michael.",
    ],
    faqs: [
      {
        question: "How large a vehicle can you actually fit?",
        answer:
          "Our extra-large booth takes trucks, buses, caravans, boats and commercial vehicles. If you're not sure whether yours will fit, call us with the dimensions on (07) 3205 2988.",
      },
      {
        question: "Do you do fleet and pre-delivery work?",
        answer:
          "Yes — fleet, commercial and pre-delivery clients are a significant part of what we do, alongside private and insurance work.",
      },
    ],
    related: ["spray-painting", "protection-liners", "smash-repairs"],
  },

  {
    slug: "protection-liners",
    name: "Raptor protection liners",
    shortName: "Protection liners",
    excerpt:
      "A super tough, UV-stable protective coating for trays, vans, trailers and boats — tintable and anti-slip.",
    image: "/images/feature-liner.webp",
    imageAlt: "A ute tray finished in black Raptor protective liner",
    intro:
      "Raptor is a super tough, highly durable, UV-stable coating that takes the punishment so your tray doesn't. It resists rust and corrosion, it's tintable, and the finish is anti-slip — which matters the first time you climb into a wet tray.",
    includes: [
      "Ute trays and tubs",
      "Vans, trailers and boats",
      "Rust and corrosion resistance",
      "UV stable — it doesn't chalk out in the Queensland sun",
      "Tintable to your vehicle's colour",
      "Anti-slip textured finish",
    ],
    body: [
      "A tray liner is the cheapest insurance on a working vehicle. Tools, gravel, tie-downs and wet boots all take their toll, and once the paint is through, corrosion follows quickly.",
      "Because Raptor is tintable, it doesn't have to be black. Colour-matching the liner to the vehicle looks deliberate rather than aftermarket, and it's the option most people take once they know it exists.",
      "It isn't only for utes. Vans, trailers and boats all benefit from the same coating, anywhere a surface takes more abuse than paint was designed for.",
    ],
    faqs: [
      {
        question: "Can the liner match my vehicle's colour?",
        answer:
          "Yes. Raptor is tintable, so we can colour it to your vehicle rather than defaulting to black.",
      },
      {
        question: "Will it hold up in the sun?",
        answer:
          "It's a UV-stable coating, which is exactly why it suits a Queensland vehicle that lives outside.",
      },
    ],
    related: ["colour-coding", "truck-and-commercial", "custom-paint"],
  },

  {
    slug: "custom-paint",
    name: "Custom paint & airbrushing",
    shortName: "Custom paint",
    excerpt:
      "Want to stand out from the crowd? Full custom work on cars, bikes and watercraft, with airbrushing artists on hand.",
    image: "/images/feature-paint.webp",
    imageAlt: "Open tins of brightly coloured automotive paint",
    intro:
      "Not every job is putting something back the way it was. If you want your vehicle to look like nothing else on the road, we do full custom work on cars, motorbikes and watercraft — and we have airbrushing artists to do the parts a spray gun can't.",
    includes: [
      "Full custom paint schemes",
      "Airbrushing by specialist artists",
      "Pinstriping",
      "Hydro graphics",
      "Cars, motorbikes and watercraft",
      "Wraps",
    ],
    body: [
      "Custom work is a conversation before it is a quote. What the vehicle is, what condition it's in, and what you're picturing all change the approach — so the first step is talking to our team about your options.",
      "We work alongside vehicle specialists for custom airbrushing, powder coating and protection liners, which means a custom build can be pulled together in one place instead of being carted between four different shops.",
      "Motorbikes are a specialty of their own — see motorcycle paintwork.",
    ],
    faqs: [
      {
        question: "Can you paint a design, not just a colour?",
        answer:
          "Yes. We have airbrushing artists for one-off designs, and we also do pinstriping and hydro graphics.",
      },
      {
        question: "Do you work on boats and jet skis?",
        answer:
          "Yes — custom work covers vehicles, motorbikes and watercraft, and the oversized booth means size usually isn't the problem.",
      },
    ],
    related: ["motorcycle-paintwork", "spray-painting", "vehicle-restorations"],
  },

  {
    slug: "motorcycle-paintwork",
    name: "Motorcycle repairs & custom paintwork",
    shortName: "Motorcycles",
    excerpt:
      "One-of-a-kind paint schemes for bikes, with hydro graphics, airbrushing and pinstriping options.",
    image: "/images/feature-motorbike.webp",
    imageAlt: "A green and blue Kawasaki ZXR sportbike",
    intro:
      "Bikes get looked at far more closely than cars, and a tank sits at eye level. We do motorcycle repairs and one-of-a-kind custom paintwork, with hydro graphics, airbrushing and pinstriping available.",
    includes: [
      "Motorcycle repairs",
      "One-off custom paint schemes",
      "Hydro graphics",
      "Airbrushing",
      "Pinstriping",
      "Tanks, fairings and guards",
    ],
    body: [
      "Because bike panels are small, curved and seen up close, the preparation matters more than it does on a car door. There is nowhere to hide a wave in a tank.",
      "Whether it's a repair after a drop or a complete rethink of the paint scheme, talk to our team about what's possible before you commit to a design.",
    ],
    faqs: [
      {
        question: "Can you match my bike's existing paint for a repair?",
        answer:
          "Yes — the same computerised Sikkens colour matching we use on cars applies to bikes.",
      },
      {
        question: "What are hydro graphics?",
        answer:
          "It's a process for applying a pattern — carbon weave, timber grain and similar — around a three-dimensional part. We offer it on bikes as well as on trim and accessories.",
      },
    ],
    related: ["custom-paint", "spray-painting", "colour-coding"],
  },

  {
    slug: "detailing",
    name: "Detailing, cut & polish",
    shortName: "Detailing",
    excerpt:
      "Professional paint correction that lifts marks, scratches and oxidation — inside and out.",
    image: "/images/gallery/detail-carbon-brake.webp",
    imageAlt: "Close detail of a carbon fibre panel and red brake caliper",
    intro:
      "Most cars look considerably better than their owners think they can. A proper cut and polish removes the marks, fine scratches and oxidation that dull the paint, and the difference is usually dramatic.",
    includes: [
      "Cut and polish paint correction",
      "Removal of marks, scratches and oxidation",
      "Interior and exterior detailing",
      "Paint touch-up for stone chips and scratches",
      "Pre-sale and pre-auction presentation",
    ],
    body: [
      "Oxidation is what makes an older finish look chalky and flat. Cutting removes that dead layer and polishing brings the gloss back, and on a car that has never been corrected the result can look close to new paint.",
      "For the chips a polish can't fix, we offer paint touch-up on stone chips and scratches — the cheap fix that stops a chip becoming rust.",
      "Interior and exterior options are both available, and pre-sale detailing is worth doing before you photograph a car for sale.",
    ],
    faqs: [
      {
        question: "Will a cut and polish remove every scratch?",
        answer:
          "It removes marks, fine scratches and oxidation held in the top of the clear coat. A scratch you can catch a fingernail in is through the clear and needs touch-up or refinishing instead.",
      },
      {
        question: "Do you detail the interior too?",
        answer: "Yes — interior and exterior detailing options are both available.",
      },
    ],
    related: ["paintless-dent-removal", "spray-painting", "colour-coding"],
  },

  {
    slug: "glass-replacement",
    name: "Windscreen & glass replacement",
    shortName: "Glass",
    excerpt:
      "Chipped or cracked? Windscreens, side windows, rear screens and mirrors, fitted by an expert technician.",
    image: "/images/gallery/respray-blue-quarter.webp",
    imageAlt: "The glass and quarter panel of a blue vehicle after repair",
    intro:
      "A chip becomes a crack at the worst possible moment, usually on a hot day with the air conditioning on. We repair and replace windscreens, side windows, rear screens and mirrors using quality glass, fitted by an expert technician.",
    includes: [
      "Windscreen chip repair",
      "Windscreen replacement",
      "Side windows and rear screens",
      "Mirrors",
      "Quality glass, expert refitting",
    ],
    body: [
      "Glass is often part of a larger repair — a collision that damages a windscreen usually damaged something else too — so having it handled in the same place as the panel and paint work saves you a second booking.",
      "If your windscreen is chipped or in need of replacement, speak to our trained team to discuss your options.",
    ],
    faqs: [
      {
        question: "Can a chip be repaired instead of replacing the whole screen?",
        answer:
          "Sometimes — it depends on the size and where it sits in the screen. Our team will look at it and tell you which option applies.",
      },
      {
        question: "Can glass be done as part of an insurance repair?",
        answer:
          "Yes. If glass is part of a claim we'll include it and handle the paperwork with your insurer.",
      },
    ],
    related: ["smash-repairs", "window-tinting", "detailing"],
  },

  {
    slug: "colour-coding",
    name: "Colour coding & coatings",
    shortName: "Colour coding",
    excerpt:
      "Bumpers, bull bars, canopies, spoilers, wheels and badges — colour coded, powder coated or ceramic finished.",
    image: "/images/feature-wheels.webp",
    imageAlt: "A machine-finished alloy wheel on a vehicle",
    intro:
      "Colour coding is the cheapest way to make a vehicle look like it was ordered that way rather than accessorised afterwards. Bumper bars, bull bars, canopies, spoilers, wheels and badges can all be finished to match — or deliberately contrast.",
    includes: [
      "Bumper bars and bull bars",
      "Canopies and spoilers",
      "Wheels and badges",
      "Powder coating",
      "Ceramic and HPC coatings",
      "Hydro graphics",
    ],
    body: [
      "Different parts want different processes. Powder coating suits bull bars and wheels that take physical abuse; ceramic and HPC coatings suit components that get hot; hydro graphics suit trim where you want a pattern rather than a colour.",
      "Speak to our trained team to discuss which finish suits the part and how you use the vehicle — a bar on a work ute and a bar on a weekend tourer are not the same brief.",
      "Wheels can also be repaired, replaced and aligned — see wheels, tyres and alignment.",
    ],
    faqs: [
      {
        question: "Can you colour code a bull bar to my paint?",
        answer:
          "Yes — bull bars, bumpers, canopies, spoilers, wheels and badges can all be colour coded to the vehicle.",
      },
      {
        question: "What's the difference between powder coating and paint?",
        answer:
          "Powder coating is applied dry and cured, which gives a tougher finish for parts that take knocks — bars and wheels especially. We offer both, plus ceramic and HPC coatings.",
      },
    ],
    related: ["protection-liners", "wheels-tyres-alignment", "custom-paint"],
  },

  {
    slug: "vehicle-restorations",
    name: "Vehicle restorations",
    shortName: "Restorations",
    excerpt:
      "From a basic tidy up to a concourse restoration, with custom fabrication and body modifications.",
    image: "/images/gallery/smash-stripdown.webp",
    imageAlt: "A vehicle stripped to bare panels during restoration",
    intro:
      "Restorations run from a basic tidy up through to concourse standard, and the right level depends entirely on the car and on what you want from it at the end. Custom fabrication and body modifications are arranged based on the vehicle's condition and the owner's expectations.",
    includes: [
      "Basic tidy ups through to concourse restorations",
      "Custom fabrication",
      "Body modifications",
      "Rust repairs",
      "Full resprays",
      "Panel work and welding",
    ],
    body: [
      "The honest conversation at the start saves money later. A car being restored to drive and enjoy needs different decisions to a car being restored to be judged, and the two budgets are not comparable.",
      "Rust is almost always the deciding factor, and it is almost always worse than it looks from the outside. We repair rust, fabricate replacement sections and weld in steel, aluminium and brass.",
      "Bring the car in, or send photos through the quote form, and we'll talk through what's realistic.",
    ],
    faqs: [
      {
        question: "Do you take on partial restorations?",
        answer:
          "Yes — it ranges from a basic tidy up to a full concourse restoration, and plenty of jobs sit in between.",
      },
      {
        question: "Can you fabricate panels that aren't available?",
        answer:
          "Custom fabrication and body modifications are arranged based on the vehicle's condition and what you're after.",
      },
    ],
    related: ["welding-and-fibreglass", "spray-painting", "custom-paint"],
  },

  {
    slug: "welding-and-fibreglass",
    name: "Welding, fibreglass & plastic repairs",
    shortName: "Welding & fibreglass",
    excerpt:
      "Steel, aluminium and brass welding, plus substrate repairs to plastic and fibreglass. Free quotes.",
    image: "/images/gallery/smash-red-rear.webp",
    imageAlt: "A rear quarter panel repair in progress on a red vehicle",
    intro:
      "Modern vehicles are an assembly of very different materials, and each one wants a different repair. We weld steel, aluminium and brass, and we repair plastic and fibreglass substrates rather than defaulting to replacement.",
    includes: [
      "Steel, aluminium and brass welding",
      "Plastic repairs",
      "Fibreglass repairs",
      "Substrate repairs",
      "Minor fabrication and modifications",
      "Free quotations",
    ],
    body: [
      "Repairing a plastic bumper properly is often far better value than replacing it, and on an older vehicle a replacement part may not be available at all.",
      "Fibreglass turns up on everything from body kits to boats, and it needs a different approach again — the repair has to be structural, not cosmetic, or it will telegraph through the paint later.",
      "Free quotations are available on all of it.",
    ],
    faqs: [
      {
        question: "Can a cracked plastic bumper be repaired?",
        answer:
          "Usually, yes. We repair plastic substrates, which is often better value than a replacement part — and on older vehicles, replacements can be hard to source.",
      },
      {
        question: "Do you weld aluminium?",
        answer: "Yes — steel, aluminium and brass.",
      },
    ],
    related: ["smash-repairs", "vehicle-restorations", "spray-painting"],
  },

  {
    slug: "window-tinting",
    name: "Window tinting",
    shortName: "Window tinting",
    excerpt:
      "UV protection, glare reduction and privacy, from clear film through to the darkest legal tint.",
    image: "/images/gallery/colour-change-commodore.webp",
    imageAlt: "A dark vehicle with tinted windows",
    intro:
      "In a Queensland summer, tint is not a cosmetic decision. It cuts UV, reduces glare and drops the heat inside the car, and it adds privacy as a side effect. Our range runs from clear film through to 35%, the darkest legal tint.",
    includes: [
      "UV protection",
      "Glare reduction",
      "Heat reduction",
      "Added privacy",
      "Clear through to 35% — the darkest legal tint",
    ],
    body: [
      "Heat reduction is the reason most people finally do it. A car parked in the open all day is measurably cooler inside with tint on the glass, and the interior trim and dash suffer far less UV damage over the years.",
      "We'll talk you through which level suits the vehicle and stay inside what's legal.",
    ],
    faqs: [
      {
        question: "How dark can I legally go?",
        answer:
          "Our range goes to 35%, which is the darkest legal tint. We'll keep you compliant.",
      },
      {
        question: "Does tint actually reduce heat?",
        answer:
          "Yes — heat reduction is one of the main reasons to fit it in this climate, alongside UV protection and glare.",
      },
    ],
    related: ["glass-replacement", "detailing", "colour-coding"],
  },

  {
    slug: "wheels-tyres-alignment",
    name: "Wheels, tyres & alignment",
    shortName: "Wheels & tyres",
    excerpt:
      "Tyre and wheel repairs, replacements and alignments — plus wheel customisation and coatings.",
    image: "/images/gallery/wheels-alloy.webp",
    imageAlt: "A multi-spoke alloy wheel and tyre",
    intro:
      "Wheels take the worst of the road and they are the first thing that makes a tidy car look tired. We repair and replace tyres and wheels, carry out wheel alignments, and customise wheels with powder coating, colour coding, HPC coatings and hydro graphics.",
    includes: [
      "Tyre and wheel repairs",
      "Tyre and wheel replacement",
      "Wheel alignment",
      "Powder coating",
      "Colour coding",
      "HPC coatings and hydro graphics",
    ],
    body: [
      "Gutter rash on an alloy is repairable far more often than people assume, and refinishing a set of wheels costs a fraction of replacing them.",
      "An alignment after panel or suspension work isn't optional — it's what stops a repaired car chewing out a new set of tyres.",
    ],
    faqs: [
      {
        question: "Can kerbed alloys be repaired?",
        answer:
          "Usually — we repair wheels as well as replace them, and they can be refinished by powder coating or colour coding at the same time.",
      },
      {
        question: "Do you do wheel alignments?",
        answer: "Yes, wheel alignments are available.",
      },
    ],
    related: ["colour-coding", "mechanical-and-electrical", "detailing"],
  },

  {
    slug: "mechanical-and-electrical",
    name: "Auto electrical, mechanical & air conditioning",
    shortName: "Mechanical & electrical",
    excerpt:
      "Electrical repairs and installations, air conditioning service and regas, and general vehicle maintenance.",
    image: "/images/feature-stripdown.webp",
    imageAlt: "A vehicle interior stripped for electrical and trim work",
    intro:
      "A panel shop that can only do panels sends you somewhere else halfway through the job. We handle auto electrical repairs and installations, air conditioning service and regas, and general vehicle maintenance.",
    includes: [
      "Auto electrical repairs",
      "Electrical installations",
      "Air conditioning service and regas",
      "General mechanical repairs",
      "General vehicle maintenance",
    ],
    body: [
      "Collision work regularly turns up electrical damage — looms, sensors and lighting all sit behind the panels that took the hit — so having it dealt with in-house keeps the repair in one place.",
      "For all of your vehicle's maintenance and mechanical matters, give us a call or pop in.",
    ],
    faqs: [
      {
        question: "Can you regas my air conditioning?",
        answer:
          "Yes — air conditioning service and regas are both available.",
      },
      {
        question: "Do you do general servicing?",
        answer:
          "We handle general vehicle maintenance and mechanical repairs. Call us to talk through what your vehicle needs.",
      },
    ],
    related: ["wheels-tyres-alignment", "smash-repairs", "glass-replacement"],
  },
];

export const serviceBySlug = (slug: string): Service | undefined =>
  services.find((service) => service.slug === slug);

export const serviceSlugs = services.map((service) => service.slug);

/**
 * Everything else on their service list that doesn't warrant its own page.
 * Shown on /services so the full capability is visible without inventing copy.
 */
export const additionalServices: string[] = [
  "Hail damage",
  "Rust repairs",
  "Vehicle wraps",
  "Pinstriping",
  "Powder coating",
  "Hydro graphics",
  "Ceramic & HPC coatings",
  "Bull bars & canopies",
  "Body kits fitted",
  "Interior trim replacement",
  "Hood linings",
  "Plastic repairs",
  "Vehicle rectifications",
  "Pre-delivery preparation",
  "Pre-sale & pre-auction detailing",
];

/** Hood linings get a mention of their own because of the turnaround claim. */
export const hoodLiningsNote =
  "Replacement hood linings in the original colour or a custom style, typically fitted within hours.";
