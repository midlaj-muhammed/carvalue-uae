const steps = [
  {
    num: 1,
    title: "Enter Details",
    desc: "Select your car's make, model, year, mileage, and other details.",
  },
  {
    num: 2,
    title: "AI Analyzes",
    desc: "Our ML model processes your input against 10,000+ UAE market data points.",
  },
  {
    num: 3,
    title: "Get Estimate",
    desc: "Receive an instant AED price estimate with confidence scoring.",
  },
  {
    num: 4,
    title: "Compare",
    desc: "Use the estimate to negotiate, list, or make informed buying decisions.",
  },
];

export default function ProcessSection() {
  return (
    <section id="how-it-works" className="section-padding container-editorial">
      <h2 className="font-geist font-medium text-obsidian text-4xl tracking-tight mb-12">
        How It Works
      </h2>
      <div className="space-y-0">
        {steps.map((s) => (
          <div
            key={s.num}
            className="flex gap-5 py-6 border-b border-border-light last:border-b-0"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full border border-border-light flex items-center justify-center">
              <span className="font-geist font-medium text-obsidian text-sm">
                {s.num}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-geist font-medium text-obsidian text-xl mb-1">
                {s.title}
              </h3>
              <p className="font-geist text-graphite text-[15px] leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
