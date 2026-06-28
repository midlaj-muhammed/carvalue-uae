import { formatPrice } from "@/hooks/usePriceFormatter";

interface Props {
  price: number;
}

export default function PriceDisplay({ price }: Props) {
  return (
    <div className="relative">
      <p className="text-5xl sm:text-6xl font-display font-bold tracking-tight">
        <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
          {formatPrice(price)}
        </span>
      </p>
      {/* Subtle glow behind price */}
      <div className="absolute -inset-x-10 top-1/2 -translate-y-1/2 h-20 bg-gold/[0.04] blur-2xl rounded-full pointer-events-none" />
    </div>
  );
}
