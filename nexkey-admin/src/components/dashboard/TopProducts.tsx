import { topProducts } from "@/lib/mock-data";
import Link from "next/link";
import {
  WindowsIcon,
  OfficeIcon,
  YouTubeIcon,
  GoogleOneIcon,
  SpotifyIcon,
  NetflixIcon,
} from "@/components/icons/ProductIcons";

const ICON_MAP: Record<string, React.ReactNode> = {
  "windows": <WindowsIcon size={22} />,
  "office": <OfficeIcon size={22} />,
  "youtube": <YouTubeIcon size={22} />,
  "google-one": <GoogleOneIcon size={22} />,
  "spotify": <SpotifyIcon size={22} />,
  "netflix": <NetflixIcon size={22} />,
};

const ICON_BG: Record<string, { bg: string; glow: string }> = {
  "windows": { bg: "linear-gradient(135deg, #0078d4, #00b4d8)", glow: "rgba(0,120,212,0.4)" },
  "office": { bg: "linear-gradient(135deg, #c4451a, #e85b0f)", glow: "rgba(196,69,26,0.4)" },
  "youtube": { bg: "linear-gradient(135deg, #cc0000, #ff0000)", glow: "rgba(255,0,0,0.4)" },
  "google-one": { bg: "linear-gradient(135deg, #4285f4, #34a853)", glow: "rgba(66,133,244,0.4)" },
  "spotify": { bg: "linear-gradient(135deg, #1db954, #17a44a)", glow: "rgba(29,185,84,0.4)" },
  "netflix": { bg: "linear-gradient(135deg, #e50914, #b81d13)", glow: "rgba(229,9,20,0.4)" },
};

const DEFAULT_BG = { bg: "linear-gradient(135deg, #2563eb, #7c3aed)", glow: "rgba(37,99,235,0.4)" };

export function TopProducts() {
  return (
    <div className="glass-card" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          TOP SẢN PHẨM BÁN CHẠY
        </div>
        <Link href="/products" style={{ fontSize: 11, color: "#3b82f6", textDecoration: "none" }}>
          Xem tất cả
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {topProducts.map((product) => {
          const iconBg = ICON_BG[product.icon] ?? DEFAULT_BG;
          const iconNode = ICON_MAP[product.icon] ?? null;
          return (
            <div key={product.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Icon */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                flexShrink: 0,
                background: iconBg.bg,
                boxShadow: `0 0 12px ${iconBg.glow}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}>
                {iconNode}
              </div>

              {/* Name + Category */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {product.name}
                </div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>{product.category}</div>
              </div>

              {/* Sold count */}
              <div style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", flexShrink: 0 }}>
                {product.sold}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
