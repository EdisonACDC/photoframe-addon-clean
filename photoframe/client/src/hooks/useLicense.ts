import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface LicenseStatus {
  hasLicense: boolean;
  isValid: boolean;
  isPro: boolean;
  isTrial: boolean;
  isExpired: boolean;
  daysRemaining: number;
}

export function useLicense() {
  const { data, isLoading } = useQuery<LicenseStatus>({
    queryKey: ["/api/license"],
    staleTime: Infinity, // License doesn't change often
  });

  const activateMutation = useMutation({
    mutationFn: async (licenseKey: string) => {
      return apiRequest("/api/license/activate", {
        method: "POST",
        body: { licenseKey }, // apiRequest will JSON.stringify automatically
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/license"] });
    },
  });

  return {
    isPro: data?.isPro || false,
    hasLicense: data?.hasLicense || false,
    isValid: data?.isValid || false,
    isTrial: data?.isTrial || false,
    isExpired: data?.isExpired || false,
    daysRemaining: data?.daysRemaining || 0,
    isLoading,
    activate: activateMutation.mutate,
    isActivating: activateMutation.isPending,
    activationError: activateMutation.error,
  };
}
