import { useState } from 'react';
import SettingsPanel from '../SettingsPanel';
import { Button } from '@/components/ui/button';

export default function SettingsPanelExample() {
  const [isOpen, setIsOpen] = useState(true);
  const [interval, setInterval] = useState(15);

  return (
    <div className="h-screen w-screen bg-background flex items-center justify-center">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-settings">
        Apri Impostazioni
      </Button>
      <SettingsPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        intervalSeconds={interval}
        onIntervalChange={setInterval}
      />
    </div>
  );
}
