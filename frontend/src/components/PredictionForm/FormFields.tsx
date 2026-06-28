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
      <p className="text-[11px] text-red-500 mt-1.5 font-geist">
        {errors[field]?.message}
      </p>
    );

  const inputClass =
    "w-full h-[52px] px-4 bg-linen border border-obsidian/[0.06] rounded-full text-[15px] text-obsidian font-geist placeholder:text-ash focus:outline-none focus:border-obsidian/30 focus:bg-paper";

  const labelClass =
    "block text-[11px] font-medium uppercase tracking-[0.14em] text-graphite mb-2 font-geist";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
      {/* Make */}
      <div>
        <label className={labelClass}>Make</label>
        <select {...register("make")} className={inputClass} defaultValue="">
          <option value="" className="bg-paper">
            Select make...
          </option>
          {makes.map((m) => (
            <option key={m} value={m} className="bg-paper">
              {m}
            </option>
          ))}
        </select>
        {err("make")}
      </div>

      {/* Model */}
      <div>
        <label className={labelClass}>Model</label>
        <select
          {...register("model")}
          className={inputClass}
          disabled={!selectedMake}
          defaultValue=""
        >
          <option value="" className="bg-paper">
            {selectedMake ? "Select model..." : "Select make first"}
          </option>
          {models.map((m) => (
            <option key={m} value={m} className="bg-paper">
              {m}
            </option>
          ))}
        </select>
        {err("model")}
      </div>

      {/* Year */}
      <div>
        <label className={labelClass}>Year</label>
        <input
          type="number"
          {...register("year")}
          placeholder="2020"
          className={inputClass}
          defaultValue=""
        />
        {err("year")}
      </div>

      {/* Mileage */}
      <div>
        <label className={labelClass}>Mileage (KM)</label>
        <input
          type="number"
          {...register("mileage")}
          placeholder="85,000"
          className={inputClass}
          defaultValue=""
        />
        {err("mileage")}
      </div>

      {/* Body Type */}
      <div>
        <label className={labelClass}>Body Type</label>
        <select {...register("body_type")} className={inputClass} defaultValue="">
          <option value="" className="bg-paper">
            Select body type...
          </option>
          {BODY_TYPES.map((bt) => (
            <option key={bt} value={bt} className="bg-paper">
              {bt}
            </option>
          ))}
        </select>
        {err("body_type")}
      </div>

      {/* Cylinders */}
      <div>
        <label className={labelClass}>Cylinders</label>
        <select {...register("cylinders")} className={inputClass} defaultValue="">
          <option value="" className="bg-paper">
            Select cylinders...
          </option>
          {CYLINDERS.map((c) => (
            <option key={c} value={c} className="bg-paper">
              {c}
            </option>
          ))}
        </select>
        {err("cylinders")}
      </div>

      {/* Transmission */}
      <div>
        <label className={labelClass}>Transmission</label>
        <select {...register("transmission")} className={inputClass} defaultValue="">
          <option value="" className="bg-paper">
            Select transmission...
          </option>
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t} className="bg-paper">
              {t}
            </option>
          ))}
        </select>
        {err("transmission")}
      </div>

      {/* Fuel Type */}
      <div>
        <label className={labelClass}>Fuel Type</label>
        <select {...register("fuel_type")} className={inputClass} defaultValue="">
          <option value="" className="bg-paper">
            Select fuel type...
          </option>
          {FUEL_TYPES.map((f) => (
            <option key={f} value={f} className="bg-paper">
              {f}
            </option>
          ))}
        </select>
        {err("fuel_type")}
      </div>

      {/* Color */}
      <div>
        <label className={labelClass}>Color</label>
        <select {...register("color")} className={inputClass} defaultValue="">
          <option value="" className="bg-paper">
            Select color...
          </option>
          {COLORS.map((c) => (
            <option key={c} value={c} className="bg-paper">
              {c}
            </option>
          ))}
        </select>
        {err("color")}
      </div>

      {/* Location */}
      <div>
        <label className={labelClass}>Location</label>
        <select {...register("location")} className={inputClass} defaultValue="">
          <option value="" className="bg-paper">
            Select location...
          </option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l} className="bg-paper">
              {l}
            </option>
          ))}
        </select>
        {err("location")}
      </div>
    </div>
  );
}
