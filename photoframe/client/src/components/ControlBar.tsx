import { Button } from "@/components/ui/button";
import { Play, Pause, ChevronLeft, ChevronRight, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ControlBarProps {
  isVisible: boolean;
  isPlaying: boolean;
  currentIndex: number;
  totalPhotos: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSettings: () => void;
  onExit?: () => void;
}

export default function ControlBar({
  isVisible,
  isPlaying,
  currentIndex,
  totalPhotos,
  onPlayPause,
  onPrevious,
  onNext,
  onSettings,
  onExit,
}: ControlBarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border px-6 py-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={onPrevious}
                disabled={totalPhotos === 0}
                data-testid="button-previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={onPlayPause}
                disabled={totalPhotos === 0}
                data-testid="button-play-pause"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={onNext}
                disabled={totalPhotos === 0}
                data-testid="button-next"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
              
              <div className="w-px h-8 bg-border mx-2" />
              
              <div className="text-sm text-muted-foreground min-w-16 text-center" data-testid="text-photo-counter">
                {totalPhotos > 0 ? `${currentIndex + 1} / ${totalPhotos}` : '0 / 0'}
              </div>
              
              <div className="w-px h-8 bg-border mx-2" />
              
              <Button
                size="icon"
                variant="ghost"
                onClick={onSettings}
                data-testid="button-settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
              
              {onExit && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onExit}
                  data-testid="button-exit"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
