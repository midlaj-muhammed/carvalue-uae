import { Link } from "react-router-dom";
import { Gauge } from "lucide-react";

export default function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
      <nav className="flex items-center justify-between w-full max-w-[1200px] h-14 px-6 rounded-full bg-paper/80 backdrop-blur-xl border border-obsidian/[0.06]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-full bg-onyx flex items-center justify-center">
            <Gauge className="w-4 h-4 text-paper" strokeWidth={2} />
          </div>
          <span className="font-geist font-medium text-[15px] text-obsidian tracking-tight">
            CarValue
          </span>
        </Link>

        {/* Nav — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1">
          <a
            href="#features"
            className="px-4 py-1.5 rounded-full text-[13px] font-medium text-graphite hover:text-obsidian hover:bg-linen transition-colors duration-200 no-underline"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="px-4 py-1.5 rounded-full text-[13px] font-medium text-graphite hover:text-obsidian hover:bg-linen transition-colors duration-200 no-underline"
          >
            How It Works
          </a>
        </div>

        {/* CTA — Button-in-Button pattern */}
        <Link
          to="/predict"
          className="group flex items-center gap-2 bg-onyx text-paper pl-5 pr-2 py-2 rounded-full text-[13px] font-medium tracking-wide hover:bg-obsidian/90 transition-colors duration-200 no-underline"
        >
          <span>Start Valuing</span>
          <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
            <span className="text-[11px]">&rarr;</span>
          </span>
        </Link>
      </nav>
    </header>
  );
}
