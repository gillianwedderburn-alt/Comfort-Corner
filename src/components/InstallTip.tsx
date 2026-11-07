import { useEffect, useState } from "react";
import { Download, Share, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstallTip() {
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
    const update = () => setVisible(!standalone.matches && !navigatorWithStandalone.standalone);
    update();
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setPlatform(ios ? "ios" : /Android/.test(navigator.userAgent) ? "android" : "other");
    standalone.addEventListener("change", update);
    return () => standalone.removeEventListener("change", update);
  }, []);

  if (!visible) return null;

  return (
    <aside aria-label="Install Comfort Corner" className="relative mt-6 rounded-lg border border-olive/30 bg-sage/40 p-4 pr-14 text-foreground">
      <div className="flex items-center gap-2 text-olive">
        <Smartphone aria-hidden="true" className="h-5 w-5 shrink-0" />
        <h2 className="font-display text-lg font-semibold text-foreground">Your own little comfort corner</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed">
        {platform === "ios" ? (
          <>In Safari, tap Share <Share aria-hidden="true" className="inline h-4 w-4 align-text-bottom" />, then Add to Home Screen. Turn on Open as Web App if shown.</>
        ) : platform === "android" ? (
          <>In Chrome, open the menu and tap Add to Home Screen, then Install if offered.</>
        ) : (
          <>On iPhone, open in Safari and tap Share, then Add to Home Screen. On Android, open the browser menu and tap Add to Home Screen.</>
        )}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><Download aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />Keep Comfort Corner on your home screen.</p>
      <Button type="button" variant="comfortTab" size="icon" className="absolute right-1 top-1 h-11 w-11 rounded-full" aria-label="Dismiss installation tip" title="Dismiss installation tip" onClick={() => setVisible(false)}>
        <X aria-hidden="true" />
      </Button>
    </aside>
  );
}