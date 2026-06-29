import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-paper text-obsidian font-geist flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-6xl font-medium text-obsidian/15 mb-4">404</p>
        <h1 className="font-geist font-medium text-obsidian text-2xl mb-3">
          Page Not Found
        </h1>
        <p className="text-graphite text-[15px] mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-onyx text-paper px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wide hover:bg-obsidian/90 transition-colors duration-200 no-underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
