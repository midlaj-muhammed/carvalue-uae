import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight } from "lucide-react";
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
    <div className="bg-paper border border-border-light rounded-editorial p-8 sm:p-10">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-border-light" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-ash font-geist whitespace-nowrap">
          Vehicle Details
        </span>
        <div className="h-px flex-1 bg-border-light" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormFields
          register={register}
          errors={errors}
          makes={makes}
          models={models}
          selectedMake={selectedMake}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-8 w-full h-[52px] rounded-pill font-geist font-medium text-[13px] tracking-wide uppercase
                     bg-onyx text-paper
                     hover:bg-obsidian/90
                     active:scale-[0.98]
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200 ease-out
                     flex items-center justify-center gap-2.5"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing Market Data...</span>
            </>
          ) : (
            <>
              <span>Get Estimate</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
