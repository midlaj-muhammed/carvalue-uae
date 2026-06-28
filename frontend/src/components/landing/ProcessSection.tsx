const steps = [
  {
    num: "01",
    title: "Enter Details",
    desc: "Select your car's make, model, year, mileage, and other details.",
  },
  {
    num: "02",
    title: "AI Analyzes",
    desc: "Our ML model processes your input against 10,000+ UAE market data points.",
  },
  {
    num: "03",
    title: "Get Estimate",
    desc: "Receive an instant AED price estimate with confidence scoring.",
  },
  {
    num: "04",
    title: "Compare",
    desc: "Use the estimate to negotiate, list, or make informed buying decisions.",
  },
];

export default function ProcessSection() {
  return (
    <section id="how-it-works" className="py-28 sm:py-36 container-editorial">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linen border border-obsidian/[0.06] mb-6">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-graphite">
          Process
        </span>
      </div>

      <h2 className="font-geist font-medium text-obsidian text-4xl sm:text-5xl tracking-tight mb-16">
        How It Works
      </h2>

      <div className="space-y-0">
        {steps.map((s, i) => (
          <div
            key={s.num}
            className="group flex items-start gap-6 py-8 border-b border-obsidian/[0.06] last:border-b-0"
            style={{
              opacity: 0,
              animation: `staggerFadeInUp 500ms cubic-bezier(0.23,1,0.32,1) ${i * 80}ms forwards`,
            }}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full border border-obsidian/[0.12] flex items-center justify-center group-hover:bg-onyx group-hover:border-onyx transition-all duration-300">
              <span className="font-mono text-sm font-medium text-obsidian group-hover:text-paper transition-colors duration-300">
                {s.num}
              </span>
            </div>
            <div className="flex-1 pt-2">
              <h3 className="font-geist font-medium text-obsidian text-xl mb-2">
                {s.title}
              </h3>
              <p className="font-geist text-graphite text-[15px] leading-relaxed max-w-lg">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
