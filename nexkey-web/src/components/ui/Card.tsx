import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-5", className)}>
      <div className="text-base font-semibold tracking-tight text-slate-900">
        {title}
      </div>
      {subtitle ? (
        <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
      ) : null}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-5 pt-0", className)}>{children}</div>;
}

