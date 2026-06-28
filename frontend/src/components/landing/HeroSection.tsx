import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-40 pb-28 sm:pt-48 sm:pb-36 container-editorial">
      <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 lg:gap-20 items-center">
        {/* Left — Copy */}
        <div>
          {/* Eyebrow — fades in immediately */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linen border border-obsidian/[0.06] mb-8"
            style={{
              opacity: 0,
              animation: "fadeIn 500ms cubic-bezier(0.23,1,0.32,1) 100ms forwards",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-onyx" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-graphite">
              AI-Powered Valuation
            </span>
          </div>

          {/* Headline — slides up from below */}
          <h1
            className="font-geist font-bold text-obsidian leading-[1.02] tracking-tight text-5xl sm:text-6xl lg:text-[72px]"
            style={{
              opacity: 0,
              animation: "fadeInUp 500ms cubic-bezier(0.23,1,0.32,1) 200ms forwards",
            }}
          >
            Know What
            <br />
            Your Car Is
            <br />
            Worth
          </h1>

          <p
            className="mt-8 text-lg text-graphite font-geist leading-relaxed max-w-md"
            style={{
              opacity: 0,
              animation: "fadeInUp 500ms cubic-bezier(0.23,1,0.32,1) 300ms forwards",
            }}
          >
            AI-powered price predictions for the UAE used car market.
            Instant, data-driven, and free.
          </p>

          {/* CTA — Button-in-Button, delayed entrance */}
          <div
            className="mt-12 flex items-center gap-5"
            style={{
              opacity: 0,
              animation: "fadeInUp 500ms cubic-bezier(0.23,1,0.32,1) 400ms forwards",
            }}
          >
            <Link
              to="/predict"
              className="group btn-press inline-flex items-center gap-2.5 bg-onyx text-paper pl-7 pr-2 py-2.5 rounded-full text-[13px] font-medium tracking-wide hover:bg-obsidian/90 transition-colors duration-200 no-underline"
            >
              <span>Start Valuing</span>
              <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:scale-105 transition-all duration-200">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
            <a
              href="#features"
              className="text-obsidian text-[13px] font-medium tracking-wide hover:text-graphite transition-colors duration-200 no-underline"
            >
              See how it works &rarr;
            </a>
          </div>
        </div>

        {/* Right — Image with Double-Bezel, delayed entrance */}
        <div
          className="relative"
          style={{
            opacity: 0,
            animation: "fadeIn 600ms cubic-bezier(0.23,1,0.32,1) 300ms forwards",
          }}
        >
          <div className="p-2 rounded-[2rem] bg-obsidian/[0.04] border border-obsidian/[0.06]">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80"
              alt="Luxury car"
              className="w-full aspect-[4/3] object-cover rounded-[calc(2rem-0.375rem)]"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
