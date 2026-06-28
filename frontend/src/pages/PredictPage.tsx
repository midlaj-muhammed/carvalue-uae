import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PredictionForm from "@/components/PredictionForm/PredictionForm";
import ResultCard from "@/components/ResultCard/ResultCard";
import { usePredictionStore } from "@/store/predictionStore";

export default function PredictPage() {
  const lastResult = usePredictionStore((s) => s.lastResult);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-obsidian font-geist">
      <Header />

      <main className="flex-1 pt-10 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-linen border border-border-light mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-obsidian" />
              <span className="text-[11px] uppercase tracking-[0.14em] font-medium text-graphite">
                AI-Powered Valuation
              </span>
            </div>
            <h1 className="font-geist font-bold text-obsidian leading-[1.05] tracking-tight text-4xl sm:text-5xl">
              Know Your Car's{" "}
              <span className="text-obsidian">True Value</span>
            </h1>
            <p className="mt-4 text-[15px] text-graphite font-geist max-w-md mx-auto leading-relaxed">
              Get instant, data-driven price estimates for any used car in the UAE market.
            </p>
          </div>

          <PredictionForm />
          {lastResult && <ResultCard result={lastResult} />}
        </div>
      </main>

      <Footer theme="light" />
    </div>
  );
}
