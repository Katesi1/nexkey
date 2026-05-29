"use client";

import { useState, useCallback, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { paymentsApi } from "@/lib/api";
import { formatVND } from "@/lib/utils";
import {
  Eye, EyeOff, Save, Zap, ChevronDown, ChevronUp,
  CheckCircle, AlertCircle, X, Wifi, WifiOff, TestTube,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
type GatewayStatus = "connected" | "unconfigured" | "error";
type Gateway = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  enabled: boolean;
  testMode: boolean;
  merchantId: string;
  secretKey: string;
  webhookUrl: string;
  status: GatewayStatus;
};

type PaymentStatEntry = { method: string; count: number; total: number; percentage: number };

/* ─── Static gateway metadata (display-only) ─────────────────── */
const GW_META: Record<string, { icon: string; description: string; color: string }> = {
  vnpay:   { icon: "💳", description: "Cổng thanh toán VNPay — hỗ trợ ATM, Visa, MasterCard, QR", color: "#009BDE" },
  momo:    { icon: "🎀", description: "Ví điện tử MoMo — thanh toán nhanh qua QR Code và app",     color: "#A50064" },
  banking: { icon: "🏦", description: "Chuyển khoản ngân hàng — VietQR, tự động xác nhận",          color: "#3b82f6" },
  card:    { icon: "💰", description: "Visa, Mastercard, JCB — tích hợp qua Stripe/PayPal",         color: "#10b981" },
};

/* ─── Toast ──────────────────────────────────────────────────── */
type ToastType = "success" | "error" | "info";
function Toast({ msg, type, onClose }: { msg: string; type: ToastType; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const cfg = {
    success: { bg: "#064e3b", border: "#10b981", icon: <CheckCircle size={15} style={{ color: "#10b981" }} /> },
    error:   { bg: "#450a0a", border: "#ef4444", icon: <AlertCircle size={15} style={{ color: "#ef4444" }} /> },
    info:    { bg: "#0c1a40", border: "#3b82f6", icon: <Zap size={15} style={{ color: "#3b82f6" }} /> },
  }[type];
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 2000, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 10, background: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", maxWidth: 360, fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>
      {cfg.icon}{msg}
      <button onClick={onClose} style={{ marginLeft: 8, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}><X size={13} /></button>
    </div>
  );
}

/* ─── Gateway Card ───────────────────────────────────────────── */
function GatewayCard({ gw, stat, onChange, onTest, onSave }: {
  gw: Gateway;
  stat?: PaymentStatEntry;
  onChange: (id: string, data: Partial<Gateway>) => void;
  onTest: (gw: Gateway) => void;
  onSave: (gw: Gateway) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showKey, setShowKey]   = useState(false);
  const [localGw, setLocalGw]   = useState<Gateway>(gw);

  const upd = (k: keyof Gateway, v: string | boolean) => setLocalGw(p => ({ ...p, [k]: v }));

  const statusInfo = {
    connected:    { label: "Đã kết nối",    color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: <Wifi size={12} /> },
    unconfigured: { label: "Chưa cấu hình", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: <WifiOff size={12} /> },
    error:        { label: "Lỗi kết nối",   color: "#ef4444", bg: "rgba(239,68,68,0.12)",  icon: <AlertCircle size={12} /> },
  }[gw.status];

  const pct = stat?.percentage ?? 0;
  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <div style={{ background: "rgba(13,18,38,0.9)", border: `1px solid ${expanded ? gw.color + "30" : "rgba(30,42,80,0.7)"}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px" }}>

        {/* Icon */}
        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${gw.color}15`, border: `1px solid ${gw.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
          {gw.icon}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{gw.name}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: statusInfo.color, background: statusInfo.bg, padding: "2px 8px", borderRadius: 99 }}>
              {statusInfo.icon}{statusInfo.label}
            </span>
            {gw.testMode && <span style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 99 }}>TEST MODE</span>}
          </div>
          <div style={{ fontSize: 12, color: "#475569" }}>{gw.description}</div>

          {/* Progress bar */}
          {stat && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: "#334155" }}>{stat.count.toLocaleString("vi-VN")} giao dịch</span>
                <span style={{ fontSize: 11, color: gw.color, fontWeight: 600 }}>{formatVND(stat.total)} · {pct}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(30,42,80,0.8)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: gw.color, borderRadius: 99, boxShadow: `0 0 6px ${gw.color}60` }} />
              </div>
            </div>
          )}
        </div>

        {/* Toggle + expand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <label className="toggle" onClick={e => e.stopPropagation()}>
            <input type="checkbox" checked={gw.enabled} onChange={() => onChange(gw.id, { enabled: !gw.enabled })} />
            <span className="toggle-slider" />
          </label>
          <button onClick={() => setExpanded(v => !v)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: expanded ? `${gw.color}15` : "transparent", color: expanded ? gw.color : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Expanded config */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${gw.color}20`, padding: "20px", background: "rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", gap: 16 }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Merchant ID / Partner Code</label>
              <input style={inputStyle} value={localGw.merchantId} onChange={e => upd("merchantId", e.target.value)} placeholder="Nhập Merchant ID..." />
            </div>
            <div>
              <label style={labelStyle}>Secret Key / Hash Secret</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...inputStyle, paddingRight: 36 }} type={showKey ? "text" : "password"} value={localGw.secretKey} onChange={e => upd("secretKey", e.target.value)} placeholder="••••••••••••••••" />
                <button onClick={() => setShowKey(v => !v)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
                  {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Webhook URL</label>
              <input style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }} value={localGw.webhookUrl} onChange={e => upd("webhookUrl", e.target.value)} placeholder="https://yourdomain.com/webhook/..." />
            </div>
          </div>

          {/* Test mode */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, background: localGw.testMode ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)", border: localGw.testMode ? "1px solid rgba(245,158,11,0.2)" : "1px solid rgba(30,42,80,0.4)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: localGw.testMode ? "#f59e0b" : "#cbd5e1" }}>Chế độ kiểm thử (Test Mode)</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Giao dịch sẽ không bị trừ tiền thật khi bật chế độ này</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={localGw.testMode} onChange={() => upd("testMode", !localGw.testMode)} />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onTest(localGw)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(30,42,80,0.8)", background: "transparent", color: "#94a3b8", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
              <TestTube size={14} />Kiểm tra kết nối
            </button>
            <button onClick={() => { onSave({ ...localGw }); onChange(gw.id, localGw); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${gw.color},${gw.color}cc)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              <Save size={14} />Lưu cấu hình
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function PaymentsPage() {
  const [gateways, setGateways]   = useState<Gateway[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStatEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = "success") => setToast({ msg, type }), []);

  // Fetch gateways + stats on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([paymentsApi.gateways(), paymentsApi.stats()])
      .then(([gwList, statsData]) => {
        const mapped: Gateway[] = gwList.map(gw => {
          const meta = GW_META[gw.id] ?? { icon: "💳", description: "", color: "#64748b" };
          return {
            id: gw.id,
            name: gw.name,
            icon: meta.icon,
            description: meta.description,
            color: meta.color,
            enabled: gw.enabled,
            testMode: gw.testMode,
            merchantId: gw.merchantId ?? "",
            secretKey: "",
            webhookUrl: gw.webhookUrl ?? "",
            status: gw.merchantId ? "connected" : "unconfigured" as GatewayStatus,
          };
        });
        setGateways(mapped);

        const totalRev = statsData.byMethod.reduce((s, p) => s + p.revenue, 0);
        const stats: PaymentStatEntry[] = statsData.byMethod.map(p => ({
          method: p.method,
          count: p.count,
          total: p.revenue,
          percentage: totalRev > 0 ? Math.round((p.revenue / totalRev) * 100) : 0,
        }));
        setPaymentStats(stats);
      })
      .catch(() => showToast("Không thể tải dữ liệu thanh toán", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleChange = useCallback((id: string, data: Partial<Gateway>) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
  }, []);

  const handleTest = useCallback(async (gw: Gateway) => {
    if (!gw.merchantId) {
      showToast(`Vui lòng nhập Merchant ID cho ${gw.name}`, "error");
      return;
    }
    showToast(`Đang kiểm tra kết nối ${gw.name}...`, "info");
    try {
      const result = await paymentsApi.testGateway(gw.id);
      if (result.success) {
        showToast(`✓ ${result.message}`, "success");
      } else {
        showToast(result.message || `Kết nối ${gw.name} thất bại`, "error");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : `Kiểm tra ${gw.name} thất bại`, "error");
    }
  }, [showToast]);

  const handleSave = useCallback(async (saved: Gateway) => {
    try {
      await paymentsApi.updateGateway(saved.id, {
        enabled: saved.enabled,
        testMode: saved.testMode,
        merchantId: saved.merchantId,
        webhookUrl: saved.webhookUrl,
      });
      const isConfigured = saved.merchantId.trim() !== "";
      setGateways(prev => prev.map(g => g.id === saved.id ? { ...saved, status: isConfigured ? "connected" : "unconfigured" } : g));
      showToast(`Đã lưu cấu hình ${saved.name}`, "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : `Lưu cấu hình ${saved.name} thất bại`, "error");
    }
  }, [showToast]);

  const totalRevenue   = paymentStats.reduce((s, p) => s + p.total, 0);
  const totalTx        = paymentStats.reduce((s, p) => s + p.count, 0);
  const activeCount    = gateways.filter(g => g.enabled).length;
  const connectedCount = gateways.filter(g => g.status === "connected").length;

  const statMap: Record<string, PaymentStatEntry> = {};
  paymentStats.forEach(p => { statMap[p.method.toLowerCase()] = p; });

  return (
    <AdminLayout title="Phương thức thanh toán" subtitle="Cấu hình và quản lý cổng thanh toán">
      <div className="page-content">

        {loading && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <span style={{ display: "inline-block", width: 24, height: 24, border: "2px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          </div>
        )}

        {!loading && <>
        <StatsGrid cols={4}>
          <StatCard label="Tổng doanh thu" value={totalRevenue} isCurrency change={8.2} changeLabel="so với tháng trước" icon="money" color="green" />
          <StatCard label="Tổng giao dịch" value={totalTx} change={12.5} changeLabel="so với tháng trước" icon="cart" color="blue" />
          <StatCard label="Đang hoạt động" value={activeCount} changeLabel="phương thức" icon="activity" color="purple" />
          <StatCard label="Đã kết nối" value={connectedCount} changeLabel="cổng thanh toán" icon="activity" color="cyan" />
        </StatsGrid>

        {/* Revenue breakdown */}
        <div className="glass-card" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>
            Phân bổ doanh thu theo phương thức
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {paymentStats.map((stat, i) => {
              const colors = ["#3b82f6", "#A50064", "#009BDE", "#10b981"];
              const icons  = ["🏦", "🎀", "💳", "💰"];
              const cc = colors[i] ?? "#64748b";
              return (
                <div key={stat.method} style={{ padding: "14px 16px", borderRadius: 12, background: `${cc}08`, border: `1px solid ${cc}20` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 18 }}>{icons[i]}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{stat.method}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: cc, marginBottom: 4 }}>{stat.percentage}%</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{stat.count.toLocaleString("vi-VN")} giao dịch</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginTop: 2 }}>{formatVND(stat.total)}</div>
                  <div style={{ height: 3, background: "rgba(30,42,80,0.8)", borderRadius: 99, overflow: "hidden", marginTop: 10 }}>
                    <div style={{ height: "100%", width: `${stat.percentage}%`, background: cc, borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gateway configs */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
            Cấu hình cổng thanh toán
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {gateways.map(gw => {
              const stat = paymentStats.find(p => p.method.toLowerCase() === gw.id || p.method === gw.name);
              return (
                <GatewayCard
                  key={gw.id}
                  gw={gw}
                  stat={stat}
                  onChange={handleChange}
                  onTest={handleTest}
                  onSave={handleSave}
                />
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
          <span style={{ color: "#60a5fa", fontWeight: 600 }}>💡 Lưu ý:</span> Click vào mũi tên ▼ để mở rộng và cấu hình từng cổng thanh toán. Bật "Test Mode" để kiểm thử mà không trừ tiền thật. Webhook URL phải được cấu hình chính xác để nhận thông báo thanh toán tự động.
        </div>
        </>}
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}
