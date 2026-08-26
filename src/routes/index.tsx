import { createFileRoute } from "@tanstack/react-router";
import { Leaf, MessageCircle, Recycle, ScanLine, ShieldCheck } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WasteIdentifier } from "@/components/waste/WasteIdentifier";
import { WasteChat } from "@/components/waste/WasteChat";
import { CATEGORY_META, type WasteCategory } from "@/components/waste/category-meta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BinWise — AI Waste Segregation Assistant" },
      {
        name: "description",
        content:
          "Describe or photograph any waste item and get its bin category plus step-by-step disposal instructions grounded in official recycling guidelines.",
      },
      { property: "og:title", content: "BinWise — AI Waste Segregation Assistant" },
      {
        property: "og:description",
        content:
          "Identify recyclable, organic, hazardous or general waste from text or a photo, and learn exactly how to dispose of it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SDGS = [
  { code: "SDG 12", label: "Responsible Consumption & Production" },
  { code: "SDG 11", label: "Sustainable Cities & Communities" },
  { code: "SDG 13", label: "Climate Action" },
];

function Index() {
  return (
    <main className="min-h-screen bg-hero">
      <header className="mx-auto max-w-6xl px-5 pt-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-leaf text-primary-foreground shadow-soft">
              <Recycle className="size-5" />
            </span>
            <div>
              <p className="font-display text-lg leading-none font-semibold">BinWise</p>
              <p className="text-xs text-muted-foreground">AI waste segregation assistant</p>
            </div>
          </div>
          <div className="hidden gap-2 sm:flex">
            {SDGS.map((sdg) => (
              <span
                key={sdg.code}
                title={sdg.label}
                className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium"
              >
                {sdg.code}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pt-14 pb-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground">
          <Leaf className="size-3.5 text-primary" />
          Grounded in EPA, EU and SWM Rules guidance
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-semibold sm:text-6xl">
          Never guess which bin it goes in again.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Type an item or upload a photo. BinWise classifies it as recyclable, organic, hazardous or
          general waste and tells you exactly how to prepare and dispose of it — so recycling
          actually works and less ends up in landfill.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { icon: ScanLine, title: "Photo or text input", body: "Multimodal identification of the item." },
            { icon: ShieldCheck, title: "Four-bin classification", body: "With safety and contamination warnings." },
            { icon: MessageCircle, title: "Ask follow-ups", body: "Conversational answers from the guidelines." },
          ].map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-soft">
              <feature.icon className="size-5 text-primary" />
              <p className="mt-3 text-sm font-semibold">{feature.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <Tabs defaultValue="identify" className="space-y-6">
          <TabsList className="h-11 rounded-full bg-secondary/70 p-1">
            <TabsTrigger value="identify" className="rounded-full px-5">
              Identify an item
            </TabsTrigger>
            <TabsTrigger value="ask" className="rounded-full px-5">
              Ask the assistant
            </TabsTrigger>
          </TabsList>
          <TabsContent value="identify">
            <WasteIdentifier />
          </TabsContent>
          <TabsContent value="ask">
            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              <WasteChat />
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">The four bins</h2>
                {(Object.keys(CATEGORY_META) as WasteCategory[]).map((key) => (
                  <div
                    key={key}
                    className={`rounded-xl border p-4 ${CATEGORY_META[key].ring} ${CATEGORY_META[key].tone}`}
                  >
                    <p className={`text-sm font-semibold ${CATEGORY_META[key].text}`}>
                      {CATEGORY_META[key].label} — {CATEGORY_META[key].bin}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{CATEGORY_META[key].blurb}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <footer className="border-t border-border/70 bg-card/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            BinWise gives general guidance — always confirm details with your local collection
            scheme.
          </p>
          <p>SDG 12 · SDG 11 · SDG 13</p>
        </div>
      </footer>
    </main>
  );
}
