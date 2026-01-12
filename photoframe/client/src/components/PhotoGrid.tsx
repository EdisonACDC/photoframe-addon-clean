import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Photo {
  id: string;
  url: string;
  filename: string;
  inTrash?: boolean;
}

interface PhotoGridProps {
  photos: Photo[];
  onDelete: (id: string) => void;
  onPhotoClick?: (index: number) => void;
  enableDrag?: boolean;
}

export default function PhotoGrid({ 
  photos, 
  onDelete, 
  onPhotoClick,
  enableDrag = false 
}: PhotoGridProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nessuna foto caricata</p>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, photoId: string) => {
    e.dataTransfer.setData("photoId", photoId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(photoId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className={`relative aspect-square rounded-lg overflow-hidden bg-muted group ${
            draggingId === photo.id ? "opacity-50 scale-95" : ""
          } transition-all`}
          data-testid={`photo-thumbnail-${photo.id}`}
          draggable={enableDrag}
          onDragStart={(e) => handleDragStart(e, photo.id)}
          onDragEnd={handleDragEnd}
        >
          <img
            src={photo.url}
            alt={photo.filename}
            className="w-full h-full object-cover pointer-events-none"
            onClick={() => onPhotoClick?.(index)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          {!enableDrag && (
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 w-9 h-9 shadow-lg z-10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(photo.id);
              }}
              data-testid={`button-delete-${photo.id}`}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
