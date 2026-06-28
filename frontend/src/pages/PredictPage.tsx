import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PredictionForm from "@/components/PredictionForm/PredictionForm";
import ResultCard from "@/components/ResultCard/ResultCard";
import { usePredictionStore } from "@/store/predictionStore";

export default function PredictPage() {
  const lastResult = usePredictionStore((s) => s.lastResult);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-obsidian font-geist">
      {/* Grain overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <Header />

      <main className="flex-1 pt-28 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12 animate-fade-in-up">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linen border border-obsidian/[0.06] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-onyx" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-graphite">
                AI-Powered Valuation
              </span>
            </div>
            <h1 className="font-geist font-bold text-obsidian leading-[1.02] tracking-tight text-4xl sm:text-5xl">
              Know Your Car's
              <br />
              True Value
            </h1>
            <p className="mt-6 text-[15px] text-graphite font-geist max-w-md mx-auto leading-relaxed">
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
