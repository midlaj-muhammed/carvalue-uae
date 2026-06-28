import { Gauge } from "lucide-react";

export default function Header() {
  return (
    <header className="relative z-10 border-b border-white/[0.06]">
      <div className="max-w-2xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20">
            <Gauge className="h-[18px] w-[18px] text-midnight" strokeWidth={2.5} />
          </div>
          <span className="text-[17px] font-display font-semibold text-white tracking-tight">
            CarValue
            <span className="text-gold ml-1">UAE</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-white/30 font-body">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          Live
        </div>
      </div>
    </header>
  );
}
