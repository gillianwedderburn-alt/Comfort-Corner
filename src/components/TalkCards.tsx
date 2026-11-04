import { useState } from "react";
import { talkCards } from "@/data/talkCards";
import { Button } from "@/components/ui/button";

const shuffled = (indices: number[]) => {
  const order = [...indices];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = order[i];
    const other = order[j];
    if (current === undefined || other === undefined) continue;
    order[i] = other;
    order[j] = current;
  }
  return order;
};

const FILTERS = [
  { value: "all", label: "All cards" },
  { value: "starting", label: "Just starting out" },
  { value: "growing", label: "Growing up" },
] as const;

type StageFilter = (typeof FILTERS)[number]["value"];

const filteredIndices = (filter: StageFilter) =>
  talkCards
    .map((_, i) => i)
    .filter((i) => filter === "all" || talkCards[i]?.stage === filter);

export default function TalkCards({ onFinish }: { onFinish?: () => void } = {}) {
  const [filter, setFilter] = useState<StageFilter>("all");
  const [order, setOrder] = useState<number[]>(() => filteredIndices("all"));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const index = order[pos];
  const card = index === undefined ? undefined : talkCards[index];
  const total = order.length;

  const pickFilter = (value: StageFilter) => {
    setFilter(value);
    setOrder(filteredIndices(value));
    setPos(0);
    setFlipped(false);
  };

  const go = (d: number) => {
    setPos((p) => (p + d + total) % total);
    setFlipped(false);
  };

  if (!card) return null;

  return (
    <section aria-label="Talk cards" className="mx-auto max-w-md text-center">
      <div
        role="radiogroup"
        aria-label="Choose a set of cards"
        className="grid grid-cols-3 gap-1 rounded-full border-2 border-primary bg-card p-1"
      >
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            type="button"
            variant="comfortTab"
            role="radio"
            aria-checked={filter === f.value}
            onClick={() => pickFilter(f.value)}
            className={`min-h-12 h-auto rounded-full px-2 py-3 text-base focus-visible:ring-2 ${
              filter === f.value
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-foreground"
            }`}
          >
            {f.label}
          </Button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Choose the set that suits your daughter, or mix them all.
      </p>

      <p className="mt-4 text-sm text-muted-foreground">
        Take turns. Tap the card to see what to try together. There are no wrong answers.
      </p>

      <Button
        type="button"
        variant="comfortCard"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show the question again" : "Show what to try together"}
        aria-pressed={flipped}
        className={`flex min-h-[300px] h-auto w-full flex-col justify-center gap-0 rounded-xl p-7 text-center focus-visible:ring-2 focus-visible:ring-offset-2 ${
          flipped ? "bg-talk-sage" : "bg-talk-card"
        }`}
      >
        <span className="mb-3 font-display text-base font-semibold">
          {flipped ? "Try this together" : card.category}
        </span>
        <span className="font-display text-2xl leading-snug">
          {flipped ? card.tryThis : card.question}
        </span>
      </Button>

      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
        Card {pos + 1} of {total}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Button type="button" variant="comfortOutline" onClick={() => go(-1)} className="h-14 px-3">Back</Button>
        <Button type="button" variant="comfortPrimary" onClick={() => setFlipped((f) => !f)} className="h-14 bg-talk-primary px-3">Flip</Button>
        <Button type="button" variant="comfortOutline" onClick={() => go(1)} className="h-14 px-3">Next</Button>
      </div>
      <Button
        type="button"
        variant="comfortOutline"
        onClick={() => { setOrder(shuffled(filteredIndices(filter))); setPos(0); setFlipped(false); }}
        className="mt-3 h-14 px-6"
      >
        Shuffle
      </Button>
      {onFinish && (
        <Button type="button" variant="comfortPrimary" onClick={onFinish} className="mt-3 h-14 w-full px-6">
          Finish and reflect
        </Button>
      )}
    </section>
  );
}
