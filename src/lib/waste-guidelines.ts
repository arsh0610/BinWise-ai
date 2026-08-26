/**
 * Lightweight retrieval corpus of waste-management guidance.
 *
 * Sources paraphrased from widely published municipal and agency guidance
 * (US EPA recycling basics, EU Waste Framework Directive categories,
 * India Solid Waste Management Rules 2016, Basel Convention on hazardous waste).
 * Retrieval is keyword-overlap based and runs on the server before the model
 * call, so the assistant answers from these snippets rather than memory alone.
 */

export type Guideline = {
  id: string;
  source: string;
  category: string;
  keywords: string[];
  text: string;
};

export const GUIDELINES: Guideline[] = [
  {
    id: "pet-bottles",
    source: "US EPA — Recycling Basics",
    category: "Recyclable",
    keywords: ["plastic", "bottle", "pet", "water", "soda", "cap", "container", "milk", "jug"],
    text: "PET (#1) and HDPE (#2) bottles are widely recyclable. Empty all liquid, give a quick rinse, and leave the cap screwed back on so it is not lost in sorting. Do not crush flat if your facility uses optical sorting.",
  },
  {
    id: "plastic-bags",
    source: "US EPA — Recycling Basics",
    category: "General",
    keywords: ["bag", "film", "wrapper", "cling", "pouch", "polybag", "packet", "sachet", "chips"],
    text: "Thin plastic film, carrier bags, chip packets and multilayer sachets jam sorting machinery and are not accepted in kerbside recycling. Return clean film to a store drop-off programme where available, otherwise place in general waste.",
  },
  {
    id: "paper-card",
    source: "US EPA — Paper Recycling",
    category: "Recyclable",
    keywords: ["paper", "cardboard", "carton", "newspaper", "box", "magazine", "envelope", "book"],
    text: "Dry paper and flattened cardboard are recyclable. Remove tape and plastic windows. Grease-soaked or food-stained paper (pizza boxes, used napkins) belongs with organic/compost waste because oil contaminates the paper pulp.",
  },
  {
    id: "glass",
    source: "US EPA — Glass Recycling",
    category: "Recyclable",
    keywords: ["glass", "jar", "bottle", "wine", "beer"],
    text: "Glass jars and bottles are endlessly recyclable. Rinse, keep lids separate (metal lids go with metals). Broken glass, drinking glasses, mirrors, Pyrex and ceramics have a different melting point — wrap them and put them in general waste to protect collection staff.",
  },
  {
    id: "metals",
    source: "US EPA — Metal Recycling",
    category: "Recyclable",
    keywords: ["can", "tin", "aluminium", "aluminum", "metal", "foil", "steel", "cutlery"],
    text: "Aluminium and steel cans, clean foil and metal lids are high-value recyclables. Rinse food residue and scrunch foil into a ball at least the size of a golf ball so sorters can detect it. Aerosol cans must be fully empty and are handled as hazardous if pressurised.",
  },
  {
    id: "food-organics",
    source: "India SWM Rules 2016 — Wet Waste",
    category: "Organic",
    keywords: [
      "food",
      "peel",
      "vegetable",
      "fruit",
      "leftover",
      "tea",
      "coffee",
      "egg",
      "shell",
      "garden",
      "leaves",
      "flower",
      "banana",
      "rice",
      "bread",
    ],
    text: "Kitchen and garden waste is wet/organic waste: fruit and vegetable peels, cooked leftovers, tea and coffee grounds, eggshells, leaves and flowers. Keep it in a separate lidded bin, drain excess liquid, and compost it or hand it to the wet-waste collection daily to avoid odour and methane from landfill.",
  },
  {
    id: "meat-dairy",
    source: "Municipal composting guidance",
    category: "Organic",
    keywords: ["meat", "bone", "fish", "dairy", "cheese", "oil", "grease"],
    text: "Meat, bones, fish and dairy can go into municipal industrial composting or anaerobic digestion but attract pests in home compost bins. Cooking oil should never go down the drain — collect it in a sealed container for an oil collection point.",
  },
  {
    id: "batteries",
    source: "Basel Convention / E-waste rules",
    category: "Hazardous",
    keywords: ["battery", "batteries", "cell", "lithium", "aa", "power", "bank", "charger"],
    text: "Batteries are hazardous waste and must never enter household bins — damaged lithium cells start fires in collection trucks. Tape the terminals of lithium and button cells, store them in a non-metal container, and take them to a retailer take-back box or a hazardous/e-waste collection point.",
  },
  {
    id: "ewaste",
    source: "E-Waste Management Rules",
    category: "Hazardous",
    keywords: [
      "phone",
      "laptop",
      "computer",
      "electronic",
      "cable",
      "tv",
      "monitor",
      "appliance",
      "printer",
      "headphone",
      "mouse",
      "keyboard",
    ],
    text: "Electronics are e-waste: they contain recoverable gold, copper and rare earths alongside lead and mercury. Wipe personal data, remove the battery if it is removable, and hand the device to an authorised e-waste recycler, producer take-back scheme, or municipal e-waste drive.",
  },
  {
    id: "chemicals",
    source: "US EPA — Household Hazardous Waste",
    category: "Hazardous",
    keywords: [
      "paint",
      "solvent",
      "pesticide",
      "bleach",
      "cleaner",
      "chemical",
      "thinner",
      "acid",
      "fuel",
      "aerosol",
      "nail",
      "polish",
    ],
    text: "Paints, solvents, pesticides, strong cleaners and aerosols are household hazardous waste. Keep them in their original labelled container, never mix products, never pour them down a drain, and deliver them to a household hazardous waste facility or collection event.",
  },
  {
    id: "bulbs-thermometers",
    source: "US EPA — Mercury-containing products",
    category: "Hazardous",
    keywords: ["bulb", "cfl", "fluorescent", "tube", "thermometer", "mercury", "lamp", "led"],
    text: "CFL and fluorescent tubes contain mercury vapour: do not break them, seal them in the original sleeve and take them to a lamp recycling point. If one breaks, ventilate the room, avoid vacuuming, and pick up fragments with stiff card into a sealed jar.",
  },
  {
    id: "medical",
    source: "Bio-Medical Waste Rules",
    category: "Hazardous",
    keywords: [
      "medicine",
      "pill",
      "syringe",
      "needle",
      "sharp",
      "mask",
      "bandage",
      "medical",
      "expired",
      "tablet",
    ],
    text: "Sharps, expired medicines and contaminated dressings are biomedical waste. Put needles in a puncture-proof sharps container and return unused medicine to a pharmacy take-back — flushing medicine contaminates water. Used masks and dressings should be bagged separately and marked before general collection.",
  },
  {
    id: "textiles",
    source: "EU Waste Framework Directive",
    category: "General",
    keywords: ["clothes", "cloth", "textile", "shoe", "fabric", "cotton", "jeans", "toy"],
    text: "Wearable clothes and shoes should be reused: donate or use a textile bank. Worn-out textiles go to a textile recycling collection where available; only heavily soiled items belong in general waste. Never place textiles in the mixed recycling bin.",
  },
  {
    id: "hygiene",
    source: "Municipal sanitary waste guidance",
    category: "General",
    keywords: [
      "diaper",
      "nappy",
      "sanitary",
      "napkin",
      "tissue",
      "wipe",
      "razor",
      "toothbrush",
      "cigarette",
      "straw",
      "styrofoam",
      "thermocol",
    ],
    text: "Sanitary and hygiene items, wet wipes, cigarette butts, straws, and expanded polystyrene are non-recyclable general/dry-reject waste. Wrap sanitary waste in paper or the provided pouch and mark the bag so handlers are protected. Never flush wipes.",
  },
  {
    id: "tetra",
    source: "Carton Council guidance",
    category: "Recyclable",
    keywords: ["tetra", "carton", "juice", "milk", "beverage", "pack"],
    text: "Beverage cartons (paper-aluminium-plastic laminates) are recyclable only in programmes that accept cartons. Empty, flatten, and push the straw and cap in with the carton if instructed locally; otherwise treat as general waste.",
  },
  {
    id: "construction",
    source: "C&D Waste Rules",
    category: "General",
    keywords: ["rubble", "concrete", "brick", "tile", "debris", "wood", "plaster"],
    text: "Construction and demolition debris must not go into household bins. Arrange a C&D skip or municipal debris collection so inert material can be crushed and reused as aggregate.",
  },
];

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "my",
  "old",
  "used",
  "into",
  "where",
  "should",
  "i",
  "do",
  "throw",
  "put",
  "of",
  "is",
  "it",
  "this",
  "that",
  "with",
  "and",
  "or",
  "for",
  "to",
  "in",
  "can",
  "what",
  "how",
]);

function tokenize(query: string) {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

/** Keyword-overlap retrieval over the guideline corpus. */
export function retrieveGuidelines(query: string, limit = 5): Guideline[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return GUIDELINES.slice(0, limit);

  const scored = GUIDELINES.map((guideline) => {
    let score = 0;
    for (const token of tokens) {
      for (const keyword of guideline.keywords) {
        if (keyword === token) score += 3;
        else if (keyword.includes(token) || token.includes(keyword)) score += 1;
      }
      if (guideline.text.toLowerCase().includes(token)) score += 1;
    }
    return { guideline, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, limit).map((entry) => entry.guideline);
  return top.length > 0 ? top : GUIDELINES.slice(0, limit);
}

export function formatGuidelineContext(guidelines: Guideline[]) {
  return guidelines
    .map(
      (guideline, index) =>
        `[${index + 1}] (${guideline.category} — ${guideline.source})\n${guideline.text}`,
    )
    .join("\n\n");
}
