import { useCallback } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onFilesSelected: (files: FileList) => void;
}

export default function UploadZone({ onFilesSelected }: UploadZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesSelected(e.dataTransfer.files);
      }
    },
    [onFilesSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFilesSelected(e.target.files);
      }
    },
    [onFilesSelected]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-border rounded-lg p-12 text-center hover-elevate transition-colors"
      data-testid="upload-zone"
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">Carica le tue foto</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Trascina le immagini qui o clicca per selezionare
      </p>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileInput}
        data-testid="input-file-upload"
      />
      <Button asChild variant="default">
        <label htmlFor="file-upload" className="cursor-pointer" data-testid="button-select-files">
          Seleziona File
        </label>
      </Button>
      <p className="text-xs text-muted-foreground mt-4">
        Formati supportati: JPEG, PNG, WebP
      </p>
    </div>
  );
}
