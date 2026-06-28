import { useQuery } from "@tanstack/react-query";
import { getMakes } from "@/services/api";

export function useMakes() {
  return useQuery({
    queryKey: ["makes"],
    queryFn: getMakes,
    staleTime: Infinity,
  });
}
