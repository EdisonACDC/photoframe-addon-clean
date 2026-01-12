import { useDraggable } from "@dnd-kit/core";
import { Photo } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PhotoGridProps {
  photos: Photo[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

export function PhotoGrid({ photos, selectedIds, onToggleSelect }: PhotoGridProps) {
  const activePhotos = photos.filter((p) => !p.isTrash);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {activePhotos.map((photo) => (
        <PhotoItem
          key={photo.id}
          photo={photo}
          isSelected={selectedIds.includes(photo.id.toString())}
          onToggle={() => onToggleSelect(photo.id.toString())}
        />
      ))}
    </div>
  );
}

function PhotoItem({ photo, isSelected, onToggle }: { photo: Photo; isSelected: boolean; onToggle: () => void; }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: photo.id.toString(),
    data: photo,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : undefined,
  } : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative aspect-square overflow-hidden group cursor-pointer transition-all border-2",
        isSelected ? "border-primary ring-2" : "border-transparent",
        isDragging && "opacity-50"
      )}
      onClick={onToggle}
    >
      {isSelected && (
        <div className="absolute top-2 left-2 z-20 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
          ✓
        </div>
      )}
      <div {...attributes} {...listeners} className="w-full h-full">
        <img src={photo.filepath} alt={photo.filename} className="w-full h-full object-cover pointer-events-none" />
      </div>
    </Card>
  );
}
