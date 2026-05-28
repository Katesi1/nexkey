import { type ReactNode, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  children?: ReactNode;
};

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: 13,
            height: 13,
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.6s linear infinite",
          }}
        />
      ) : (
        icon
      )}
      {children}
      {iconRight}
    </button>
  );
}

// - Icon Button -

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  tooltip?: string;
};

export function IconButton({
  icon,
  variant = "ghost",
  size = "sm",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      style={{ width: size === "sm" ? 30 : 36, height: size === "sm" ? 30 : 36, padding: 0, justifyContent: "center" }}
      {...props}
    >
      {icon}
    </button>
  );
}

// - Action Buttons group (for table rows) -

type ActionButtonsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onDuplicate?: () => void;
};

import { Eye, Pencil, Trash2, Copy } from "lucide-react";

export function ActionButtons({ onView, onEdit, onDuplicate, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      {onView && (
        <IconButton
          icon={<Eye size={13} />}
          variant="ghost"
          onClick={onView}
          title="Xem chi tiết"
          style={{ color: "#64748b" }}
        />
      )}
      {onEdit && (
        <IconButton
          icon={<Pencil size={13} />}
          variant="ghost"
          onClick={onEdit}
          title="Chỉnh sửa"
          style={{ color: "#64748b" }}
        />
      )}
      {onDuplicate && (
        <IconButton
          icon={<Copy size={13} />}
          variant="ghost"
          onClick={onDuplicate}
          title="Nhân bản"
          style={{ color: "#64748b" }}
        />
      )}
      {onDelete && (
        <IconButton
          icon={<Trash2 size={13} />}
          variant="ghost"
          onClick={onDelete}
          title="Xóa"
          style={{ color: "#ef4444" }}
        />
      )}
    </div>
  );
}
