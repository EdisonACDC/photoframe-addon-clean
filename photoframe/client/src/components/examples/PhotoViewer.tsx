import PhotoViewer from '../PhotoViewer';

const mockPhotos = [
  { id: '1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200', filename: 'mountain.jpg' },
  { id: '2', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200', filename: 'nature.jpg' },
];

export default function PhotoViewerExample() {
  return <PhotoViewer photos={mockPhotos} currentIndex={0} isPlaying={true} />;
}
