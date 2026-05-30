import {
  TrendingUp, TrendingDown, ShoppingCart, DollarSign,
  Users, Package, KeyRound, Warehouse, Building2,
  Activity, Star, AlertTriangle,
} from "lucide-react";
import { formatVNDCompact, formatCompact } from "@/lib/utils";

type StatColor = "blue" | "green" | "purple" | "amber" | "cyan" | "rose";

type StatCardProps = {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  color?: StatColor;
  isCurrency?: boolean;
  suffix?: string;
  prefix?: string;
};

const ICONS: Record<string, React.ReactNode> = {
  cart:     <ShoppingCart size={20} />,
  money:    <DollarSign size={20} />,
  users:    <Users size={20} />,
  package:  <Package size={20} />,
  key:      <KeyRound size={20} />,
  warehouse:<Warehouse size={20} />,
  building: <Building2 size={20} />,
  activity: <Activity size={20} />,
  star:     <Star size={20} />,
  alert:    <AlertTriangle size={20} />,
};

const ICON_STYLES: Record<StatColor, { bg: string; color: string; glow: string; border: string; cardBg: string }> = {
  blue:   { bg: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#fff", glow: "rgba(37,99,235,0.4)",   border: "rgba(37,99,235,0.5)",   cardBg: "linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(13,18,38,0.95) 60%)" },
  green:  { bg: "linear-gradient(135deg, #059669, #10b981)", color: "#fff", glow: "rgba(5,150,105,0.4)",   border: "rgba(5,150,105,0.5)",   cardBg: "linear-gradient(135deg, rgba(5,150,105,0.18) 0%, rgba(13,18,38,0.95) 60%)" },
  purple: { bg: "linear-gradient(135deg, #7c3aed, #8b5cf6)", color: "#fff", glow: "rgba(124,58,237,0.4)",  border: "rgba(124,58,237,0.5)",  cardBg: "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(13,18,38,0.95) 60%)" },
  amber:  { bg: "linear-gradient(135deg, #d97706, #f59e0b)", color: "#fff", glow: "rgba(217,119,6,0.4)",   border: "rgba(217,119,6,0.5)",   cardBg: "linear-gradient(135deg, rgba(217,119,6,0.18) 0%, rgba(13,18,38,0.95) 60%)" },
  cyan:   { bg: "linear-gradient(135deg, #0891b2, #06b6d4)", color: "#fff", glow: "rgba(8,145,178,0.4)",   border: "rgba(8,145,178,0.5)",   cardBg: "linear-gradient(135deg, rgba(8,145,178,0.18) 0%, rgba(13,18,38,0.95) 60%)" },
  rose:   { bg: "linear-gradient(135deg, #be123c, #f43f5e)", color: "#fff", glow: "rgba(190,18,60,0.4)",   border: "rgba(190,18,60,0.5)",   cardBg: "linear-gradient(135deg, rgba(190,18,60,0.18) 0%, rgba(13,18,38,0.95) 60%)" },
};

export function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon = "cart",
  color = "blue",
  isCurrency = false,
  suffix = "",
  prefix = "",
}: StatCardProps) {
  const iconStyle = ICON_STYLES[color];
  const isPositive = change !== undefined && change >= 0;

  const displayValue = isCurrency
    ? formatVNDCompact(Number(value))
    : typeof value === "number"
    ? formatCompact(value)
    : value;

  return (
    <div
      className="glass-card-hover"
      style={{
        padding: "18px 20px",
        background: iconStyle.cardBg,
        border: `1px solid ${iconStyle.border}`,
        borderRadius: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Icon - LEFT side */}
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: iconStyle.bg,
          boxShadow: `0 0 20px ${iconStyle.glow}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: iconStyle.color, flexShrink: 0,
        }}>
          {ICONS[icon] ?? ICONS.cart}
        </div>

        {/* Text - RIGHT side */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, color: "#475569",
            letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4,
          }}>
            {label}
          </div>
          <div style={{
            fontSize: 26, fontWeight: 800, color: "#f1f5f9",
            letterSpacing: "-0.5px", lineHeight: 1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {prefix}{displayValue}{suffix}
          </div>
        </div>
      </div>

      {change !== undefined && (
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            background: isPositive ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
            color: isPositive ? "#34d399" : "#f87171",
            borderRadius: 99, fontSize: 11, fontWeight: 700,
            padding: "2px 7px",
          }}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(change)}%
          </div>
          <span style={{ fontSize: 11, color: "#475569" }}>
            {changeLabel ?? "So với 31 ngày trước"}
          </span>
        </div>
      )}
    </div>
  );
}

type StatsGridProps = { children: React.ReactNode; cols?: 2 | 3 | 4 | 5 };

export function StatsGrid({ children, cols = 4 }: StatsGridProps) {
  const GRID_CLASS: Record<number, string> = { 2: "resp-grid-2", 3: "resp-grid-3", 4: "resp-grid-4", 5: "resp-grid-4" };
  return (
    <div className={GRID_CLASS[cols] ?? "resp-grid-4"}>
      {children}
    </div>
  );
}
