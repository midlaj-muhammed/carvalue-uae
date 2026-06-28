import { create } from "zustand";
import type { PredictionRequest, PredictionResult } from "@/types";

interface PredictionState {
  lastRequest: PredictionRequest | null;
  lastResult: PredictionResult | null;
  setLastRequest: (req: PredictionRequest) => void;
  setLastResult: (res: PredictionResult) => void;
  reset: () => void;
}

export const usePredictionStore = create<PredictionState>((set) => ({
  lastRequest: null,
  lastResult: null,
  setLastRequest: (req) => set({ lastRequest: req }),
  setLastResult: (res) => set({ lastResult: res }),
  reset: () => set({ lastRequest: null, lastResult: null }),
}));
