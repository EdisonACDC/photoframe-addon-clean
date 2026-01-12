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
import { Loader2 } from "lucide-react";

export default function ManagementPage() {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && over.id === "trash-zone") {
      trashMutation.mutate(active.id as string);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <ControlBar />
      <main className="container mx-auto px-4 pt-24">
        {!license?.isPro && <UpgradeBanner />}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Le tue Foto</h2>
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <PhotoGrid photos={photos || []} />
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
