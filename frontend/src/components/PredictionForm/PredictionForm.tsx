import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { useMakes } from "@/hooks/useMakes";
import { useModels } from "@/hooks/useModels";
import { usePrediction } from "@/hooks/usePrediction";
import { usePredictionStore } from "@/store/predictionStore";
import { predictionSchema, type PredictionFormData } from "./schema";
import FormFields from "./FormFields";

export default function PredictionForm() {
  const { data: makesData } = useMakes();
  const makes = makesData?.makes ?? [];

  const {
    register,
    handleSubmit,
    watch,
    control,
    resetField,
    formState: { errors },
  } = useForm<PredictionFormData>({
    resolver: zodResolver(predictionSchema),
  });

  const selectedMake = watch("make") || "";
  const { data: modelsData } = useModels(selectedMake || null);
  const models = modelsData?.models ?? [];

  useEffect(() => {
    if (selectedMake) {
      resetField("model");
    }
  }, [selectedMake, resetField]);

  const mutation = usePrediction();
  const setLastResult = usePredictionStore((s) => s.setLastResult);
  const setLastRequest = usePredictionStore((s) => s.setLastRequest);

  const onSubmit = (data: PredictionFormData) => {
    setLastResult(null);
    const payload = {
      ...data,
      make: data.make.toLowerCase(),
      model: data.model.toLowerCase(),
      fuel_type: data.fuel_type.toLowerCase(),
      color: data.color.toLowerCase(),
      location: data.location,
      body_type: data.body_type,
      transmission: data.transmission,
    };
    setLastRequest(payload);
    mutation.mutate(payload, {
      onSuccess: (result) => setLastResult(result),
    });
  };

  return (
    <div className="p-[6px] rounded-[2rem] bg-obsidian/[0.04] border border-obsidian/[0.06]">
      <div className="bg-paper rounded-[calc(2rem-6px)] p-8 sm:p-10">
        {/* Eyebrow tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linen border border-obsidian/[0.06] mb-8">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-graphite">
            Vehicle Details
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormFields
            control={control}
            register={register}
            errors={errors}
            makes={makes}
            models={models}
            selectedMake={selectedMake}
          />

          {/* Error feedback */}
          {mutation.isError && (
            <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-[13px] text-red-600 font-geist">
                {mutation.error instanceof Error ? mutation.error.message : "Something went wrong. Please try again."}
              </p>
            </div>
          )}

          {/* Submit — Button-in-Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={mutation.isPending}
              aria-disabled={mutation.isPending}
              aria-busy={mutation.isPending}
              className="group btn-press w-full flex items-center justify-between h-[52px] rounded-full pl-7 pr-2 bg-onyx text-paper font-geist font-medium text-[13px] tracking-wide uppercase
                         hover:bg-obsidian/90
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors duration-200"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing Market Data...</span>
                </span>
              ) : (
                <span>Get Estimate</span>
              )}
              <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:scale-105 transition-all duration-200 flex-shrink-0">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
