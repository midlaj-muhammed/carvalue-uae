import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function CTASection() {
  return (
    <section className="bg-onyx py-28 sm:py-40">
      <div className="container-editorial text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.08] mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50">
              Get Started
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <h2 className="font-geist font-medium text-paper text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-8 leading-[1.1]">
            Ready to Know Your
            <br />
            Car's Value?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p className="text-graphite text-lg font-geist mb-12 max-w-md mx-auto leading-relaxed">
            Join thousands of UAE car owners who trust CarValue for accurate price predictions.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <Link
            to="/predict"
            className="group btn-press inline-flex items-center gap-2.5 bg-paper text-onyx pl-7 pr-2 py-2.5 rounded-full text-[13px] font-medium tracking-wide hover:bg-paper/90 transition-colors duration-200 no-underline"
          >
            <span>Start Valuing</span>
            <span className="w-8 h-8 rounded-full bg-onyx/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:scale-105 transition-all duration-200">
              <ArrowRight className="w-3.5 h-3.5 text-onyx" />
            </span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
