import { paymentStats } from "@/lib/mock-data";

const COLORS = ["#3b82f6", "#a855f7", "#ec4899", "#f59e0b"];

const METHOD_ICONS: Record<string, string> = {
  Banking: "🏦",
  VNPay: "💳",
  MoMo: "🎀",
  Card: "💰",
  "Tiền mặt": "💵",
};

export function PaymentStats() {
  return (
    <div className="glass-card" style={{ padding: "20px 24px 24px" }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#475569",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        Phương thức thanh toán
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {paymentStats.map((stat, i) => (
          <div key={stat.method}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{METHOD_ICONS[stat.method] ?? "💳"}</span>
                <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 500 }}>
                  {stat.method}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "#475569", fontSize: 11 }}>{stat.count} GD</span>
                <span
                  style={{
                    color: COLORS[i % COLORS.length],
                    fontSize: 12,
                    fontWeight: 700,
                    minWidth: 34,
                    textAlign: "right",
                  }}
                >
                  {stat.percentage}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div
              style={{
                height: 5,
                background: "#1e2a50",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${stat.percentage}%`,
                  background: COLORS[i % COLORS.length],
                  borderRadius: 99,
                  boxShadow: `0 0 8px ${COLORS[i % COLORS.length]}60`,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
