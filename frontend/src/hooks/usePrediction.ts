import { useMutation } from "@tanstack/react-query";
import { predict } from "@/services/api";
import type { PredictionRequest } from "@/types";

export function usePrediction() {
  return useMutation({
    mutationFn: (payload: PredictionRequest) => predict(payload),
  });
}
