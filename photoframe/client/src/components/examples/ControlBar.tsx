import { useState } from 'react';
import ControlBar from '../ControlBar';

export default function ControlBarExample() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="h-screen w-screen bg-background flex items-center justify-center">
      <ControlBar
        isVisible={true}
        isPlaying={isPlaying}
        currentIndex={currentIndex}
        totalPhotos={10}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onPrevious={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
        onNext={() => setCurrentIndex(Math.min(9, currentIndex + 1))}
        onSettings={() => console.log('Settings clicked')}
        onExit={() => console.log('Exit clicked')}
      />
    </div>
  );
}
