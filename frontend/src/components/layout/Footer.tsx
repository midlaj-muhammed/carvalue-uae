interface Props {
  theme?: "dark" | "light";
}

export default function Footer({ theme = "dark" }: Props) {
  const isLight = theme === "light";

  return (
    <footer
      className={`relative z-10 border-t mt-auto ${
        isLight ? "border-border-light bg-paper" : "border-white/[0.04]"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className={`text-[12px] leading-relaxed ${
              isLight ? "text-graphite" : "text-white/20"
            }`}
          >
            Estimates based on UAE market data. Actual prices may vary depending on condition and market factors.
          </p>
          <p
            className={`text-[11px] ${
              isLight ? "text-ash" : "text-white/15"
            }`}
          >
            &copy; {new Date().getFullYear()} CarValue UAE
          </p>
        </div>
      </div>
    </footer>
  );
}
