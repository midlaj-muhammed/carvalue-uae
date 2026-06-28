import { UseFormRegister, FieldErrors } from "react-hook-form";
import type { PredictionFormData } from "./schema";
import {
  BODY_TYPES,
  CYLINDERS,
  TRANSMISSIONS,
  FUEL_TYPES,
  COLORS,
  LOCATIONS,
} from "./schema";

interface Props {
  register: UseFormRegister<PredictionFormData>;
  errors: FieldErrors<PredictionFormData>;
  makes: string[];
  models: string[];
  selectedMake: string;
}

export default function FormFields({
  register,
  errors,
  makes,
  models,
  selectedMake,
}: Props) {
  const err = (field: keyof PredictionFormData) =>
    errors[field] && (
      <p className="text-[11px] text-red-400 mt-1.5 font-body">
        {errors[field]?.message}
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
      {/* Make */}
      <div className="animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
        <label className="label-glass">Make</label>
        <select {...register("make")} className="input-glass" defaultValue="">
          <option value="" className="bg-midnight">
            Select make...
          </option>
          {makes.map((m) => (
            <option key={m} value={m} className="bg-midnight">
              {m}
            </option>
          ))}
        </select>
        {err("make")}
      </div>

      {/* Model */}
      <div className="animate-fade-in" style={{ animationDelay: "0.25s", opacity: 0 }}>
        <label className="label-glass">Model</label>
        <select
          {...register("model")}
          className="input-glass"
          disabled={!selectedMake}
          defaultValue=""
        >
          <option value="" className="bg-midnight">
            {selectedMake ? "Select model..." : "Select make first"}
          </option>
          {models.map((m) => (
            <option key={m} value={m} className="bg-midnight">
              {m}
            </option>
          ))}
        </select>
        {err("model")}
      </div>

      {/* Year */}
      <div className="animate-fade-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
        <label className="label-glass">Year</label>
        <input
          type="number"
          {...register("year")}
          placeholder="2020"
          className="input-glass"
          defaultValue=""
        />
        {err("year")}
      </div>

      {/* Mileage */}
      <div className="animate-fade-in" style={{ animationDelay: "0.35s", opacity: 0 }}>
        <label className="label-glass">Mileage (KM)</label>
        <input
          type="number"
          {...register("mileage")}
          placeholder="85,000"
          className="input-glass"
          defaultValue=""
        />
        {err("mileage")}
      </div>

      {/* Body Type */}
      <div className="animate-fade-in" style={{ animationDelay: "0.4s", opacity: 0 }}>
        <label className="label-glass">Body Type</label>
        <select {...register("body_type")} className="input-glass" defaultValue="">
          <option value="" className="bg-midnight">
            Select body type...
          </option>
          {BODY_TYPES.map((bt) => (
            <option key={bt} value={bt} className="bg-midnight">
              {bt}
            </option>
          ))}
        </select>
        {err("body_type")}
      </div>

      {/* Cylinders */}
      <div className="animate-fade-in" style={{ animationDelay: "0.45s", opacity: 0 }}>
        <label className="label-glass">Cylinders</label>
        <select {...register("cylinders")} className="input-glass" defaultValue="">
          <option value="" className="bg-midnight">
            Select cylinders...
          </option>
          {CYLINDERS.map((c) => (
            <option key={c} value={c} className="bg-midnight">
              {c}
            </option>
          ))}
        </select>
        {err("cylinders")}
      </div>

      {/* Transmission */}
      <div className="animate-fade-in" style={{ animationDelay: "0.5s", opacity: 0 }}>
        <label className="label-glass">Transmission</label>
        <select
          {...register("transmission")}
          className="input-glass"
          defaultValue=""
        >
          <option value="" className="bg-midnight">
            Select transmission...
          </option>
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t} className="bg-midnight">
              {t}
            </option>
          ))}
        </select>
        {err("transmission")}
      </div>

      {/* Fuel Type */}
      <div className="animate-fade-in" style={{ animationDelay: "0.55s", opacity: 0 }}>
        <label className="label-glass">Fuel Type</label>
        <select
          {...register("fuel_type")}
          className="input-glass"
          defaultValue=""
        >
          <option value="" className="bg-midnight">
            Select fuel type...
          </option>
          {FUEL_TYPES.map((ft) => (
            <option key={ft} value={ft} className="bg-midnight">
              {ft}
            </option>
          ))}
        </select>
        {err("fuel_type")}
      </div>

      {/* Color */}
      <div className="animate-fade-in" style={{ animationDelay: "0.6s", opacity: 0 }}>
        <label className="label-glass">Color</label>
        <select {...register("color")} className="input-glass" defaultValue="">
          <option value="" className="bg-midnight">
            Select color...
          </option>
          {COLORS.map((c) => (
            <option key={c} value={c} className="bg-midnight">
              {c}
            </option>
          ))}
        </select>
        {err("color")}
      </div>

      {/* Location */}
      <div className="animate-fade-in" style={{ animationDelay: "0.65s", opacity: 0 }}>
        <label className="label-glass">Location</label>
        <select
          {...register("location")}
          className="input-glass"
          defaultValue=""
        >
          <option value="" className="bg-midnight">
            Select location...
          </option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l} className="bg-midnight">
              {l}
            </option>
          ))}
        </select>
        {err("location")}
      </div>
    </div>
  );
}
