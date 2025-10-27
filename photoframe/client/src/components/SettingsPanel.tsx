import { X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { TransitionEffect } from "./PhotoViewer";
import { useLicense } from "@/hooks/useLicense";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  intervalSeconds: number;
  onIntervalChange: (value: number) => void;
  effect: TransitionEffect;
  onEffectChange: (effect: TransitionEffect) => void;
  onUpgradeClick?: () => void;
}

const effects: { value: TransitionEffect; label: string; isPro?: boolean }[] = [
  { value: "mix", label: "🎲 Mix Casuale", isPro: true },
  { value: "fade", label: "Dissolvenza" },
  { value: "slideLeft", label: "◀️ Scorri Sinistra" },
  { value: "slideRight", label: "▶️ Scorri Destra" },
  { value: "zoomIn", label: "🔍 Zoom Avanti" },
  { value: "zoomOut", label: "🔎 Zoom Indietro" },
  { value: "kenBurns", label: "📽️ Ken Burns" },
  { value: "slideUp", label: "⬆️ Scorri Alto", isPro: true },
  { value: "slideDown", label: "⬇️ Scorri Basso", isPro: true },
  { value: "rotate", label: "🔄 Rotazione", isPro: true },
  { value: "flip", label: "🔃 Flip 3D", isPro: true },
  { value: "spiral", label: "🌀 Spirale", isPro: true },
  { value: "corner", label: "📐 Angolo", isPro: true },
];

export default function SettingsPanel({
  isOpen,
  onClose,
  intervalSeconds,
  onIntervalChange,
  effect,
  onEffectChange,
  onUpgradeClick,
}: SettingsPanelProps) {
  const { isPro, isTrial, isExpired } = useLicense();
  
  // FREE (trial scaduto) = NESSUN effetto (solo fade nascosto)
  // TRIAL = Tutti gli effetti
  // PRO = Tutti gli effetti
  const hasProFeatures = isPro || isTrial;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            data-testid="settings-backdrop"
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-card border-l border-card-border z-50 overflow-y-auto"
            data-testid="settings-panel"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Impostazioni</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  data-testid="button-close-settings"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-8">
                <div>
                  <Label className="text-sm font-medium mb-4 block">
                    Intervallo Slideshow
                  </Label>
                  <div className="space-y-4">
                    <Slider
                      value={[intervalSeconds]}
                      onValueChange={(values) => onIntervalChange(values[0])}
                      min={5}
                      max={60}
                      step={5}
                      className="w-full"
                      data-testid="slider-interval"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>5s</span>
                      <span className="font-medium text-foreground">
                        {intervalSeconds}s
                      </span>
                      <span>60s</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-sm font-medium">
                      Effetto Transizione
                    </Label>
                    {!hasProFeatures && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Crown className="h-3 w-3" />
                        {effects.filter(e => e.isPro).length} PRO
                      </Badge>
                    )}
                  </div>
                  
                  {isExpired ? (
                    <div className="p-4 border border-destructive/20 rounded-md bg-destructive/5">
                      <p className="text-sm text-muted-foreground mb-3">
                        Trial scaduto - Nessun effetto disponibile in versione FREE
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Solo dissolvenza (automatica)
                      </p>
                      <Button
                        onClick={() => onUpgradeClick?.()}
                        size="sm"
                        className="w-full gap-2"
                        data-testid="button-upgrade-from-settings"
                      >
                        <Crown className="h-4 w-4" />
                        Sblocca 13 Effetti PRO (€5,50)
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                        {effects.map((item) => {
                          const isLocked = item.isPro && !hasProFeatures;
                          return (
                            <Button
                              key={item.value}
                              variant={effect === item.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                if (isLocked && onUpgradeClick) {
                                  onUpgradeClick();
                                } else {
                                  onEffectChange(item.value);
                                }
                              }}
                              className="justify-between text-xs"
                              data-testid={`button-effect-${item.value}`}
                            >
                              <span>{item.label}</span>
                              {item.isPro && !hasProFeatures && (
                                <Crown className="h-3 w-3 text-primary" />
                              )}
                            </Button>
                          );
                        })}
                      </div>
                      {isTrial && (
                        <p className="text-xs text-green-600 mt-3">
                          Trial attivo - Tutti gli effetti sbloccati!
                        </p>
                      )}
                    </>
                  )}
                  
                  {!hasProFeatures && !isExpired && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Versione FREE: 6 effetti base disponibili
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-2">Info</h3>
                  <p className="text-sm text-muted-foreground">
                    PhotoFrame - Cornice Digitale per Home Assistant
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
