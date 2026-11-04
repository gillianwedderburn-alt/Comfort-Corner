import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MOODS, randomPrompt, loadReflections, saveReflection, deleteReflection,
  type Mood, type Reflection,
} from "@/data/reflections";

export function ReflectionScreen({ source, onDone, onJournal }: {
  source: string;
  onDone: () => void;
  onJournal: () => void;
}) {
  const [mood, setMood] = useState<Mood | null>(null);
  const [prompt, setPrompt] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const pick = (m: Mood) => {
    setMood(m);
    setPrompt(randomPrompt(m));
  };

  const save = () => {
    if (!mood) return;
    saveReflection({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toISOString(),
      mood, prompt, note: note.trim(), source,
    });
    setSaved(true);
  };

  if (saved) {
    return (
      <section className="mx-auto mt-10 max-w-md rounded-xl bg-card p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold">Reflection saved</h1>
        <p className="mt-3 text-lg text-muted-foreground">Thank you for taking a moment to check in.</p>
        <div className="mt-6 grid gap-3">
          <Button variant="comfortPrimary" className="h-14 text-lg" onClick={onJournal}>View my journal</Button>
          <Button variant="comfortOutline" className="h-14" onClick={onDone}>Back to home</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md">
      <p className="text-sm font-medium tracking-wide text-olive">Routine Reflections</p>
      <h1 className="mt-1 text-3xl font-semibold">How are you feeling?</h1>
      <p className="mt-2 text-muted-foreground">Tap the word that fits best right now.</p>

      <div role="radiogroup" aria-label="Your mood" className="mt-5 flex flex-wrap gap-2">
        {MOODS.map((m) => (
          <Button
            key={m}
            type="button"
            role="radio"
            aria-checked={mood === m}
            variant={mood === m ? "comfortPrimary" : "comfortOutline"}
            onClick={() => pick(m)}
            className="h-12 px-5 text-base focus-visible:ring-2"
          >
            {m}
          </Button>
        ))}
      </div>

      {mood && (
        <>
          <div className="mt-6 rounded-xl bg-sage p-5 text-sage-foreground" aria-live="polite">
            <p className="text-sm font-semibold">A gentle prompt</p>
            <p className="mt-2 font-display text-xl leading-snug">{prompt}</p>
            <button
              type="button"
              onClick={() => setPrompt(randomPrompt(mood, prompt))}
              className="mt-3 min-h-11 text-sm font-medium underline underline-offset-4"
            >
              Show a different prompt
            </button>
          </div>
          <label htmlFor="note" className="mt-6 block text-base font-medium">Your note (optional)</label>
          <textarea
            id="note"
            value={note}
            maxLength={500}
            rows={4}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 w-full rounded-lg border-2 bg-background p-3 text-lg"
          />
        </>
      )}

      <div className="mt-6 grid gap-3">
        <Button variant="comfortPrimary" className="h-14 text-lg" disabled={!mood} onClick={save}>Save reflection</Button>
        <Button variant="comfortOutline" className="h-14" onClick={onDone}>Skip for now</Button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Reflections are kept only on this device and are never sent anywhere.</p>
    </section>
  );
}

export function Journal({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<Reflection[] | null>(null);
  useEffect(() => setItems(loadReflections()), []);

  return (
    <section className="mx-auto max-w-md">
      <button onClick={onBack} className="inline-flex min-h-11 items-center gap-2 font-medium underline-offset-4 hover:underline">
        <span aria-hidden>&larr;</span> Back to home
      </button>
      <h1 className="mt-4 text-3xl font-semibold">My reflection journal</h1>
      <p className="mt-2 text-sm text-muted-foreground">Saved only on this device. Clearing your browser data will remove them.</p>
      {items && items.length === 0 && (
        <p className="mt-6 rounded-xl bg-card p-5 shadow-sm">No reflections yet. Finish a routine or some talk cards to add one.</p>
      )}
      <ul className="mt-6 space-y-4">
        {items?.map((r) => (
          <li key={r.id} className="rounded-xl bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-sage px-3 py-1 text-sm font-medium text-sage-foreground">{r.mood}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(r.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">After: {r.source}</p>
            <p className="mt-2 font-display text-lg leading-snug">{r.prompt}</p>
            {r.note && <p className="mt-2 whitespace-pre-wrap">{r.note}</p>}
            <button
              type="button"
              onClick={() => setItems(deleteReflection(r.id))}
              className="mt-3 min-h-11 text-sm underline underline-offset-4"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
