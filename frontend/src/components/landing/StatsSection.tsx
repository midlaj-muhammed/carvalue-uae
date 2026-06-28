import { ScrollReveal } from "@/components/ui/ScrollReveal";

const stats = [
  { figure: "65", label: "Makes Supported" },
  { figure: "10K+", label: "UAE Listings" },
  { figure: "AED", label: "Real-Time Predictions" },
];

export default function StatsSection() {
  return (
    <section className="border-y border-obsidian/[0.06]">
      <div className="container-editorial py-24 sm:py-32 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 80}>
            <div className="stat-mono">{s.figure}</div>
            <div className="mt-3 text-[11px] font-geist font-medium text-graphite uppercase tracking-[0.14em]">
              {s.label}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
