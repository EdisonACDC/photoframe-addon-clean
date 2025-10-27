import { useState } from 'react';
import PhotoGrid from '../PhotoGrid';

const mockPhotos = [
  { id: '1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', filename: 'mountain.jpg' },
  { id: '2', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', filename: 'nature.jpg' },
  { id: '3', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400', filename: 'sunset.jpg' },
  { id: '4', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', filename: 'forest.jpg' },
  { id: '5', url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400', filename: 'lake.jpg' },
  { id: '6', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400', filename: 'ocean.jpg' },
];

export default function PhotoGridExample() {
  const [photos, setPhotos] = useState(mockPhotos);

  const handleDelete = (id: string) => {
    console.log('Delete photo:', id);
    setPhotos(photos.filter(p => p.id !== id));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <PhotoGrid 
        photos={photos} 
        onDelete={handleDelete}
        onPhotoClick={(index) => console.log('Photo clicked:', index)}
      />
    </div>
  );
}
