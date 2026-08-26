export type WasteCategory = "recyclable" | "organic" | "hazardous" | "general";

export const CATEGORY_META: Record<
  WasteCategory,
  { label: string; bin: string; tone: string; ring: string; text: string; blurb: string }
> = {
  recyclable: {
    label: "Recyclable",
    bin: "Blue / dry recycling bin",
    tone: "bg-recyclable/12",
    ring: "border-recyclable/40",
    text: "text-recyclable",
    blurb: "Clean, dry materials that a recovery facility can turn back into products.",
  },
  organic: {
    label: "Organic",
    bin: "Green / wet waste bin",
    tone: "bg-organic/12",
    ring: "border-organic/40",
    text: "text-organic",
    blurb: "Food and garden waste that should be composted instead of landfilled.",
  },
  hazardous: {
    label: "Hazardous",
    bin: "Red / special collection point",
    tone: "bg-hazardous/12",
    ring: "border-hazardous/40",
    text: "text-hazardous",
    blurb: "Batteries, e-waste, chemicals and medicines that need dedicated handling.",
  },
  general: {
    label: "General",
    bin: "Grey / landfill bin",
    tone: "bg-generalwaste/12",
    ring: "border-generalwaste/40",
    text: "text-generalwaste",
    blurb: "Non-recyclable rejects. Reduce these first — they end up in landfill.",
  },
};
