import { useState, useCallback, useEffect } from "react";
import { QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import SlideshowPage from "@/pages/SlideshowPage";
import ManagementPage from "@/pages/ManagementPage";

interface Photo {
  id: string;
  filename: string;
  filepath: string;
  uploadedAt: Date;
  inTrash: boolean;
}

function PhotoFrameApp() {
  const [isSlideshow, setIsSlideshow] = useState(false);
  const { toast } = useToast();

  const { data: photos = [], refetch } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("photos", file);
      });

      return apiRequest("/api/photos/upload", {
        method: "POST",
        body: formData,
        headers: {},
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Foto caricate",
        description: "Le foto sono state caricate con successo",
      });
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le foto",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/photos/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Foto eliminata",
        description: "La foto è stata eliminata con successo",
      });
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare la foto",
        variant: "destructive",
      });
    },
  });

  const moveToTrashMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/photos/${id}/trash`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Foto spostata nel cestino",
        description: "La foto verrà eliminata al riavvio",
      });
    },
    onError: (error) => {
      console.error("Move to trash error:", error);
      toast({
        title: "Errore",
        description: "Impossibile spostare la foto nel cestino",
        variant: "destructive",
      });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/photos/${id}/restore`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Foto ripristinata",
        description: "La foto è stata ripristinata dalla cestino",
      });
    },
    onError: (error) => {
      console.error("Restore error:", error);
      toast({
        title: "Errore",
        description: "Impossibile ripristinare la foto",
        variant: "destructive",
      });
    },
  });

  const emptyTrashMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/photos/empty-trash", {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Cestino svuotato",
        description: "Tutte le foto nel cestino sono state eliminate",
      });
    },
    onError: (error) => {
      console.error("Empty trash error:", error);
      toast({
        title: "Errore",
        description: "Impossibile svuotare il cestino",
        variant: "destructive",
      });
    },
  });

  const handleUpload = useCallback(
    (files: FileList) => {
      uploadMutation.mutate(files);
    },
    [uploadMutation]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const handleMoveToTrash = useCallback(
    (id: string) => {
      moveToTrashMutation.mutate(id);
    },
    [moveToTrashMutation]
  );

  const handleRestore = useCallback(
    (id: string) => {
      restoreMutation.mutate(id);
    },
    [restoreMutation]
  );

  const handleEmptyTrash = useCallback(() => {
    emptyTrashMutation.mutate();
  }, [emptyTrashMutation]);

  const handleStartSlideshow = useCallback(() => {
    setIsSlideshow(true);
  }, []);

  useEffect(() => {
    if (!isSlideshow) {
      refetch();
    }
  }, [isSlideshow, refetch]);

  const handleExitSlideshow = useCallback(() => {
    setIsSlideshow(false);
  }, []);

  // Convert absolute image paths to relative for Home Assistant Ingress compatibility
  const photosWithUrls = photos.map((photo) => ({
    ...photo,
    url: photo.filepath.startsWith('/') ? '.' + photo.filepath : photo.filepath,
  }));

  // Separate active and trashed photos
  const activePhotos = photosWithUrls.filter(p => !p.inTrash);
  const trashedPhotos = photosWithUrls.filter(p => p.inTrash);

  return (
    <>
      {isSlideshow ? (
        <SlideshowPage photos={activePhotos} onExit={handleExitSlideshow} />
      ) : (
        <ManagementPage
          photos={activePhotos}
          trashedPhotos={trashedPhotos}
          onUpload={handleUpload}
          onDelete={handleDelete}
          onMoveToTrash={handleMoveToTrash}
          onRestore={handleRestore}
          onEmptyTrash={handleEmptyTrash}
          onStartSlideshow={handleStartSlideshow}
        />
      )}
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PhotoFrameApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
