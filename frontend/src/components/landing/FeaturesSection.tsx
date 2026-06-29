import { Zap, MapPin, BarChart3, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const features = [
  {
    icon: Zap,
    title: "Instant Estimates",
    desc: "Get your car's estimated value in seconds. No waiting, no appointments.",
  },
  {
    icon: MapPin,
    title: "UAE-Focused",
    desc: "Built on 10,000+ UAE used car listings. Understands local market conditions.",
  },
  {
    icon: BarChart3,
    title: "Confidence Scoring",
    desc: "Every prediction includes a confidence level so you know how reliable the estimate is.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 sm:py-36 container-editorial">
      <ScrollReveal>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linen border border-obsidian/[0.06] mb-6">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-graphite">
            Capabilities
          </span>
        </div>
        <h2 className="font-geist font-medium text-obsidian text-4xl sm:text-5xl tracking-tight mb-16">
          Why CarValue
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <ScrollReveal key={f.title} delay={i * 80} className="h-full">
            <div className="group p-[6px] rounded-[2rem] bg-obsidian/[0.03] border border-obsidian/[0.05] hover:bg-obsidian/[0.06] transition-colors duration-300">
              <div className="bg-linen rounded-[calc(2rem-6px)] p-8 h-full">
                <div className="w-11 h-11 rounded-2xl bg-paper border border-obsidian/[0.06] flex items-center justify-center mb-6">
                  <f.icon className="w-5 h-5 text-obsidian" strokeWidth={1.5} />
                </div>
                <h3 className="font-geist font-medium text-obsidian text-lg mb-3 flex items-center gap-2">
                  {f.title}
                  <ArrowRight className="w-4 h-4 text-ash opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </h3>
                <p className="font-geist text-graphite text-[15px] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
