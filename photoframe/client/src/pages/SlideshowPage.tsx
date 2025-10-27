import { useState, useEffect, useCallback, useRef } from "react";
import PhotoViewer, { type TransitionEffect } from "@/components/PhotoViewer";
import ControlBar from "@/components/ControlBar";
import SettingsPanel from "@/components/SettingsPanel";
import { LicenseDialog } from "@/components/LicenseDialog";

interface Photo {
  id: string;
  url: string;
  filename: string;
}

interface SlideshowPageProps {
  photos: Photo[];
  onExit: () => void;
}

export default function SlideshowPage({ photos, onExit }: SlideshowPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(15);
  const [effect, setEffect] = useState<TransitionEffect>("mix");
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(true);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    setShowControls(true);
    idleTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => resetIdleTimer();
    const handleTouchStart = () => resetIdleTimer();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);

    resetIdleTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  useEffect(() => {
    if (!isPlaying || photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, intervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [isPlaying, photos.length, intervalSeconds]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    resetIdleTimer();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    resetIdleTimer();
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
    resetIdleTimer();
  };

  return (
    <div className="relative">
      <PhotoViewer
        photos={photos}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        effect={effect}
      />
      
      <ControlBar
        isVisible={showControls && !showSettings}
        isPlaying={isPlaying}
        currentIndex={currentIndex}
        totalPhotos={photos.length}
        onPlayPause={handlePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSettings={() => setShowSettings(true)}
        onExit={onExit}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        intervalSeconds={intervalSeconds}
        onIntervalChange={setIntervalSeconds}
        effect={effect}
        onEffectChange={setEffect}
        onUpgradeClick={() => {
          setShowSettings(false);
          setShowLicenseDialog(true);
        }}
      />

      <LicenseDialog 
        open={showLicenseDialog} 
        onOpenChange={setShowLicenseDialog} 
      />
    </div>
  );
}
