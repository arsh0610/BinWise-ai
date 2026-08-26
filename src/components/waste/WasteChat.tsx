import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Loader2, Recycle, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { askWasteAssistant } from "@/lib/waste.functions";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Where should I throw an old battery?",
  "Can I recycle a greasy paper plate?",
  "How do I dispose of expired medicines?",
  "Is thermocol packaging recyclable?",
];

export function WasteChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! Ask me anything about sorting waste — which bin an item belongs in, how to prepare it, or how to handle something hazardous.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ask = useServerFn(askWasteAssistant);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || pending) return;
    setError(null);
    setInput("");
    const next = [...messages, { role: "user" as const, content: question }];
    setMessages(next);
    setPending(true);
    try {
      const result = await ask({
        data: { messages: next.filter((m, i) => !(i === 0 && m.role === "assistant")) },
      });
      setMessages([...next, { role: "assistant", content: result.reply }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The assistant is unavailable.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="flex h-[560px] flex-col overflow-hidden border-border/70 p-0 shadow-soft">
      <div className="flex items-center gap-3 border-b border-border/70 bg-secondary/50 px-5 py-4">
        <span className="flex size-9 items-center justify-center rounded-full bg-leaf text-primary-foreground">
          <Recycle className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">Segregation assistant</p>
          <p className="text-xs text-muted-foreground">Answers grounded in waste-management rules</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((message, index) => (
          <div
            key={`${index}-${message.role}`}
            className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                message.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                  : "max-w-[90%] rounded-2xl rounded-bl-sm border border-border/70 bg-secondary/40 px-4 py-3 text-sm"
              }
            >
              {message.role === "assistant" ? (
                <div className="space-y-2 [&_li]:ml-4 [&_li]:list-disc [&_strong]:font-semibold">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        {pending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Checking the guidelines…
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="border-t border-border/70 px-5 py-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => send(suggestion)}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs transition-colors hover:bg-secondary"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
        >
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about any item…"
            className="h-11"
          />
          <Button type="submit" size="icon" className="size-11" disabled={pending || !input.trim()}>
            <Send className="size-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </Card>
  );
}
