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

  if (activePhotos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
        <p>Nessuna foto presente. Caricane alcune per iniziare!</p>
      </div>
    );
  }

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

function PhotoItem({ 
  photo, 
  isSelected, 
  onToggle 
}: { 
  photo: Photo; 
  isSelected: boolean; 
  onToggle: () => void;
}) {
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
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent",
        isDragging && "opacity-50 scale-95"
      )}
      onClick={onToggle}
    >
      {/* Checkbox Semplice (HTML) per evitare errori di build */}
      <div className={cn(
        "absolute top-2 left-2 z-20 w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
        isSelected ? "bg-primary border-primary text-white" : "bg-white/50 border-gray-400 opacity-0 group-hover:opacity-100"
      )}>
        {isSelected && (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        )}
      </div>

      {isSelected && (
        <div className="absolute inset-0 bg-primary/10 z-10 pointer-events-none" />
      )}

      <div {...attributes} {...listeners} className="w-full h-full">
        <img
          src={photo.filepath}
          alt={photo.filename}
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
    </Card>
  );
}
