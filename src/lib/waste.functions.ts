import { createServerFn } from "@tanstack/react-start";
import { generateText, streamText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider, requireLovableApiKey } from "./ai-gateway.server";
import {
  GUIDELINES,
  formatGuidelineContext,
  retrieveGuidelines,
} from "./waste-guidelines";

const MODEL = "google/gemini-3-flash";

const CATEGORIES = ["recyclable", "organic", "hazardous", "general"] as const;

const IdentifyInput = z
  .object({
    item: z.string().max(300).optional(),
    imageDataUrl: z.string().max(9_000_000).optional(),
  })
  .refine((value) => Boolean(value.item?.trim() || value.imageDataUrl), {
    message: "Describe an item or upload a photo.",
  });

const resultSchema = z.object({
  itemName: z.string(),
  category: z.enum(CATEGORIES),
  confidence: z.enum(["high", "medium", "low"]),
  summary: z.string(),
  steps: z.array(z.string()),
  warning: z.string().nullable(),
  impact: z.string(),
});

export type WasteResult = z.infer<typeof resultSchema> & { sources: string[] };

const SYSTEM_PROMPT = `You are the Waste Segregation Assistant, a municipal recycling advisor.

Classify the item into exactly one bin category:
- recyclable: clean dry materials a material recovery facility accepts (paper, card, glass, metal, rigid plastics)
- organic: wet/compostable food and garden waste
- hazardous: batteries, e-waste, chemicals, paints, medicines, sharps, mercury lamps
- general: non-recyclable dry rejects that must go to landfill/incineration

Rules:
- Base your guidance ONLY on the reference guidelines provided. If they do not cover the item, say so and give the safest conservative advice.
- Keep "summary" to one sentence naming the category and the single most important action.
- "steps" must be 2-4 short imperative preparation/disposal steps.
- "warning" is a short safety or contamination caution, or null when there is none.
- "impact" is one short sentence on the environmental benefit of doing this correctly.
- Never guess a brand or an item you cannot see. Use plain language, no markdown.`;

export const identifyWaste = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => IdentifyInput.parse(input))
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(requireLovableApiKey());

    const query = data.item?.trim() ?? "";
    const guidelines = data.imageDataUrl && !query ? GUIDELINES : retrieveGuidelines(query, 6);
    const context = formatGuidelineContext(guidelines);

    const parts: Array<
      | { type: "text"; text: string }
      | { type: "image"; image: string }
    > = [
      {
        type: "text",
        text: `Reference guidelines:\n\n${context}\n\n---\n${
          data.imageDataUrl
            ? `Identify the waste item in the attached photo${query ? ` (user note: "${query}")` : ""} and classify it.`
            : `Waste item from the user: "${query}"`
        }`,
      },
    ];
    if (data.imageDataUrl) parts.push({ type: "image", image: data.imageDataUrl });

    try {
      const { output } = await generateText({
        model: gateway(MODEL),
        system: SYSTEM_PROMPT,
        output: Output.object({ schema: resultSchema }),
        messages: [{ role: "user", content: parts }],
      });

      return {
        ...output,
        sources: Array.from(new Set(guidelines.map((g) => g.source))).slice(0, 4),
      } satisfies WasteResult;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        throw new Error("The assistant could not classify that item. Try rephrasing it.");
      }
      throw error;
    }
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
});

export const askWasteAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(requireLovableApiKey());

    const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
    const guidelines = retrieveGuidelines(lastUser?.content ?? "", 6);

    const result = streamText({
      model: gateway(MODEL),
      system: `You are the Waste Segregation Assistant. Answer questions about how to sort, prepare and dispose of waste.

Ground every answer in these reference guidelines:

${formatGuidelineContext(guidelines)}

Always name the bin category (recyclable, organic, hazardous or general) when relevant, then give the preparation steps. Be concise (under 130 words), use short markdown bullets when listing steps, and flag safety risks. If local rules could differ, say to check the local collection scheme. Refuse unrelated topics politely.`,
      messages: data.messages,
    });

    return {
      reply: await result.text,
      sources: Array.from(new Set(guidelines.map((g) => g.source))).slice(0, 4),
    };
  });
