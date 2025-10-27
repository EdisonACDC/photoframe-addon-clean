import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Photo {
  id: string;
  url: string;
  filename: string;
}

export type TransitionEffect = "mix" | "fade" | "slideLeft" | "slideRight" | "slideUp" | "slideDown" | "zoomIn" | "zoomOut" | "kenBurns" | "rotate" | "flip" | "spiral" | "corner";

interface PhotoViewerProps {
  photos: Photo[];
  currentIndex: number;
  isPlaying: boolean;
  transitionDuration?: number;
  effect?: TransitionEffect;
}

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-100%" },
  },
  slideRight: {
    initial: { opacity: 0, x: "-100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100%" },
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 },
  },
  zoomOut: {
    initial: { opacity: 0, scale: 1.2 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  kenBurns: {
    initial: { opacity: 0, scale: 1 },
    animate: { opacity: 1, scale: 1.1 },
    exit: { opacity: 0, scale: 1.15 },
  },
  slideUp: {
    initial: { opacity: 0, y: "100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "-100%" },
  },
  slideDown: {
    initial: { opacity: 0, y: "-100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "100%" },
  },
  rotate: {
    initial: { opacity: 0, rotate: -180, scale: 0.5 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 180, scale: 0.5 },
  },
  flip: {
    initial: { opacity: 0, rotateY: -90, scale: 0.8 },
    animate: { opacity: 1, rotateY: 0, scale: 1 },
    exit: { opacity: 0, rotateY: 90, scale: 0.8 },
  },
  spiral: {
    initial: { opacity: 0, rotate: -360, scale: 0.3 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 360, scale: 0.3 },
  },
  corner: {
    initial: { opacity: 0, x: "100%", y: "-100%", rotate: -45, scale: 0.5 },
    animate: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
    exit: { opacity: 0, x: "-100%", y: "100%", rotate: 45, scale: 0.5 },
  },
};

type ActualEffect = Exclude<TransitionEffect, "mix">;
const effectOptions: ActualEffect[] = ["fade", "slideLeft", "slideRight", "slideUp", "slideDown", "zoomIn", "zoomOut", "kenBurns", "rotate", "flip", "spiral", "corner"];

export default function PhotoViewer({
  photos,
  currentIndex,
  isPlaying,
  transitionDuration = 0.7,
  effect = "fade",
}: PhotoViewerProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentEffect, setCurrentEffect] = useState<ActualEffect>("fade");

  useEffect(() => {
    setImageLoaded(false);
    
    // If Mix is selected, randomize effect for each photo
    if (effect === "mix") {
      const randomEffect = effectOptions[Math.floor(Math.random() * effectOptions.length)];
      setCurrentEffect(randomEffect);
    } else {
      setCurrentEffect(effect);
    }
  }, [currentIndex, effect]);

  if (photos.length === 0) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Nessuna foto disponibile</p>
        </div>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];
  const variants = transitionVariants[currentEffect];

  return (
    <div className="w-screen h-screen bg-background overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhoto.id}
          initial={variants.initial}
          animate={{ ...variants.animate, opacity: imageLoaded ? 1 : 0 }}
          exit={variants.exit}
          transition={{ duration: transitionDuration, ease: "easeInOut" }}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src={currentPhoto.url}
            alt={currentPhoto.filename}
            className="max-w-full max-h-full object-contain"
            onLoad={() => setImageLoaded(true)}
            data-testid={`photo-${currentPhoto.id}`}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
