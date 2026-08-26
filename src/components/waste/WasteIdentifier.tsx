import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { AlertTriangle, ImageUp, Leaf, Loader2, Search, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { identifyWaste, type WasteResult } from "@/lib/waste.functions";
import { CATEGORY_META, type WasteCategory } from "./category-meta";

const EXAMPLES = [
  "Used plastic water bottle",
  "Banana peels and tea leaves",
  "Old AA battery",
  "Greasy pizza box",
  "Broken CFL bulb",
];

const MAX_BYTES = 6 * 1024 * 1024;

export function WasteIdentifier() {
  const [item, setItem] = useState("");
  const [image, setImage] = useState<{ dataUrl: string; name: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const identify = useServerFn(identifyWaste);
  const mutation = useMutation<WasteResult, Error, void>({
    mutationFn: async () =>
      (await identify({
        data: { item: item.trim() || undefined, imageDataUrl: image?.dataUrl },
      })) as WasteResult,
  });

  const handleFile = (file: File | undefined) => {
    setFileError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFileError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setFileError("Image is larger than 6 MB. Try a smaller photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage({ dataUrl: String(reader.result), name: file.name });
    reader.readAsDataURL(file);
  };

  const disabled = mutation.isPending || (!item.trim() && !image);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <Card className="border-border/70 p-6 shadow-soft">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (!disabled) mutation.mutate();
          }}
        >
          <div className="space-y-2">
            <label htmlFor="waste-item" className="text-sm font-medium">
              What are you throwing away?
            </label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="waste-item"
                value={item}
                onChange={(event) => setItem(event.target.value)}
                placeholder="e.g. Used plastic water bottle"
                className="h-12 pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setItem(example)}
                  className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-secondary-foreground transition-colors hover:bg-secondary"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Or identify it from a photo</span>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            {image ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <img src={image.dataUrl} alt={image.name} className="h-44 w-full object-cover" />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 size-8"
                  onClick={() => {
                    setImage(null);
                    if (fileInput.current) fileInput.current.value = "";
                  }}
                >
                  <X className="size-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 text-sm text-muted-foreground transition-colors hover:bg-secondary/70"
              >
                <ImageUp className="size-6" />
                Upload or take a photo of the item
              </button>
            )}
            {fileError && <p className="text-xs text-destructive">{fileError}</p>}
          </div>

          <Button type="submit" size="lg" disabled={disabled} className="w-full">
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Analysing…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Identify waste category
              </>
            )}
          </Button>
        </form>
      </Card>

      <div>
        {mutation.isError && (
          <Card className="border-destructive/40 bg-destructive/5 p-6">
            <p className="flex items-start gap-2 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              {mutation.error.message || "Something went wrong. Please try again."}
            </p>
          </Card>
        )}

        {!mutation.isError && !mutation.data && (
          <Card className="flex h-full flex-col justify-center gap-4 border-dashed border-border/70 bg-card/60 p-8">
            <Leaf className="size-8 text-primary" />
            <h3 className="text-lg font-semibold">Your disposal guidance appears here</h3>
            <p className="text-sm text-muted-foreground">
              The assistant classifies the item into one of four bins and returns preparation steps
              grounded in published municipal and agency guidelines.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(Object.keys(CATEGORY_META) as WasteCategory[]).map((key) => (
                <div
                  key={key}
                  className={`rounded-lg border p-3 ${CATEGORY_META[key].ring} ${CATEGORY_META[key].tone}`}
                >
                  <p className={`text-sm font-semibold ${CATEGORY_META[key].text}`}>
                    {CATEGORY_META[key].label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{CATEGORY_META[key].blurb}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {mutation.data && <ResultCard result={mutation.data} />}
      </div>
    </div>
  );
}

function ResultCard({ result }: { result: WasteResult }) {
  const meta = CATEGORY_META[result.category as WasteCategory] ?? CATEGORY_META.general;

  return (
    <Card className={`border p-6 shadow-lift ${meta.ring} ${meta.tone}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">Identified item</p>
          <h3 className="mt-1 text-2xl font-semibold">{result.itemName}</h3>
        </div>
        <span
          className={`rounded-full border bg-card px-3 py-1 text-sm font-semibold ${meta.ring} ${meta.text}`}
        >
          {meta.label} waste
        </span>
      </div>

      <p className="mt-4 text-base">{result.summary}</p>

      <div className="mt-5 rounded-xl border border-border/60 bg-card/80 p-4">
        <p className="text-sm font-semibold">Goes in: {meta.bin}</p>
        <ol className="mt-3 space-y-2">
          {result.steps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {result.warning && (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-hazardous/40 bg-card/80 p-3 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-hazardous" />
          <span>{result.warning}</span>
        </p>
      )}

      <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
        <Leaf className="mt-0.5 size-4 shrink-0 text-primary" />
        {result.impact}
      </p>

      <div className="mt-5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <span className="font-medium">Confidence:</span> {result.confidence} ·{" "}
        <span className="font-medium">Guidelines used:</span> {result.sources.join("; ")}
      </div>
    </Card>
  );
}
