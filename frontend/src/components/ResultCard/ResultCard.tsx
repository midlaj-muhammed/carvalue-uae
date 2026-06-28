import { RotateCcw, TrendingUp, TrendingDown, Info } from "lucide-react";
import type { PredictionResult } from "@/types";
import { usePredictionStore } from "@/store/predictionStore";
import PriceDisplay from "./PriceDisplay";

interface Props {
  result: PredictionResult;
}

const confidenceConfig: Record<string, { label: string; color: string; glow: string }> = {
  high: {
    label: "High Confidence",
    color: "text-emerald-400",
    glow: "shadow-emerald-400/20",
  },
  medium: {
    label: "Medium Confidence",
    color: "text-amber-400",
    glow: "shadow-amber-400/20",
  },
  low: {
    label: "Low Confidence",
    color: "text-orange-400",
    glow: "shadow-orange-400/20",
  },
};

export default function ResultCard({ result }: Props) {
  const reset = usePredictionStore((s) => s.reset);
  const conf = confidenceConfig[result.confidence_level] ?? confidenceConfig.medium;

  return (
    <div className="mt-8 animate-scale-in">
      <div className="card-glass p-8 sm:p-10 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/[0.06] to-transparent rounded-bl-[80px]" />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <h3 className="text-[13px] uppercase tracking-[0.12em] text-white/50 font-body">
              Estimated Value
            </h3>
          </div>
          <button
            onClick={reset}
            className="group w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center
                       hover:bg-white/[0.08] hover:border-gold/20 transition-all duration-300"
            title="New prediction"
          >
            <RotateCcw className="h-3.5 w-3.5 text-white/40 group-hover:text-gold transition-colors" />
          </button>
        </div>

        {/* Price */}
        <PriceDisplay price={result.predicted_price} />

        {/* Range bar */}
        <div className="mt-6 mb-8">
          <div className="flex items-center justify-between text-[12px] text-white/30 font-body mb-2">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="h-3 w-3" />
              AED {result.price_min.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              AED {result.price_max.toLocaleString()}
              <TrendingUp className="h-3 w-3" />
            </span>
          </div>
          <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold/40 via-gold to-gold/40 rounded-full"
              style={{
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* Confidence */}
        <div className="flex items-center gap-4 pt-6 border-t border-white/[0.06]">
          <div className={`flex items-center gap-2 ${conf.color}`}>
            <span className={`w-2 h-2 rounded-full bg-current shadow-sm ${conf.glow}`} />
            <span className="text-[12px] font-medium font-body tracking-wide">
              {conf.label}
            </span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5 text-white/30">
            <Info className="h-3 w-3" />
            <span className="text-[12px] font-body">
              {result.confidence_note}
            </span>
          </div>
        </div>

        {/* Model version */}
        <p className="text-[10px] text-white/15 mt-5 font-body tracking-wide">
          v{result.model_version}
        </p>
      </div>
    </div>
  );
}
