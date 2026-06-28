import { RotateCcw, TrendingUp, TrendingDown, Info } from "lucide-react";
import type { PredictionResult } from "@/types";
import { usePredictionStore } from "@/store/predictionStore";
import PriceDisplay from "./PriceDisplay";

interface Props {
  result: PredictionResult;
}

const confidenceConfig: Record<string, { label: string; color: string }> = {
  high: { label: "High Confidence", color: "text-emerald-600" },
  medium: { label: "Medium Confidence", color: "text-amber-600" },
  low: { label: "Low Confidence", color: "text-orange-600" },
};

export default function ResultCard({ result }: Props) {
  const reset = usePredictionStore((s) => s.reset);
  const conf = confidenceConfig[result.confidence_level] ?? confidenceConfig.medium;

  return (
    <div className="mt-8 animate-scale-in">
      <div className="p-[6px] rounded-[2rem] bg-obsidian/[0.04] border border-obsidian/[0.06]">
        <div className="bg-paper rounded-[calc(2rem-6px)] p-8 sm:p-10">
          {/* Header with eyebrow + button-in-button reset */}
          <div className="flex items-center justify-between mb-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linen border border-obsidian/[0.06]">
              <TrendingUp className="h-3 w-3 text-obsidian" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-graphite">
                Estimated Value
              </span>
            </div>
            {/* Reset button — button-in-button */}
            <button
              onClick={reset}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linen border border-obsidian/[0.06]
                         hover:bg-sand/40 transition-colors duration-200"
              title="New prediction"
            >
              <span className="text-[11px] font-medium text-graphite group-hover:text-obsidian transition-colors duration-200">
                Reset
              </span>
              <span className="w-6 h-6 rounded-full bg-obsidian/[0.06] flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                <RotateCcw className="h-3 w-3 text-graphite group-hover:text-obsidian transition-colors duration-200" />
              </span>
            </button>
          </div>

          {/* Price */}
          <PriceDisplay price={result.predicted_price} />

          {/* Range bar */}
          <div className="mt-6 mb-8">
            <div className="flex items-center justify-between text-[12px] text-graphite font-geist mb-2">
              <span className="flex items-center gap-1.5">
                <TrendingDown className="h-3 w-3" />
                AED {result.price_min.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                AED {result.price_max.toLocaleString()}
                <TrendingUp className="h-3 w-3" />
              </span>
            </div>
            <div className="h-1.5 bg-linen rounded-full overflow-hidden">
              <div
                className="h-full bg-onyx rounded-full"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-4 pt-6 border-t border-obsidian/[0.06]">
            <div className={`flex items-center gap-2 ${conf.color}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              <span className="text-[12px] font-medium font-geist tracking-wide">
                {conf.label}
              </span>
            </div>
            <div className="h-3 w-px bg-obsidian/[0.06]" />
            <div className="flex items-center gap-1.5 text-ash">
              <Info className="h-3 w-3" />
              <span className="text-[12px] font-geist">
                {result.confidence_note}
              </span>
            </div>
          </div>

          {/* Model version */}
          <p className="text-[10px] text-ash mt-5 font-geist tracking-wide">
            v{result.model_version}
          </p>
        </div>
      </div>
    </div>
  );
}
