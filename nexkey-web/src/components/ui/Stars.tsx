import { cn } from "@/lib/utils";

export function Stars({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const items = Array.from({ length: 5 }).map((_, i) => {
    const filled = i < full;
    const half = !filled && hasHalf && i === full;
    return (
      <span
        key={i}
        className={cn(
          "text-sm",
          filled || half ? "text-amber-500" : "text-slate-300",
        )}
      >
        {filled ? "★" : half ? "★" : "☆"}
      </span>
    );
  });

  return <span className={cn("inline-flex gap-0.5", className)}>{items}</span>;
}

