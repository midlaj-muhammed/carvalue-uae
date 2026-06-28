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
          <div
            key={s.label}
            style={{
              opacity: 0,
              animation: `staggerFadeInUp 500ms cubic-bezier(0.23,1,0.32,1) ${i * 80}ms forwards`,
            }}
          >
            <div className="stat-mono">{s.figure}</div>
            <div className="mt-3 text-[11px] font-geist font-medium text-graphite uppercase tracking-[0.14em]">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
