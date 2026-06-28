import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gauge } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
      <nav
        className="flex items-center justify-between w-full max-w-2xl h-14 px-6 rounded-full transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(255,255,255,0.72)"
            : "rgba(255,255,255,0.45)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: scrolled
            ? "0 4px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)"
            : "0 2px 12px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
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
