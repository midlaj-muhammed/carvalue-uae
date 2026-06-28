import { Zap, MapPin, BarChart3 } from "lucide-react";

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
    <section id="features" className="section-padding container-editorial">
      <h2 className="font-geist font-medium text-obsidian text-4xl tracking-tight mb-12">
        Why CarValue
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-linen rounded-editorial p-8 hover:bg-sand/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-paper border border-border-light flex items-center justify-center mb-5">
              <f.icon className="w-5 h-5 text-obsidian" strokeWidth={1.5} />
            </div>
            <h3 className="font-geist font-medium text-obsidian text-lg mb-3">
              {f.title}
            </h3>
            <p className="font-geist text-graphite text-[15px] leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
