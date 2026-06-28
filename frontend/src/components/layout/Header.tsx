import { Link } from "react-router-dom";
import { Gauge } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-paper border-b border-border-light">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-full bg-obsidian flex items-center justify-center">
            <Gauge className="w-4 h-4 text-paper" strokeWidth={2} />
          </div>
          <span className="font-geist font-medium text-[15px] text-obsidian tracking-tight">
            CarValue
          </span>
        </Link>
        <Link
          to="/"
          className="text-[12px] font-medium text-graphite hover:text-obsidian transition-colors no-underline tracking-wide"
        >
          &larr; Home
        </Link>
      </div>
    </header>
  );
}
