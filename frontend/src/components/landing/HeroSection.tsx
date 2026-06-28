import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="section-padding container-editorial">
      <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 lg:gap-16 items-center">
        {/* Left — Copy */}
        <div>
          <h1 className="font-geist font-bold text-obsidian leading-[1.05] tracking-tight text-5xl sm:text-6xl lg:text-[68px]">
            Know What Your Car Is Worth
          </h1>
          <p className="mt-6 text-lg text-graphite font-geist leading-relaxed max-w-lg">
            AI-powered price predictions for the UAE used car market.
            Instant, data-driven, and free.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              to="/predict"
              className="bg-onyx text-paper px-7 py-3 rounded-pill text-[13px] font-medium tracking-wide hover:bg-obsidian/90 transition-colors no-underline"
            >
              Start Valuing
            </Link>
            <a
              href="#features"
              className="text-obsidian text-[13px] font-medium tracking-wide hover:text-graphite transition-colors no-underline"
            >
              See how it works &rarr;
            </a>
          </div>
        </div>

        {/* Right — Image */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80"
            alt="Luxury car"
            className="w-full aspect-[4/3] object-cover rounded-editorial"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
