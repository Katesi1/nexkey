import type { ClassValue } from "clsx";

// Simple class name merger without clsx dependency
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .filter(Boolean)
    .map((input) => {
      if (typeof input === "string") return input;
      if (typeof input === "object" && input !== null && !Array.isArray(input)) {
        return Object.entries(input as Record<string, boolean>)
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join(" ");
      }
      if (Array.isArray(input)) return cn(...(input as ClassValue[]));
      return "";
    })
    .join(" ")
    .trim();
}

// Format VND currency
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format compact number (e.g. 1.2M, 245K)
export function formatCompact(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

// Format VND in compact Vietnamese units: 1.2 tỷ / 850 tr / 950k
export function formatVNDCompact(amount: number): string {
  if (amount >= 1_000_000_000) {
    const v = amount / 1_000_000_000;
    return (Number.isInteger(v) ? v.toString() : v.toFixed(1)) + " tỷ";
  }
  if (amount >= 1_000_000) {
    const v = amount / 1_000_000;
    return (Number.isInteger(v) ? v.toString() : v.toFixed(1)) + " tr";
  }
  if (amount >= 1_000) {
    const v = amount / 1_000;
    return (Number.isInteger(v) ? v.toString() : v.toFixed(1)) + "k";
  }
  return amount.toLocaleString("vi-VN");
}

// Format date to Vietnamese format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Format datetime
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Time ago
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();

  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return formatDate(dateString);
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "…";
}

// Mask license key for display
export function maskKey(key: string): string {
  const parts = key.split("-");
  if (parts.length < 2) return key.slice(0, 8) + "****";
  return parts.slice(0, 2).join("-") + "-****-****";
}

// Generate random ID
export function genId(prefix = ""): string {
  const id = Math.random().toString(36).slice(2, 9).toUpperCase();
  return prefix ? `${prefix}${id}` : id;
}

// Clamp number
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
