type BadgeVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "purple"
  | "cyan"
  | "default"
  | "blue";

type BadgeSize = "sm" | "md";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
};

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  success: {
    background: "rgba(16, 185, 129, 0.12)",
    color: "#10b981",
    border: "1px solid rgba(16, 185, 129, 0.25)",
  },
  error: {
    background: "rgba(239, 68, 68, 0.12)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.25)",
  },
  warning: {
    background: "rgba(245, 158, 11, 0.12)",
    color: "#f59e0b",
    border: "1px solid rgba(245, 158, 11, 0.25)",
  },
  info: {
    background: "rgba(59, 130, 246, 0.12)",
    color: "#3b82f6",
    border: "1px solid rgba(59, 130, 246, 0.25)",
  },
  blue: {
    background: "rgba(59, 130, 246, 0.12)",
    color: "#60a5fa",
    border: "1px solid rgba(59, 130, 246, 0.25)",
  },
  purple: {
    background: "rgba(139, 92, 246, 0.12)",
    color: "#8b5cf6",
    border: "1px solid rgba(139, 92, 246, 0.25)",
  },
  cyan: {
    background: "rgba(6, 182, 212, 0.12)",
    color: "#06b6d4",
    border: "1px solid rgba(6, 182, 212, 0.25)",
  },
  default: {
    background: "rgba(100, 116, 139, 0.12)",
    color: "#94a3b8",
    border: "1px solid rgba(100, 116, 139, 0.25)",
  },
};

const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: { fontSize: 10, padding: "2px 7px" },
  md: { fontSize: 11, padding: "3px 10px" },
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`badge ${className}`}
      style={{ ...variantStyles[variant], ...sizeStyles[size] }}
    >
      {dot && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "currentColor",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}

// - Order Status Badge -

type OrderStatusBadgeProps = { status: string };

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const map: Record<string, BadgeVariant> = {
    "Hoàn thành": "success",
    "Đang xử lý": "info",
    "Đã hủy": "error",
    "Hoàn tiền": "warning",
    "Chờ thanh toán": "purple",
  };
  return (
    <Badge variant={map[status] ?? "default"} dot>
      {status}
    </Badge>
  );
}

// - Product Status Badge -

type ProductStatusBadgeProps = { status: string };

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const map: Record<string, BadgeVariant> = {
    "Đang bán": "success",
    "Hết hàng": "error",
    "Tạm ngưng": "warning",
    "Nháp": "default",
  };
  return (
    <Badge variant={map[status] ?? "default"} dot>
      {status}
    </Badge>
  );
}

// - Customer Status Badge -

type CustomerStatusBadgeProps = { status: string };

export function CustomerStatusBadge({ status }: CustomerStatusBadgeProps) {
  const map: Record<string, BadgeVariant> = {
    "Hoạt động": "success",
    "VIP": "purple",
    "Bị khóa": "error",
  };
  return (
    <Badge variant={map[status] ?? "default"} dot>
      {status}
    </Badge>
  );
}

// - Key Status Badge -

type KeyStatusBadgeProps = { status: string };

export function KeyStatusBadge({ status }: KeyStatusBadgeProps) {
  const map: Record<string, BadgeVariant> = {
    "Hoạt động": "success",
    "Sắp hết hạn": "warning",
    "Đã hết hạn": "error",
    "Bị khóa": "error",
    "Chưa kích hoạt": "default",
  };
  return (
    <Badge variant={map[status] ?? "default"} dot>
      {status}
    </Badge>
  );
}

// - Stock Status Badge -

type StockStatusBadgeProps = { status: string };

export function StockStatusBadge({ status }: StockStatusBadgeProps) {
  const map: Record<string, BadgeVariant> = {
    "Còn hàng": "success",
    "Sắp hết": "warning",
    "Hết hàng": "error",
    "Đang nhập": "info",
  };
  return (
    <Badge variant={map[status] ?? "default"} dot>
      {status}
    </Badge>
  );
}

// - Supplier Status Badge -

type SupplierStatusBadgeProps = { status: string };

export function SupplierStatusBadge({ status }: SupplierStatusBadgeProps) {
  const map: Record<string, BadgeVariant> = {
    "Đang hợp tác": "success",
    "Chờ duyệt": "warning",
    "Tạm ngưng": "error",
  };
  return (
    <Badge variant={map[status] ?? "default"} dot>
      {status}
    </Badge>
  );
}
