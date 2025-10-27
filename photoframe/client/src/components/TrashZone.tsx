import { useState } from "react";
import { Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Photo {
  id: string;
  url: string;
  filename: string;
  inTrash?: boolean;
}

interface TrashZoneProps {
  trashedPhotos: Photo[];
  onDrop: (photoId: string) => void;
  onRestore: (photoId: string) => void;
  onEmptyTrash: () => void;
}

export default function TrashZone({
  trashedPhotos,
  onDrop,
  onRestore,
  onEmptyTrash,
}: TrashZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const photoId = e.dataTransfer.getData("photoId");
    if (photoId) {
      onDrop(photoId);
    }
  };

  return (
    <Card
      className={`p-4 transition-colors ${
        isDragOver ? "border-destructive border-2 bg-destructive/10" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="trash-zone"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-medium">
            Cestino ({trashedPhotos.length})
          </h3>
        </div>
        {trashedPhotos.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onEmptyTrash}
            data-testid="button-empty-trash"
          >
            Svuota Cestino
          </Button>
        )}
      </div>

      {trashedPhotos.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Trash2 className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Trascina qui le foto da eliminare
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Le foto verranno eliminate al riavvio
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {trashedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-md overflow-hidden bg-muted group"
              data-testid={`trash-photo-${photo.id}`}
            >
              <img
                src={photo.url}
                alt={photo.filename}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-destructive/20" />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-1 right-1 w-6 h-6"
                onClick={() => onRestore(photo.id)}
                data-testid={`button-restore-${photo.id}`}
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
