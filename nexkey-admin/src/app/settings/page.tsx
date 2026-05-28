"use client";

import { useState, useCallback, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  Settings, Globe, CreditCard, Mail, ShieldCheck, Palette,
  Save, Phone, MapPin, Building2, Lock, Key, Eye, EyeOff,
  CheckCircle, AlertCircle, Send, X,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
type GeneralSettings = {
  shopName: string; domain: string; email: string; phone: string;
  address: string; taxCode: string; description: string;
  maintenance: boolean; allowRegister: boolean; autoDeliverKey: boolean; sendEmailNotify: boolean;
};
type SeoSettings = {
  title: string; description: string; keywords: string; gaId: string; gtmId: string;
};
type EmailSettings = {
  host: string; port: string; username: string; password: string;
  fromEmail: string; fromName: string;
};
type SecurityToggles = {
  twoFA: boolean; limitLogin: boolean; sessionExpiry: boolean; ipVietnam: boolean;
};
type ThemeSettings = {
  primary: string; accent: string;
  showSearch: boolean; darkMode: boolean; chatWidget: boolean; animations: boolean;
};

/* ─── Initial values ─────────────────────────────────────────── */
const INIT_GENERAL: GeneralSettings = {
  shopName: "NexKey Store", domain: "nexkey.vn", email: "support@nexkey.vn",
  phone: "1900 1234", address: "TP. Hồ Chí Minh, Việt Nam", taxCode: "0312345678",
  description: "NexKey - Nền tảng mua bán phần mềm bản quyền số uy tín hàng đầu Việt Nam.",
  maintenance: false, allowRegister: true, autoDeliverKey: true, sendEmailNotify: true,
};
const INIT_SEO: SeoSettings = {
  title: "NexKey - Mua phần mềm bản quyền giá tốt nhất",
  description: "NexKey cung cấp Windows, Office, YouTube Premium, Spotify và hàng trăm phần mềm bản quyền với giá tốt nhất Việt Nam.",
  keywords: "phần mềm bản quyền, windows key, office 365, youtube premium",
  gaId: "", gtmId: "",
};
const INIT_EMAIL: EmailSettings = {
  host: "smtp.gmail.com", port: "587", username: "mailer@nexkey.vn",
  password: "smtp-password", fromEmail: "noreply@nexkey.vn", fromName: "NexKey Store",
};
const INIT_SEC_TOGGLES: SecurityToggles = {
  twoFA: false, limitLogin: true, sessionExpiry: true, ipVietnam: false,
};
const INIT_THEME: ThemeSettings = {
  primary: "#3b82f6", accent: "#8b5cf6",
  showSearch: true, darkMode: true, chatWidget: true, animations: true,
};

/* ─── Tab list ───────────────────────────────────────────────── */
const TABS = [
  { id: "general",  label: "Tổng quan",  icon: <Settings size={14} />    },
  { id: "seo",      label: "SEO",        icon: <Globe size={14} />       },
  { id: "payment",  label: "Thanh toán", icon: <CreditCard size={14} />  },
  { id: "email",    label: "Email SMTP", icon: <Mail size={14} />        },
  { id: "security", label: "Bảo mật",   icon: <ShieldCheck size={14} /> },
  { id: "theme",    label: "Giao diện",  icon: <Palette size={14} />     },
] as const;
type TabId = (typeof TABS)[number]["id"];

/* ─── Toast ──────────────────────────────────────────────────── */
type ToastType = "success" | "error" | "info";
function Toast({ msg, type, onClose }: { msg: string; type: ToastType; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  const colors = { success: { bg: "#064e3b", border: "#10b981", icon: <CheckCircle size={16} style={{ color: "#10b981" }} /> }, error: { bg: "#450a0a", border: "#ef4444", icon: <AlertCircle size={16} style={{ color: "#ef4444" }} /> }, info: { bg: "#0c1a40", border: "#3b82f6", icon: <Mail size={16} style={{ color: "#3b82f6" }} /> } };
  const c = colors[type];
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 2000, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 10, background: c.bg, border: `1px solid ${c.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", maxWidth: 360, fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>
      {c.icon}{msg}
      <button onClick={onClose} style={{ marginLeft: 8, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}><X size={13} /></button>
    </div>
  );
}

/* ─── Shared UI components ───────────────────────────────────── */
function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(30,42,80,0.6)" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{title}</div>
        {description && <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>{description}</div>}
      </div>
      {children}
    </div>
  );
}
function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>{label}{required && <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>}</label>
      {children}
      {hint && <span style={{ fontSize: 11, color: "#475569" }}>{hint}</span>}
    </div>
  );
}
function ToggleRow({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid rgba(30,42,80,0.35)" }}>
      <div>
        <div style={{ fontSize: 13, color: "#cbd5e1" }}>{label}</div>
        <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{hint}</div>
      </div>
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}
const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
const iconInput = (icon: React.ReactNode, input: React.ReactNode) => (
  <div style={{ position: "relative" }}>
    <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>{icon}</div>
    {input}
  </div>
);

/* ─── Tabs ───────────────────────────────────────────────────── */
function GeneralTab({ s, set }: { s: GeneralSettings; set: React.Dispatch<React.SetStateAction<GeneralSettings>> }) {
  const upd = (k: keyof GeneralSettings, v: string | boolean) => set(prev => ({ ...prev, [k]: v }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionCard title="Thông tin cửa hàng" description="Cấu hình thông tin cơ bản của website">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Tên cửa hàng" required><input className="admin-input" value={s.shopName} onChange={e => upd("shopName", e.target.value)} /></Field>
          <Field label="Tên miền" required><input className="admin-input" value={s.domain} onChange={e => upd("domain", e.target.value)} /></Field>
          <Field label="Email liên hệ" required>{iconInput(<Mail size={13} />, <input className="admin-input" style={{ paddingLeft: 30 }} value={s.email} onChange={e => upd("email", e.target.value)} />)}</Field>
          <Field label="Số điện thoại">{iconInput(<Phone size={13} />, <input className="admin-input" style={{ paddingLeft: 30 }} value={s.phone} onChange={e => upd("phone", e.target.value)} />)}</Field>
          <Field label="Địa chỉ">{iconInput(<MapPin size={13} />, <input className="admin-input" style={{ paddingLeft: 30 }} value={s.address} onChange={e => upd("address", e.target.value)} />)}</Field>
          <Field label="Mã số thuế">{iconInput(<Building2 size={13} />, <input className="admin-input" style={{ paddingLeft: 30 }} value={s.taxCode} onChange={e => upd("taxCode", e.target.value)} />)}</Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Mô tả ngắn"><textarea className="admin-input" rows={3} value={s.description} onChange={e => upd("description", e.target.value)} style={{ resize: "vertical" }} /></Field>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Cấu hình hệ thống">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ToggleRow label="Bảo trì website" hint="Tạm dừng website để bảo trì" checked={s.maintenance} onChange={() => upd("maintenance", !s.maintenance)} />
          <ToggleRow label="Đăng ký tài khoản" hint="Cho phép người dùng tự đăng ký" checked={s.allowRegister} onChange={() => upd("allowRegister", !s.allowRegister)} />
          <ToggleRow label="Tự động giao key" hint="Tự động giao key sau khi thanh toán thành công" checked={s.autoDeliverKey} onChange={() => upd("autoDeliverKey", !s.autoDeliverKey)} />
          <ToggleRow label="Gửi email thông báo" hint="Gửi email xác nhận đơn hàng cho khách" checked={s.sendEmailNotify} onChange={() => upd("sendEmailNotify", !s.sendEmailNotify)} />
        </div>
      </SectionCard>
    </div>
  );
}

function SeoTab({ s, set }: { s: SeoSettings; set: React.Dispatch<React.SetStateAction<SeoSettings>> }) {
  const upd = (k: keyof SeoSettings, v: string) => set(prev => ({ ...prev, [k]: v }));
  return (
    <SectionCard title="Cài đặt SEO" description="Tối ưu hóa công cụ tìm kiếm">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Meta Title"><input className="admin-input" value={s.title} onChange={e => upd("title", e.target.value)} /></Field>
        <Field label="Meta Description" hint={`${s.description.length}/160 ký tự`}>
          <textarea className="admin-input" rows={3} style={{ resize: "vertical" }} value={s.description} onChange={e => upd("description", e.target.value)} />
        </Field>
        <Field label="Meta Keywords"><input className="admin-input" value={s.keywords} onChange={e => upd("keywords", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Google Analytics ID"><input className="admin-input" placeholder="G-XXXXXXXXXX" value={s.gaId} onChange={e => upd("gaId", e.target.value)} /></Field>
          <Field label="Google Tag Manager ID"><input className="admin-input" placeholder="GTM-XXXXXXX" value={s.gtmId} onChange={e => upd("gtmId", e.target.value)} /></Field>
        </div>
      </div>
    </SectionCard>
  );
}

function PaymentTab() {
  const [toggles, setToggles] = useState({ vnpay: true, momo: true, banking: true, card: false });
  const [keys, setKeys] = useState({ vnpay_id: "", vnpay_key: "", momo_id: "", momo_key: "", banking_id: "", banking_key: "", card_id: "", card_key: "" });
  const PMS = [
    { id: "vnpay",   name: "VNPay",   icon: "💳", desc: "Thanh toán qua cổng VNPay" },
    { id: "momo",    name: "MoMo",    icon: "🎀", desc: "Thanh toán qua ví MoMo" },
    { id: "banking", name: "Banking", icon: "🏦", desc: "Chuyển khoản ngân hàng" },
    { id: "card",    name: "Card",    icon: "💰", desc: "Thẻ tín dụng/ghi nợ" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {PMS.map(pm => (
        <SectionCard key={pm.id} title={`${pm.icon} ${pm.name}`} description={pm.desc}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <ToggleRow label={`Kích hoạt ${pm.name}`} hint="Bật/tắt phương thức thanh toán này" checked={(toggles as Record<string,boolean>)[pm.id]} onChange={() => setToggles(p => ({ ...p, [pm.id]: !p[pm.id as keyof typeof p] }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label={`${pm.name} Merchant ID`}><input className="admin-input" placeholder={`Nhập ${pm.name} Merchant ID`} value={(keys as Record<string,string>)[`${pm.id}_id`]} onChange={e => setKeys(p => ({ ...p, [`${pm.id}_id`]: e.target.value }))} /></Field>
              <Field label={`${pm.name} Secret Key`}><input className="admin-input" type="password" placeholder="••••••••••••" value={(keys as Record<string,string>)[`${pm.id}_key`]} onChange={e => setKeys(p => ({ ...p, [`${pm.id}_key`]: e.target.value }))} /></Field>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

function EmailTab({ s, set, onTest }: { s: EmailSettings; set: React.Dispatch<React.SetStateAction<EmailSettings>>; onTest: () => void }) {
  const [showPass, setShowPass] = useState(false);
  const upd = (k: keyof EmailSettings, v: string) => set(prev => ({ ...prev, [k]: v }));
  return (
    <SectionCard title="Cấu hình SMTP" description="Cấu hình máy chủ gửi email">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="SMTP Host" required><input className="admin-input" value={s.host} onChange={e => upd("host", e.target.value)} /></Field>
          <Field label="SMTP Port" required><input className="admin-input" value={s.port} onChange={e => upd("port", e.target.value)} /></Field>
          <Field label="Username" required><input className="admin-input" value={s.username} onChange={e => upd("username", e.target.value)} /></Field>
          <Field label="Password" required>
            <div style={{ position: "relative" }}>
              <input className="admin-input" type={showPass ? "text" : "password"} value={s.password} onChange={e => upd("password", e.target.value)} style={{ paddingRight: 36 }} />
              <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </Field>
          <Field label="Email gửi đi" required><input className="admin-input" value={s.fromEmail} onChange={e => upd("fromEmail", e.target.value)} /></Field>
          <Field label="Tên hiển thị"><input className="admin-input" value={s.fromName} onChange={e => upd("fromName", e.target.value)} /></Field>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button variant="secondary" size="sm" icon={<Send size={13} />} onClick={onTest}>Gửi email test</Button>
          <span style={{ fontSize: 11, color: "#475569" }}>Kiểm tra cấu hình SMTP đang nhập</span>
        </div>
      </div>
    </SectionCard>
  );
}

function SecurityTab({ toggles, setToggles }: { toggles: SecurityToggles; setToggles: React.Dispatch<React.SetStateAction<SecurityToggles>> }) {
  const [cur, setCur]     = useState("");
  const [newP, setNewP]   = useState("");
  const [conf, setConf]   = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pwOk, setPwOk]   = useState(false);

  const handleChangePw = () => {
    setPwErr(""); setPwOk(false);
    if (!cur) { setPwErr("Nhập mật khẩu hiện tại"); return; }
    if (newP.length < 8) { setPwErr("Mật khẩu mới tối thiểu 8 ký tự"); return; }
    if (newP !== conf) { setPwErr("Mật khẩu xác nhận không khớp"); return; }
    setCur(""); setNewP(""); setConf(""); setPwOk(true);
    setTimeout(() => setPwOk(false), 3000);
  };

  const upd = (k: keyof SecurityToggles) => setToggles(p => ({ ...p, [k]: !p[k] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionCard title="Bảo mật đăng nhập">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ToggleRow label="Xác thực 2 yếu tố (2FA)" hint="Yêu cầu xác thực OTP khi đăng nhập" checked={toggles.twoFA} onChange={() => upd("twoFA")} />
          <ToggleRow label="Giới hạn đăng nhập thất bại" hint="Khóa IP sau 5 lần đăng nhập sai" checked={toggles.limitLogin} onChange={() => upd("limitLogin")} />
          <ToggleRow label="Phiên đăng nhập tự động hết hạn" hint="Đăng xuất sau 8 tiếng không hoạt động" checked={toggles.sessionExpiry} onChange={() => upd("sessionExpiry")} />
          <ToggleRow label="Chỉ cho phép IP Việt Nam" hint="Chặn truy cập từ IP nước ngoài" checked={toggles.ipVietnam} onChange={() => upd("ipVietnam")} />
        </div>
      </SectionCard>

      <SectionCard title="Đổi mật khẩu admin">
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 400 }}>
          <Field label="Mật khẩu hiện tại">{iconInput(<Lock size={13} />, <input className="admin-input" type="password" style={{ paddingLeft: 30 }} placeholder="••••••••" value={cur} onChange={e => setCur(e.target.value)} />)}</Field>
          <Field label="Mật khẩu mới">{iconInput(<Key size={13} />, <input className="admin-input" type="password" style={{ paddingLeft: 30 }} placeholder="Tối thiểu 8 ký tự" value={newP} onChange={e => setNewP(e.target.value)} />)}</Field>
          <Field label="Xác nhận mật khẩu mới">{iconInput(<Key size={13} />, <input className="admin-input" type="password" style={{ paddingLeft: 30 }} placeholder="••••••••" value={conf} onChange={e => setConf(e.target.value)} />)}</Field>
          {pwErr && <div style={{ fontSize: 12, color: "#f87171", display: "flex", alignItems: "center", gap: 6 }}><AlertCircle size={13} />{pwErr}</div>}
          {pwOk && <div style={{ fontSize: 12, color: "#34d399", display: "flex", alignItems: "center", gap: 6 }}><CheckCircle size={13} />Cập nhật mật khẩu thành công!</div>}
          <Button variant="primary" size="md" icon={<ShieldCheck size={13} />} style={{ alignSelf: "flex-start" }} onClick={handleChangePw}>Cập nhật mật khẩu</Button>
        </div>
      </SectionCard>
    </div>
  );
}

function ThemeTab({ s, set }: { s: ThemeSettings; set: React.Dispatch<React.SetStateAction<ThemeSettings>> }) {
  const upd = (k: keyof ThemeSettings, v: string | boolean) => set(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionCard title="Màu sắc thương hiệu" description="Tùy chỉnh bảng màu giao diện">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          <Field label="Màu chủ đạo">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="color" value={s.primary} onChange={e => upd("primary", e.target.value)} style={{ width: 36, height: 36, border: "1px solid rgba(30,42,80,0.8)", borderRadius: 8, cursor: "pointer", background: "none", padding: 2 }} />
              <input className="admin-input" value={s.primary} onChange={e => upd("primary", e.target.value)} style={{ fontFamily: "monospace" }} />
            </div>
          </Field>
          <Field label="Màu nhấn">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="color" value={s.accent} onChange={e => upd("accent", e.target.value)} style={{ width: 36, height: 36, border: "1px solid rgba(30,42,80,0.8)", borderRadius: 8, cursor: "pointer", background: "none", padding: 2 }} />
              <input className="admin-input" value={s.accent} onChange={e => upd("accent", e.target.value)} style={{ fontFamily: "monospace" }} />
            </div>
          </Field>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>Xem trước</div>
            <div style={{ height: 36, borderRadius: 8, background: `linear-gradient(135deg,${s.primary},${s.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#fff" }}>NexKey</div>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Giao diện" description="Tùy chỉnh bố cục và hiển thị">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ToggleRow label="Hiển thị thanh tìm kiếm" hint="Hiện thanh tìm kiếm trên header" checked={s.showSearch} onChange={() => upd("showSearch", !s.showSearch)} />
          <ToggleRow label="Bật dark mode mặc định" hint="Áp dụng dark mode cho website khách hàng" checked={s.darkMode} onChange={() => upd("darkMode", !s.darkMode)} />
          <ToggleRow label="Hiển thị chat widget" hint="Bật/tắt widget chat hỗ trợ" checked={s.chatWidget} onChange={() => upd("chatWidget", !s.chatWidget)} />
          <ToggleRow label="Animation và hiệu ứng" hint="Bật hiệu ứng chuyển động trên website" checked={s.animations} onChange={() => upd("animations", !s.animations)} />
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [general, setGeneral]     = useState<GeneralSettings>(INIT_GENERAL);
  const [seo, setSeo]             = useState<SeoSettings>(INIT_SEO);
  const [email, setEmail]         = useState<EmailSettings>(INIT_EMAIL);
  const [secToggles, setSecToggles] = useState<SecurityToggles>(INIT_SEC_TOGGLES);
  const [theme, setTheme]         = useState<ThemeSettings>(INIT_THEME);

  // Saved snapshots (simulate backend)
  const [saved, setSaved]         = useState({ general: INIT_GENERAL, seo: INIT_SEO, email: INIT_EMAIL, secToggles: INIT_SEC_TOGGLES, theme: INIT_THEME });

  const [toast, setToast]         = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = useCallback((msg: string, type: "success" | "error" | "info" = "success") => setToast({ msg, type }), []);

  const isDirty = JSON.stringify({ general, seo, email, secToggles, theme }) !== JSON.stringify(saved);

  const handleSave = () => {
    setSaved({ general, seo, email, secToggles, theme });
    showToast("Đã lưu cài đặt thành công!", "success");
  };

  const handleCancel = () => {
    setGeneral(saved.general);
    setSeo(saved.seo);
    setEmail(saved.email);
    setSecToggles(saved.secToggles);
    setTheme(saved.theme);
    showToast("Đã hủy thay đổi", "info");
  };

  const handleTestEmail = () => {
    if (!email.host || !email.username) { showToast("Vui lòng điền đầy đủ cấu hình SMTP", "error"); return; }
    showToast(`Đã gửi email test đến ${email.fromEmail}`, "info");
  };

  const TAB_CONTENT: Record<TabId, React.ReactNode> = {
    general:  <GeneralTab s={general} set={setGeneral} />,
    seo:      <SeoTab s={seo} set={setSeo} />,
    payment:  <PaymentTab />,
    email:    <EmailTab s={email} set={setEmail} onTest={handleTestEmail} />,
    security: <SecurityTab toggles={secToggles} setToggles={setSecToggles} />,
    theme:    <ThemeTab s={theme} set={setTheme} />,
  };

  return (
    <AdminLayout title="Cài đặt" subtitle="Cấu hình hệ thống">
      <div className="page-content">
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

          {/* Left nav */}
          <div className="glass-card" style={{ width: 220, flexShrink: 0, padding: 8 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, marginBottom: 2, cursor: "pointer", fontSize: 13, fontWeight: 500, textAlign: "left", border: "none", transition: "all 0.15s", background: activeTab === tab.id ? "linear-gradient(135deg,rgba(37,99,235,0.2),rgba(109,40,217,0.2))" : "transparent", color: activeTab === tab.id ? "#e2e8f0" : "#64748b", boxShadow: activeTab === tab.id ? "inset 0 0 0 1px rgba(59,130,246,0.2)" : "none" }}>
                <span style={{ color: activeTab === tab.id ? "#60a5fa" : "#475569", flexShrink: 0 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            {TAB_CONTENT[activeTab]}

            {/* Save bar */}
            <div className="glass-card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderColor: isDirty ? "rgba(59,130,246,0.4)" : undefined }}>
              <span style={{ fontSize: 12, color: isDirty ? "#60a5fa" : "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                {isDirty ? <><AlertCircle size={13} style={{ color: "#f59e0b" }} />Có thay đổi chưa lưu</> : "Tất cả thay đổi đã được lưu"}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="secondary" size="sm" onClick={handleCancel} disabled={!isDirty}>Hủy</Button>
                <Button variant="primary" size="sm" icon={<Save size={13} />} onClick={handleSave} disabled={!isDirty}>Lưu cài đặt</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}
