import { useState } from "react";
import { talkCards } from "@/data/talkCards";
import { Button } from "@/components/ui/button";

const shuffled = () => {
  const order = talkCards.map((_, i) => i);
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

export default function TalkCards() {
  const [order, setOrder] = useState<number[]>(() => talkCards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const index = order[pos];
  const card = index === undefined ? undefined : talkCards[index];
  const total = talkCards.length;

  const go = (d: number) => {
    setPos((p) => (p + d + total) % total);
    setFlipped(false);
  };

  if (!card) return null;

  return (
    <section aria-label="Talk cards" className="mx-auto max-w-md text-center">
      <p className="mb-4 text-sm text-muted-foreground">
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
        onClick={() => { setOrder(shuffled()); setPos(0); setFlipped(false); }}
        className="mt-3 h-14 px-6"
      >
        Shuffle
      </Button>
    </section>
  );
}