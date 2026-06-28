import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PredictionForm from "@/components/PredictionForm/PredictionForm";
import ResultCard from "@/components/ResultCard/ResultCard";
import { usePredictionStore } from "@/store/predictionStore";

export default function PredictPage() {
  const lastResult = usePredictionStore((s) => s.lastResult);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-gold/[0.06] via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-radial from-gold/[0.04] via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
      </div>

      <Header />

      <main className="flex-1 relative z-10 pt-8 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/[0.08] border border-gold/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-gold/80 font-body">
                AI-Powered Valuation
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-[1.1] tracking-tight">
              Know Your Car's{" "}
              <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                True Value
              </span>
            </h1>
            <p className="mt-4 text-[15px] text-white/40 font-body max-w-md mx-auto leading-relaxed">
              Get instant, data-driven price estimates for any used car in the UAE market.
            </p>
          </div>

          <PredictionForm />
          {lastResult && <ResultCard result={lastResult} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
