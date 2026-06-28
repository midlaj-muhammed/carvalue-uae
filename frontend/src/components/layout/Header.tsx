import { Link } from "react-router-dom";
import { Gauge } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
      <nav className="flex items-center justify-between w-full max-w-2xl h-14 px-6 rounded-full bg-paper/80 backdrop-blur-xl border border-obsidian/[0.06]">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-full bg-onyx flex items-center justify-center">
            <Gauge className="w-4 h-4 text-paper" strokeWidth={2} />
          </div>
          <span className="font-geist font-medium text-[15px] text-obsidian tracking-tight">
            CarValue
          </span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-[12px] font-medium text-graphite hover:text-obsidian transition-colors duration-200 no-underline tracking-wide"
        >
          <span>&larr;</span>
          <span>Home</span>
        </Link>
      </nav>
    </header>
  );
}
