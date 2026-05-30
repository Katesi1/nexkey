import {
  ORDER_STATUS_LABEL,     type OrderStatus,
  PRODUCT_STATUS_LABEL,   type ProductStatus,
  CUSTOMER_STATUS_LABEL,  type CustomerStatus,
  LICENSE_KEY_STATUS_LABEL, type LicenseKeyStatus,
  WAREHOUSE_STATUS_LABEL, type WarehouseStatus,
  SUPPLIER_STATUS_LABEL,  type SupplierStatus,
} from "@/lib/types";

type BadgeVariant =
  | "success" | "error" | "warning" | "info"
  | "purple"  | "cyan"  | "default" | "blue";

type BadgeSize = "sm" | "md";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
};

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  success: { background: "rgba(16,185,129,0.12)",  color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" },
  error:   { background: "rgba(239,68,68,0.12)",   color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" },
  warning: { background: "rgba(245,158,11,0.12)",  color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" },
  info:    { background: "rgba(59,130,246,0.12)",  color: "#3b82f6", border: "1px solid rgba(59,130,246,0.25)" },
  blue:    { background: "rgba(59,130,246,0.12)",  color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" },
  purple:  { background: "rgba(139,92,246,0.12)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.25)" },
  cyan:    { background: "rgba(6,182,212,0.12)",  color: "#06b6d4", border: "1px solid rgba(6,182,212,0.25)" },
  default: { background: "rgba(100,116,139,0.12)", color: "#94a3b8", border: "1px solid rgba(100,116,139,0.25)" },
};

const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: { fontSize: 10, padding: "2px 7px" },
  md: { fontSize: 11, padding: "3px 10px" },
};

export function Badge({ children, variant = "default", size = "md", dot = false, className = "" }: BadgeProps) {
  return (
    <span className={`badge ${className}`} style={{ ...variantStyles[variant], ...sizeStyles[size] }}>
      {dot && (
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block", flexShrink: 0 }} />
      )}
      {children}
    </span>
  );
}

// ── Order Status Badge ─────────────────────────────────────────────────────

const ORDER_VARIANT: Record<OrderStatus, BadgeVariant> = {
  1: "info",    // DangXuLy
  2: "success", // HoanThanh
  3: "error",   // DaHuy
  4: "warning", // HoanTien
  5: "purple",  // ChoThanhToan
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={ORDER_VARIANT[status] ?? "default"} dot>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}

// ── Product Status Badge ───────────────────────────────────────────────────

const PRODUCT_VARIANT: Record<ProductStatus, BadgeVariant> = {
  1: "success", // DangBan
  2: "error",   // HetHang
  3: "warning", // TamNgung
  4: "default", // Nhap
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge variant={PRODUCT_VARIANT[status] ?? "default"} dot>
      {PRODUCT_STATUS_LABEL[status]}
    </Badge>
  );
}

// ── Customer Status Badge ──────────────────────────────────────────────────

const CUSTOMER_VARIANT: Record<CustomerStatus, BadgeVariant> = {
  1: "success", // HoatDong
  2: "purple",  // VIP
  3: "error",   // BiKhoa
};

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <Badge variant={CUSTOMER_VARIANT[status] ?? "default"} dot>
      {CUSTOMER_STATUS_LABEL[status]}
    </Badge>
  );
}

// ── License Key Status Badge ───────────────────────────────────────────────

const KEY_VARIANT: Record<LicenseKeyStatus, BadgeVariant> = {
  1: "success", // HoatDong
  2: "warning", // SapHetHan
  3: "error",   // DaHetHan
  4: "error",   // BiKhoa
  5: "default", // ChuaKichHoat
};

export function KeyStatusBadge({ status }: { status: LicenseKeyStatus }) {
  return (
    <Badge variant={KEY_VARIANT[status] ?? "default"} dot>
      {LICENSE_KEY_STATUS_LABEL[status]}
    </Badge>
  );
}

// ── Warehouse / Stock Status Badge ─────────────────────────────────────────

const WAREHOUSE_VARIANT: Record<WarehouseStatus, BadgeVariant> = {
  1: "success", // ConHang
  2: "warning", // SapHet
  3: "error",   // HetHang
  4: "info",    // DangNhap
};

export function StockStatusBadge({ status }: { status: WarehouseStatus }) {
  return (
    <Badge variant={WAREHOUSE_VARIANT[status] ?? "default"} dot>
      {WAREHOUSE_STATUS_LABEL[status]}
    </Badge>
  );
}

// ── Supplier Status Badge ──────────────────────────────────────────────────

const SUPPLIER_VARIANT: Record<SupplierStatus, BadgeVariant> = {
  1: "success", // DangHopTac
  2: "warning", // ChoDuyet
  3: "error",   // TamNgung
};

export function SupplierStatusBadge({ status }: { status: SupplierStatus }) {
  return (
    <Badge variant={SUPPLIER_VARIANT[status] ?? "default"} dot>
      {SUPPLIER_STATUS_LABEL[status]}
    </Badge>
  );
}
