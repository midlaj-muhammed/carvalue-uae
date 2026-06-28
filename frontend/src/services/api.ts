import axios from "axios";
import type {
  APIResponse,
  PredictionRequest,
  PredictionResult,
  MakesData,
  ModelsData,
  HealthData,
} from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// Unwrap { success, data, error } envelope
api.interceptors.response.use(
  (res) => {
    const body = res.data as APIResponse<unknown>;
    if (!body.success) {
      return Promise.reject(new Error(body.error || "Unknown error"));
    }
    return { ...res, data: body.data };
  },
  (err) => {
    if (err.response?.data?.error) {
      return Promise.reject(new Error(err.response.data.error));
    }
    return Promise.reject(err);
  }
);

export async function getMakes(): Promise<MakesData> {
  const res = await api.get("/api/v1/makes");
  return res.data as MakesData;
}

export async function getModels(make: string): Promise<ModelsData> {
  const res = await api.get(`/api/v1/models?make=${encodeURIComponent(make)}`);
  return res.data as ModelsData;
}

export async function getHealth(): Promise<HealthData> {
  const res = await api.get("/api/v1/health");
  return res.data as HealthData;
}

export async function predict(
  payload: PredictionRequest
): Promise<PredictionResult> {
  const res = await api.post("/api/v1/predict", payload);
  return res.data as PredictionResult;
}
