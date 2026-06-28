import { Control, Controller, UseFormRegister, FieldErrors } from "react-hook-form";
import type { PredictionFormData } from "./schema";
import {
  BODY_TYPES,
  CYLINDERS,
  TRANSMISSIONS,
  FUEL_TYPES,
  COLORS,
  LOCATIONS,
} from "./schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface Props {
  control: Control<PredictionFormData>;
  register: UseFormRegister<PredictionFormData>;
  errors: FieldErrors<PredictionFormData>;
  makes: string[];
  models: string[];
  selectedMake: string;
}

export default function FormFields({
  control,
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
        <Controller
          name="make"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select make..." />
              </SelectTrigger>
              <SelectContent>
                {makes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {err("make")}
      </div>

      {/* Model */}
      <div>
        <label className={labelClass}>Model</label>
        <Controller
          name="model"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={!selectedMake}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedMake ? "Select model..." : "Select make first"} />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
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
        <Controller
          name="body_type"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select body type..." />
              </SelectTrigger>
              <SelectContent>
                {BODY_TYPES.map((bt) => (
                  <SelectItem key={bt} value={bt}>
                    {bt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {err("body_type")}
      </div>

      {/* Cylinders */}
      <div>
        <label className={labelClass}>Cylinders</label>
        <Controller
          name="cylinders"
          control={control}
          defaultValue={undefined}
          render={({ field }) => (
            <Select
              value={field.value?.toString() || ""}
              onValueChange={(v) => field.onChange(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cylinders..." />
              </SelectTrigger>
              <SelectContent>
                {CYLINDERS.map((c) => (
                  <SelectItem key={c} value={c.toString()}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {err("cylinders")}
      </div>

      {/* Transmission */}
      <div>
        <label className={labelClass}>Transmission</label>
        <Controller
          name="transmission"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transmission..." />
              </SelectTrigger>
              <SelectContent>
                {TRANSMISSIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {err("transmission")}
      </div>

      {/* Fuel Type */}
      <div>
        <label className={labelClass}>Fuel Type</label>
        <Controller
          name="fuel_type"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type..." />
              </SelectTrigger>
              <SelectContent>
                {FUEL_TYPES.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {err("fuel_type")}
      </div>

      {/* Color */}
      <div>
        <label className={labelClass}>Color</label>
        <Controller
          name="color"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color..." />
              </SelectTrigger>
              <SelectContent>
                {COLORS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {err("color")}
      </div>

      {/* Location */}
      <div>
        <label className={labelClass}>Location</label>
        <Controller
          name="location"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location..." />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {err("location")}
      </div>
    </div>
  );
}
