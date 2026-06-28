import { z } from "zod";

const currentYear = new Date().getFullYear();

export const predictionSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(2005, "Year must be 2005 or later").max(currentYear, `Year must be ${currentYear} or earlier`),
  mileage: z.coerce.number().min(0, "Mileage cannot be negative").max(999999, "Mileage too high"),
  body_type: z.string().min(1, "Body type is required"),
  cylinders: z.coerce.number().min(0, "Cylinders required").max(12, "Cylinders cannot exceed 12"),
  transmission: z.string().min(1, "Transmission is required"),
  fuel_type: z.string().min(1, "Fuel type is required"),
  color: z.string().min(1, "Color is required"),
  location: z.string().min(1, "Location is required"),
});

export type PredictionFormData = z.infer<typeof predictionSchema>;

export const BODY_TYPES = ["Sedan", "SUV", "Coupe", "Hatchback", "Pickup Truck", "Van", "Truck", "Convertible", "Wagon", "Minivan"];

export const CYLINDERS = [3, 4, 5, 6, 8, 10, 12];

export const TRANSMISSIONS = ["Automatic Transmission", "Manual Transmission"];

export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];

export const COLORS = ["White", "Black", "Silver", "Grey", "Red", "Blue", "Other Color"];

export const LOCATIONS = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Al Ain", "Fujeirah", "Umm Al Qawain", "Ras Al Khaimah"];
