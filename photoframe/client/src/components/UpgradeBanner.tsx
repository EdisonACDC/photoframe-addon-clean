import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Coffee, Crown, Clock, AlertCircle } from "lucide-react";

interface UpgradeBannerProps {
  onUpgrade: () => void;
  onDonate?: () => void;
  isTrial?: boolean;
  isExpired?: boolean;
  daysRemaining?: number;
}

export function UpgradeBanner({ onUpgrade, onDonate, isTrial, isExpired, daysRemaining = 0 }: UpgradeBannerProps) {
  const handleDonate = () => {
    window.open("https://paypal.me/MariusClaudiu/5EUR", "_blank");
  };

  // Trial attivo
  if (isTrial) {
    return (
      <Card className="p-4 bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent border-green-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-lg">Trial PRO Attivo</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {daysRemaining > 1 
                ? `${daysRemaining} giorni rimasti - Sblocca tutti gli effetti e il cestino ora!`
                : `Ultimo giorno! Sblocca PRO per non perdere le funzionalità`
              }
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onUpgrade}
              size="sm"
              data-testid="button-upgrade-pro"
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Sblocca PRO (€5,50)
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Trial scaduto
  if (isExpired) {
    return (
      <Card className="p-4 bg-gradient-to-r from-destructive/10 via-destructive/5 to-transparent border-destructive/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-lg">Trial Scaduto</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Acquista PhotoFrame PRO per sbloccare 13 effetti spettacolari + Cestino drag & drop
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {onDonate && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDonate || handleDonate}
                data-testid="button-donate"
                className="gap-2"
              >
                <Coffee className="h-4 w-4" />
                Dona ☕
              </Button>
            )}
            <Button
              onClick={onUpgrade}
              size="sm"
              data-testid="button-upgrade-pro"
              className="gap-2"
            >
              <Crown className="h-4 w-4" />
              Acquista PRO (€5,50)
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Default (non dovrebbe mai succedere)
  return null;
}
