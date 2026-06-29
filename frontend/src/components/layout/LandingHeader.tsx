import { Link } from "react-router-dom";
import { Gauge, Menu, X } from "lucide-react";
import { useState } from "react";

export default function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <div className="flex items-center gap-2">
          <Link
            to="/predict"
            className="group hidden sm:inline-flex items-center gap-2 bg-onyx text-paper pl-5 pr-2 py-2 rounded-full text-[13px] font-medium tracking-wide hover:bg-obsidian/90 transition-colors duration-200 no-underline"
          >
            <span>Start Valuing</span>
            <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
              <span className="text-[11px]">&rarr;</span>
            </span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden w-9 h-9 rounded-full bg-linen border border-obsidian/[0.06] flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="w-4 h-4 text-obsidian" />
            ) : (
              <Menu className="w-4 h-4 text-obsidian" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-x-0 top-20 mx-4 p-4 rounded-2xl bg-paper border border-obsidian/[0.08] shadow-[0_16px_64px_rgba(0,0,0,0.12)] z-50">
          <div className="flex flex-col gap-1">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-[14px] font-medium text-graphite hover:text-obsidian hover:bg-linen transition-colors duration-200 no-underline"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-[14px] font-medium text-graphite hover:text-obsidian hover:bg-linen transition-colors duration-200 no-underline"
            >
              How It Works
            </a>
            <div className="h-px bg-obsidian/[0.06] my-1" />
            <Link
              to="/predict"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 bg-onyx text-paper px-5 py-3 rounded-full text-[13px] font-medium tracking-wide no-underline"
            >
              <span>Start Valuing</span>
              <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                <span className="text-[11px]">&rarr;</span>
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
