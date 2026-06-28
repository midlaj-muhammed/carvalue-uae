import { useQuery } from "@tanstack/react-query";
import { getModels } from "@/services/api";

export function useModels(make: string | null) {
  return useQuery({
    queryKey: ["models", make],
    queryFn: () => getModels(make!),
    enabled: !!make,
    staleTime: Infinity,
  });
}
