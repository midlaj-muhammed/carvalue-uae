import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: Props) {
  const { ref, visible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 500ms cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 500ms cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
