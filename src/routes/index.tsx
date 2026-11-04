import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { routines, type Routine } from "@/lib/routines";
import { RoutinePlayer } from "@/components/RoutinePlayer";
import TalkCards from "@/components/TalkCards";
import { Button } from "@/components/ui/button";
import { ReflectionScreen, Journal } from "@/components/Reflections";
import tpBadge from "@/assets/tp-badge.png.asset.json";

// Access code settings. Set REQUIRE_ACCESS_CODE to false to switch the code screen off.
const REQUIRE_ACCESS_CODE = true;
const ACCESS_CODE = "PURE2026";
const SESSION_KEY = "comfort-corner-access";

const TITLE = "Comfort Corner and Talk Cards | Tandrewphen Pure";
const DESC =
  "Six gentle routines and twenty-three conversation cards for mums and teens. Five-minute pauses and thoughtful conversations from Tandrewphen Pure.";

type Section = "routines" | "talk-cards";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [unlocked, setUnlocked] = useState(!REQUIRE_ACCESS_CODE);
  const [active, setActive] = useState<Routine | null>(null);
  const [section, setSection] = useState<Section>("routines");
  const [view, setView] = useState<{ kind: "reflect"; source: string } | { kind: "journal" } | null>(null);

  useEffect(() => {
    if (REQUIRE_ACCESS_CODE && sessionStorage.getItem(SESSION_KEY) === "ok") setUnlocked(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [active, view]);

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-3xl px-5 py-8 sm:py-12">
      {!unlocked ? (
        <AccessScreen onUnlock={() => setUnlocked(true)} />
      ) : view?.kind === "reflect" ? (
        <ReflectionScreen source={view.source} onDone={() => setView(null)} onJournal={() => setView({ kind: "journal" })} />
      ) : view?.kind === "journal" ? (
        <Journal onBack={() => setView(null)} />
      ) : active ? (
        <RoutinePlayer
          key={active.id}
          routine={active}
          onBack={() => setActive(null)}
          onReflect={active.id === "wind-down" ? undefined : () => { setView({ kind: "reflect", source: active.name }); setActive(null); }}
        />
      ) : (
        <Home
          onPick={setActive}
          section={section}
          onSectionChange={setSection}
          onReflect={() => setView({ kind: "reflect", source: "Talk cards" })}
          onJournal={() => setView({ kind: "journal" })}
        />
      )}
    </main>
  );
}

function LogoBadge({ className }: { className: string }) {
  return (
    <img
      src={tpBadge.url}
      alt="Tandrewphen Pure logo"
      className={`rounded-full shadow-sm ${className}`}
    />
  );
}

function AccessScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  return (
    <section className="relative mx-auto mt-10 max-w-md rounded-xl bg-card p-6 shadow-sm sm:p-8">
      <LogoBadge className="absolute right-4 top-4 h-14 w-14 sm:h-16 sm:w-16" />
      <p className="text-sm font-medium tracking-wide text-olive">Tandrewphen Pure</p>
      <h1 className="mt-2 text-3xl font-semibold">Welcome to Comfort Corner</h1>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim().toUpperCase() === ACCESS_CODE.toUpperCase()) {
            sessionStorage.setItem(SESSION_KEY, "ok");
            onUnlock();
          } else setError(true);
        }}
      >
        <label htmlFor="code" className="block text-base">
          Enter your access code from your order email.
        </label>
        <input
          id="code"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(false); }}
          autoComplete="off"
          aria-invalid={error}
          aria-describedby={error ? "code-error" : undefined}
          className="h-12 w-full rounded-lg border-2 bg-background px-4 text-lg"
        />
        {error && (
          <p id="code-error" role="alert" className="text-sm">
            That code does not match. Please check your order email and try again.
          </p>
        )}
        <button type="submit" className="h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground">
          Continue
        </button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        Lost your code? Email{" "}
        <a className="underline" href="mailto:tandrewphenpure@gmail.com">tandrewphenpure@gmail.com</a>.
      </p>
    </section>
  );
}

function Home({ onPick, section, onSectionChange, onReflect, onJournal }: {
  onPick: (r: Routine) => void;
  onReflect: () => void;
  onJournal: () => void;
  section: Section;
  onSectionChange: (section: Section) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <header>
        <p className="text-sm font-medium tracking-wide text-olive">Tandrewphen Pure</p>
        <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">Comfort Corner</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Six gentle routines and twenty-three conversation cards for mums and teens.
        </p>
        <div role="tablist" aria-label="Comfort Corner sections" className="mt-5 grid grid-cols-2 gap-1 rounded-full border-2 border-primary bg-card p-1">
          {(["routines", "talk-cards"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              variant="comfortTab"
              role="tab"
              id={`tab-${value}`}
              aria-selected={section === value}
              aria-controls={`panel-${value}`}
              tabIndex={section === value ? 0 : -1}
              onClick={() => onSectionChange(value)}
              onKeyDown={(event) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const next = event.key === "Home" ? "routines" : event.key === "End" ? "talk-cards" : value === "routines" ? "talk-cards" : "routines";
                onSectionChange(next);
                document.getElementById(`tab-${next}`)?.focus();
              }}
              className={`min-h-12 h-auto rounded-full px-3 py-3 text-base focus-visible:ring-2 ${section === value ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-foreground"}`}
            >
              {value === "routines" ? "Comfort routines" : "Talk cards"}
            </Button>
          ))}
        </div>
        <button onClick={onJournal} className="mt-3 min-h-11 font-medium underline underline-offset-4">
          My reflection journal
        </button>
      </header>

      <section className="mt-8 rounded-xl bg-sage text-sage-foreground">
        <h2>
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mums-panel"
            className="flex min-h-14 w-full items-center justify-between px-5 py-3 text-left font-display text-xl font-semibold"
          >
            For mums
            <span aria-hidden className={`text-2xl transition-transform ${open ? "rotate-45" : ""}`}>+</span>
          </button>
        </h2>
        {open && (
          <div id="mums-panel" className="space-y-3 px-5 pb-5">
            <p>
              Comfort Corner is designed so you and your daughter can use it together, or so she can use it on her own when she needs a quiet moment. Hard days come with growing up, and a few calm minutes can help everyone feel steadier.
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Let her choose the routine. Feeling in control is part of the comfort.</li>
              <li>Try one yourself first, or do it side by side. It works just as well for grown-ups.</li>
              <li>Keep it light. There is no right way to do it and no score to beat.</li>
              <li>Afterwards, ask "How was that?" rather than "Are you okay?". It is an easier question to answer.</li>
            </ul>
            <p>
              These routines are for rest and comfort only. If your daughter is in pain that worries you, or something does not feel right, please speak to your GP or pharmacist. Nothing is sent from this page. Any reflections she saves stay only on this device, so her check-ins stay private.
            </p>
          </div>
        )}
      </section>

      <div role="tabpanel" id="panel-routines" aria-labelledby="tab-routines" hidden={section !== "routines"} tabIndex={0}>
      <h2 className="sr-only">Routines</h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {routines.map((r) => (
          <li key={r.id}>
            <button
              onClick={() => onPick(r)}
              className="flex h-full w-full flex-col items-start rounded-xl border bg-card p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <span className="font-display text-xl font-semibold">{r.name}</span>
              <span className="mt-1 text-muted-foreground">{r.description}</span>
              <span className="mt-4 rounded-full bg-sage px-3 py-1 text-sm font-medium text-sage-foreground">5 minutes</span>
            </button>
          </li>
        ))}
      </ul>
      </div>

      <div role="tabpanel" id="panel-talk-cards" aria-labelledby="tab-talk-cards" hidden={section !== "talk-cards"} tabIndex={0} className="mt-8">
        {section === "talk-cards" && <TalkCards onFinish={onReflect} />}
      </div>

      <footer className="mt-10 border-t pt-6 text-sm text-muted-foreground">
        These routines are for rest and comfort. They are not medical advice. Move gently, stop any stretch that hurts, and speak to a pharmacist or your GP if something worries you. Nothing you do here is sent anywhere. Reflections you choose to save are kept only on this device.
      </footer>
    </>
  );
}
