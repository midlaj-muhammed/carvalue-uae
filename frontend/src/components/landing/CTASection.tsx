import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="bg-onyx py-24 sm:py-32">
      <div className="container-editorial text-center">
        <h2 className="font-geist font-medium text-paper text-4xl sm:text-5xl tracking-tight mb-6">
          Ready to Know Your Car's Value?
        </h2>
        <p className="text-graphite text-lg font-geist mb-10 max-w-md mx-auto">
          Join thousands of UAE car owners who trust CarValue for accurate price predictions.
        </p>
        <Link
          to="/predict"
          className="btn-press inline-block bg-paper text-onyx px-8 py-3.5 rounded-pill text-[13px] font-medium tracking-wide hover:bg-paper/90 transition-colors duration-200 no-underline"
        >
          Start Valuing
        </Link>
      </div>
    </section>
  );
}
