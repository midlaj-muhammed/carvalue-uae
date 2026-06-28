const stats = [
  { figure: "65", label: "Makes Supported" },
  { figure: "10K+", label: "UAE Listings" },
  { figure: "AED", label: "Real-Time Predictions" },
];

export default function StatsSection() {
  return (
    <section className="border-y border-border-light bg-linen/50">
      <div className="container-editorial py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="stat-mono">{s.figure}</div>
            <div className="mt-2 text-[12px] font-geist font-medium text-graphite uppercase tracking-[0.12em]">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
