import { useEffect, useMemo, useRef, useState } from "react";
import type { Routine } from "@/lib/routines";

type Status = "idle" | "running" | "paused" | "done";

function fmt(sec: number) {
  const s = Math.max(0, Math.ceil(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function ensureAudio(audioRef: React.MutableRefObject<AudioContext | null>) {
  try {
    const ctx = audioRef.current ?? new AudioContext();
    audioRef.current = ctx;
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    /* audio not available */
  }
}

function playChime(audioRef: React.MutableRefObject<AudioContext | null>) {
  try {
    const ctx = audioRef.current ?? new AudioContext();
    audioRef.current = ctx;
    const t = ctx.currentTime;
    [523.25, 783.99].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12 / (i + 1), t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 2.1);
    });
  } catch {
    /* audio not available */
  }
}

export function RoutinePlayer({ routine, onBack }: { routine: Routine; onBack: () => void }) {
  const total = useMemo(() => routine.steps.reduce((a, s) => a + s.seconds, 0), [routine]);
  const bounds = useMemo(() => {
    let acc = 0;
    return routine.steps.map((s) => (acc += s.seconds) - s.seconds);
  }, [routine]);

  const [status, setStatus] = useState<Status>("idle");
  const [baseMs, setBaseMs] = useState(0); // elapsed before current run
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => 0);
  const [chime, setChime] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  const elapsed = Math.min(total, (baseMs + (startedAt !== null ? now - startedAt : 0)) / 1000);

  useEffect(() => {
    if (status !== "running") return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    const onVis = () => setNow(Date.now());
    document.addEventListener("visibilitychange", onVis);
    return () => { window.clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
  }, [status]);

  useEffect(() => () => { audioRef.current?.close(); }, []);

  useEffect(() => {
    if (status === "running" && elapsed >= total) {
      setStatus("done");
      setStartedAt(null);
      setBaseMs(total * 1000);
    }
  }, [elapsed, total, status]);

  let stepIndex = routine.steps.length - 1;
  for (let i = 0; i < bounds.length; i++) {
    if (elapsed < bounds[i]! + routine.steps[i]!.seconds) { stepIndex = i; break; }
  }
  const step = routine.steps[stepIndex]!;
  const stepElapsed = elapsed - bounds[stepIndex]!;

  const prevStep = useRef(stepIndex);
  useEffect(() => {
    if (stepIndex !== prevStep.current && chime && status !== "idle") playChime(audioRef);
    prevStep.current = stepIndex;
  }, [stepIndex, chime, status]);
  useEffect(() => {
    if (status === "done" && chime) playChime(audioRef);
  }, [status, chime]);

  const start = () => {
    const t = Date.now();
    setNow(t);
    setStartedAt(t);
    setStatus("running");
  };
  const pause = () => {
    const t = Date.now();
    setBaseMs((b) => b + (startedAt !== null ? t - startedAt : 0));
    setStartedAt(null);
    setStatus("paused");
  };
  const restart = () => {
    setBaseMs(0);
    setStartedAt(null);
    setStatus("idle");
    prevStep.current = 0;
  };
  const next = () => {
    if (stepIndex >= routine.steps.length - 1) {
      setBaseMs(total * 1000);
      setStartedAt(null);
      setStatus("done");
      return;
    }
    const target = bounds[stepIndex + 1]! * 1000;
    const t = Date.now();
    setBaseMs(target);
    setNow(t);
    setStartedAt(status === "running" ? t : null);
    if (status === "idle") setStatus("paused");
  };

  const R = 120;
  const C = 2 * Math.PI * R;
  const progress = elapsed / total;
  const breathing = step.breathing && status !== "done";
  const cyclePos = stepElapsed % 10;
  const phase: "in" | "out" = cyclePos < 4 ? "in" : "out";
  const active = status === "running";

  if (status === "done") {
    return (
      <section className="text-center">
        <BackLink onBack={onBack} />
        <div className="mt-16 rounded-xl bg-card p-8 shadow-sm">
          <h1 className="text-4xl font-semibold">All done</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Well done for taking five minutes. Carry that calm into the rest of your day.
          </p>
          <button onClick={onBack} className="mt-8 h-14 rounded-full bg-primary px-8 text-lg font-semibold text-primary-foreground">
            Choose another routine
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <BackLink onBack={onBack} />
      <h1 className="mt-4 text-center text-3xl font-semibold sm:text-4xl">{routine.name}</h1>

      <div className="relative mx-auto mt-6 aspect-square w-full max-w-[18rem] sm:max-w-[20rem]">
        <svg viewBox="0 0 280 280" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="140" cy="140" r={R} fill="none" strokeWidth="14" className="stroke-track" />
          <circle
            cx="140" cy="140" r={R} fill="none" strokeWidth="14" strokeLinecap="round"
            className="ring-progress stroke-primary"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {breathing && (
            <div
              aria-hidden
              data-phase={phase}
              className="breath-circle absolute h-[62%] w-[62%] rounded-full bg-sage opacity-80"
              style={{ transform: `scale(${active ? (phase === "in" ? 1 : 0.55) : 0.75})` }}
            />
          )}
          <div className="relative text-center">
            <p className="font-display text-5xl font-semibold tabular-nums" aria-label={`${fmt(total - elapsed)} remaining`}>
              {fmt(total - elapsed)}
            </p>
            {breathing && (
              <p className="mt-1 text-lg font-medium" aria-live="polite">
                {active ? (phase === "in" ? "Breathe in" : "Breathe out") : "Breathe in for 4, out for 6"}
              </p>
            )}
          </div>
        </div>
      </div>

      <ol className="mt-6 flex gap-1.5" aria-label={`Step ${stepIndex + 1} of ${routine.steps.length}`}>
        {routine.steps.map((s, i) => (
          <li
            key={i}
            title={s.title}
            className={`h-2.5 rounded-full ${i < stepIndex ? "bg-olive" : i === stepIndex ? "bg-primary" : "bg-track"}`}
            style={{ flexGrow: s.seconds }}
          >
            <span className="sr-only">{s.title}: {i < stepIndex ? "done" : i === stepIndex ? "current" : "upcoming"}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl bg-card p-5 shadow-sm" aria-live="polite">
        <p className="text-sm text-muted-foreground">Step {stepIndex + 1} of {routine.steps.length}</p>
        <h2 className="mt-1 text-2xl font-semibold">{step.title}</h2>
        <p className="mt-2 text-lg leading-relaxed">{step.text}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          onClick={active ? pause : start}
          className="h-14 rounded-full bg-primary text-lg font-semibold text-primary-foreground sm:order-none"
        >
          {active ? "Pause" : status === "paused" ? "Resume" : "Start"}
        </button>
        <button onClick={next} className="h-14 rounded-full border-2 border-olive font-semibold">
          Next step
        </button>
        <button onClick={restart} className="h-14 rounded-full border-2 border-olive font-semibold">
          Restart
        </button>
      </div>

      <label className="mt-6 flex min-h-12 cursor-pointer items-center justify-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={chime}
          onChange={(e) => setChime(e.target.checked)}
          className="h-5 w-5 accent-[var(--olive)]"
        />
        Soft chime between steps
      </label>
    </section>
  );
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} className="inline-flex min-h-11 items-center gap-2 font-medium underline-offset-4 hover:underline">
      <span aria-hidden>&larr;</span> Back to routines
    </button>
  );
}
