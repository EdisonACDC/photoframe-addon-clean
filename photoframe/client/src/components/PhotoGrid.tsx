import { useDraggable } from "@dnd-kit/core";
import { Photo } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PhotoGrid({ photos }: { photos: Photo[] }) {
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
        <PhotoItem key={photo.id} photo={photo} />
      ))}
    </div>
  );
}

function PhotoItem({ photo }: { photo: Photo }) {
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
        "relative aspect-square overflow-hidden group cursor-pointer transition-all",
        isDragging && "opacity-50 scale-95"
      )}
      {...attributes}
      {...listeners}
    >
      <img
        src={photo.filepath}
        alt={photo.filename}
        className="w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
        {photo.filename}
      </div>
    </Card>
  );
}
