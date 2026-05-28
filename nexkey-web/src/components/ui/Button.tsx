import Link from "next/link";
import { cn } from "@/lib/utils";

type Common = {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<NonNullable<Common["variant"]>, string> = {
  primary:
    "bg-gradient-to-br from-brand-from via-brand-via to-brand-to text-white shadow-sm hover:opacity-95",
  secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
  outline:
    "border border-border bg-white text-slate-900 shadow-sm hover:bg-slate-50",
  ghost: "text-slate-900 hover:bg-slate-100",
};

const sizes: Record<NonNullable<Common["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

type ButtonAsButton = Common &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = Common & {
  href: string;
  disabled?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function Button(
  props: ButtonAsButton | ButtonAsLink,
) {
  const variant: NonNullable<Common["variant"]> = props.variant ?? "primary";
  const size: NonNullable<Common["size"]> = props.size ?? "md";
  const cls = cn(
    base,
    variants[variant],
    sizes[size],
    props.className,
    "disabled" in props && props.disabled ? "opacity-50 pointer-events-none" : "",
  );

  if ("href" in props && typeof props.href === "string") {
    const { href, disabled, className: _className, children, ...rest } =
      props as ButtonAsLink;
    if (disabled) {
      return (
        <span className={cls} aria-disabled="true">
          {children}
        </span>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  const { className: _className, children, ...rest } = props as ButtonAsButton;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

