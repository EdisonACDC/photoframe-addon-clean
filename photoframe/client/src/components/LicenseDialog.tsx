import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLicense } from "@/hooks/useLicense";
import { useToast } from "@/hooks/use-toast";
import { Key, Sparkles } from "lucide-react";

interface LicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LicenseDialog({ open, onOpenChange }: LicenseDialogProps) {
  const [licenseKey, setLicenseKey] = useState("");
  const { activate, isActivating } = useLicense();
  const { toast } = useToast();

  const handleActivate = () => {
    if (!licenseKey.trim()) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Inserisci un codice licenza valido",
      });
      return;
    }

    activate(licenseKey.trim().toUpperCase(), {
      onSuccess: () => {
        toast({
          title: "🎉 Licenza PRO Attivata!",
          description: "Ora hai accesso a tutti i 13 effetti e al cestino drag & drop!",
        });
        setLicenseKey("");
        onOpenChange(false);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Codice Non Valido",
          description: "Il codice licenza inserito non è corretto. Riprova.",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Attiva PhotoFrame PRO
          </DialogTitle>
          <DialogDescription>
            Inserisci il codice licenza per sbloccare tutte le funzionalità premium
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="license-key">Codice Licenza</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="license-key"
                data-testid="input-license-key"
                placeholder="PRO-2025-XXXX-YYYY"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleActivate()}
                className="pl-10 font-mono"
                maxLength={19}
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
            <p className="font-semibold">Funzionalità PRO (€5,50):</p>
            <ul className="space-y-1 ml-4 list-disc text-muted-foreground">
              <li>13 effetti transizione spettacolari</li>
              <li>Cestino drag & drop per gestione foto</li>
              <li>Tutte le future funzionalità premium</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isActivating}
            data-testid="button-cancel-license"
          >
            Annulla
          </Button>
          <Button
            onClick={handleActivate}
            disabled={isActivating || !licenseKey.trim()}
            data-testid="button-activate-license"
          >
            {isActivating ? "Attivazione..." : "Attiva Licenza"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
