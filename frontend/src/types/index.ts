export interface PredictionRequest {
  make: string;
  model: string;
  year: number;
  mileage: number;
  body_type: string;
  cylinders: number;
  transmission: string;
  fuel_type: string;
  color: string;
  location: string;
}

export interface PredictionResult {
  predicted_price: number;
  price_min: number;
  price_max: number;
  currency: string;
  confidence_level: string;
  listing_count: number;
  confidence_note: string;
  model_version: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export interface MakesData {
  makes: string[];
  total: number;
}

export interface ModelsData {
  make: string;
  models: string[];
  total: number;
}

export interface HealthData {
  status: string;
  version: string;
  model_loaded: boolean;
}
