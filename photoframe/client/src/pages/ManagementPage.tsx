import { useState } from "react";
import { Play, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import UploadZone from "@/components/UploadZone";
import PhotoGrid from "@/components/PhotoGrid";
import { UpgradeBanner } from "@/components/UpgradeBanner";
import { LicenseDialog } from "@/components/LicenseDialog";
import { useLicense } from "@/hooks/useLicense";

interface Photo {
  id: string;
  url: string;
  filename: string;
  inTrash?: boolean;
}

interface ManagementPageProps {
  photos: Photo[];
  trashedPhotos: Photo[];
  onUpload: (files: FileList) => void;
  onDelete: (id: string) => void;
  onMoveToTrash: (id: string) => void;
  onRestore: (id: string) => void;
  onEmptyTrash: () => void;
  onStartSlideshow: () => void;
}

export default function ManagementPage({
  photos,
  trashedPhotos,
  onUpload,
  onDelete,
  onMoveToTrash,
  onRestore,
  onEmptyTrash,
  onStartSlideshow,
}: ManagementPageProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const { isPro, isTrial, isExpired, daysRemaining } = useLicense();

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
      onMoveToTrash(photoId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">PhotoFrame</h1>
          <Button
            onClick={onStartSlideshow}
            disabled={photos.length === 0}
            data-testid="button-start-slideshow"
          >
            <Play className="w-4 h-4 mr-2" />
            Avvia Slideshow
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {!isPro && (isTrial || isExpired) && (
            <UpgradeBanner 
              onUpgrade={() => setShowLicenseDialog(true)} 
              isTrial={isTrial}
              isExpired={isExpired}
              daysRemaining={daysRemaining}
            />
          )}

          <section>
            <h2 className="text-lg font-medium mb-4">Carica Foto</h2>
            <UploadZone onFilesSelected={onUpload} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">
                Galleria Foto ({photos.length})
              </h2>
              {(isPro || isTrial) && trashedPhotos.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Trascina le foto nel cestino per eliminarle
                </p>
              )}
            </div>
            <PhotoGrid 
              photos={photos} 
              onDelete={onDelete}
              enableDrag={isPro || isTrial}
            />
          </section>

          {(isPro || isTrial) && (
            <section>
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
          </section>
          )}
        </div>
      </main>

      <LicenseDialog 
        open={showLicenseDialog} 
        onOpenChange={setShowLicenseDialog} 
      />
    </div>
  );
}
