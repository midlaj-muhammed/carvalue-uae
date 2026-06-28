import { Link } from "react-router-dom";
import { Gauge } from "lucide-react";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-paper border-b border-border-light">
      <div className="container-editorial flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-full bg-obsidian flex items-center justify-center">
            <Gauge className="w-4 h-4 text-paper" strokeWidth={2} />
          </div>
          <span className="font-geist font-medium text-[15px] text-obsidian tracking-tight">
            CarValue
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-2">
          <a
            href="#features"
            className="px-4 py-1.5 rounded-nav text-[13px] font-medium text-graphite hover:text-obsidian transition-colors no-underline"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="px-4 py-1.5 rounded-nav text-[13px] font-medium text-graphite hover:text-obsidian transition-colors no-underline"
          >
            How It Works
          </a>
        </nav>

        {/* CTA */}
        <Link
          to="/predict"
          className="bg-onyx text-paper px-5 py-2 rounded-pill text-[13px] font-medium tracking-wide hover:bg-obsidian/90 transition-colors no-underline"
        >
          Start Valuing
        </Link>
      </div>
    </header>
  );
}
