import { formatPrice } from "@/hooks/usePriceFormatter";

interface Props {
  price: number;
}

export default function PriceDisplay({ price }: Props) {
  return (
    <div className="relative">
      <p className="font-mono text-5xl sm:text-6xl font-medium tracking-tight text-obsidian">
        {formatPrice(price)}
      </p>
    </div>
  );
}
