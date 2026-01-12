import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Photo } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PhotoGrid } from "@/components/PhotoGrid";
import { UploadZone } from "@/components/UploadZone";
import { TrashZone } from "@/components/TrashZone";
import { ControlBar } from "@/components/ControlBar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { UpgradeBanner } from "@/components/UpgradeBanner";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManagementPage() {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  const { data: license } = useQuery<{ isPro: boolean }>({
    queryKey: ["/api/license"],
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const trashMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/photos/${id}/trash`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
    },
  });

  const bulkTrashMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await apiRequest("POST", "/api/photos/bulk-trash", { photoIds: ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      setSelectedIds([]);
      toast({
        title: "Operazione completata",
        description: "Le foto selezionate sono state spostate nel cestino.",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile spostare le foto nel cestino.",
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && over.id === "trash-zone") {
      trashMutation.mutate(active.id as string);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (!photos) return;
    const activeIds = photos.filter(p => !p.isTrash).map(p => p.id.toString());
    setSelectedIds(activeIds);
  };

  const deselectAll = () => setSelectedIds([]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activePhotosCount = photos?.filter(p => !p.isTrash).length || 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <ControlBar />
      <main className="container mx-auto px-4 pt-24">
        {!license?.isPro && <UpgradeBanner />}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Le tue Foto</h2>
                <div className="flex gap-2">
                  {activePhotosCount > 0 && (
                    <Button variant="outline" size="sm" onClick={selectedIds.length === activePhotosCount ? deselectAll : selectAll}>
                      {selectedIds.length === activePhotosCount ? "Deseleziona" : "Seleziona Tutto"}
                    </Button>
                  )}
                  {selectedIds.length > 0 && (
                    <Button variant="destructive" size="sm" onClick={() => bulkTrashMutation.mutate(selectedIds)} disabled={bulkTrashMutation.isPending}>
                      Sposta {selectedIds.length} nel Cestino
                    </Button>
                  )}
                </div>
              </div>
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <PhotoGrid photos={photos || []} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
                <div className="fixed bottom-8 right-8 z-50">
                  <TrashZone />
                </div>
              </DndContext>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Carica Nuove Foto</h2>
              <UploadZone />
            </section>
          </div>
          <div className="lg:col-span-1">
            <SettingsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
