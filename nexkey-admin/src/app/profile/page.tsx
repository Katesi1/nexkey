"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  User, Mail, Phone, Shield, Clock, Key,
  Save, Eye, EyeOff, CheckCircle, AlertCircle, X,
  Camera, Lock,
} from "lucide-react";

/* ─── Toast ──────────────────────────────────────────────────── */
function Toast({ msg, ok, onClose }: { msg: string; ok: boolean; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 2000, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 10, background: ok ? "#064e3b" : "#450a0a", border: `1px solid ${ok ? "#10b981" : "#ef4444"}`, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>
      {ok ? <CheckCircle size={15} style={{ color: "#10b981" }} /> : <AlertCircle size={15} style={{ color: "#ef4444" }} />}
      {msg}
      <button onClick={onClose} style={{ marginLeft: 8, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}><X size={13} /></button>
    </div>
  );
}

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

const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

export default function ProfilePage() {
  const [name, setName]   = useState("Admin Nexkey");
  const [email, setEmail] = useState("admin@nexkey.vn");
  const [phone, setPhone] = useState("0901 000 001");
  const [bio, setBio]     = useState("Quản trị viên hệ thống NexKey. Chịu trách nhiệm quản lý toàn bộ hoạt động của nền tảng.");

  const [curPw, setCurPw]   = useState("");
  const [newPw, setNewPw]   = useState("");
  const [confPw, setConfPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwErr, setPwErr]   = useState("");

  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const showToast = (msg: string, ok = true) => setToast({ msg, ok });

  const savedProfile = { name: "Admin Nexkey", email: "admin@nexkey.vn", phone: "0901 000 001", bio };
  const isDirty = name !== savedProfile.name || email !== savedProfile.email || phone !== savedProfile.phone;

  const handleSaveProfile = () => {
    if (!name.trim()) { showToast("Tên không được để trống", false); return; }
    showToast("Đã lưu thông tin cá nhân");
  };

  const handleChangePw = () => {
    setPwErr("");
    if (!curPw) { setPwErr("Nhập mật khẩu hiện tại"); return; }
    if (newPw.length < 8) { setPwErr("Mật khẩu mới tối thiểu 8 ký tự"); return; }
    if (newPw !== confPw) { setPwErr("Mật khẩu xác nhận không khớp"); return; }
    setCurPw(""); setNewPw(""); setConfPw("");
    showToast("Đã đổi mật khẩu thành công");
  };

  const ACTIVITY_LOG = [
    { action: "Đăng nhập", detail: "IP: 192.168.1.1 · Chrome/Windows", time: "27/05/2024 10:32" },
    { action: "Lưu cài đặt", detail: "Thay đổi cấu hình email SMTP", time: "27/05/2024 09:15" },
    { action: "Xóa đơn hàng", detail: "Đã xóa ORD-Y1Z3A5", time: "26/05/2024 17:00" },
    { action: "Đăng nhập", detail: "IP: 192.168.1.1 · Chrome/Windows", time: "26/05/2024 08:00" },
    { action: "Tạo key hàng loạt", detail: "Tạo 10 key Windows 11 Pro", time: "25/05/2024 14:30" },
  ];

  return (
    <AdminLayout title="Hồ sơ cá nhân" subtitle="Thông tin tài khoản quản trị viên">
      <div className="page-content">

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>

          {/* Left — Avatar card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="glass-card" style={{ padding: 24, textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 36, margin: "0 auto", boxShadow: "0 0 32px rgba(124,58,237,0.4)" }}>
                  {name[0] ?? "A"}
                </div>
                <button style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "#3b82f6", border: "2px solid #070b16", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Camera size={13} style={{ color: "#fff" }} />
                </button>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{name}</div>
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 12 }}>{email}</div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.12)", padding: "3px 12px", borderRadius: 99 }}>
                <Shield size={11} />Super Admin
              </span>
            </div>

            {/* Quick info */}
            <div className="glass-card" style={{ padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>Thông tin</div>
              {[
                { icon: <Mail size={13} />, label: "Email", value: email },
                { icon: <Phone size={13} />, label: "Điện thoại", value: phone || "—" },
                { icon: <Shield size={13} />, label: "Vai trò", value: "Super Admin" },
                { icon: <Clock size={13} />, label: "Tham gia", value: "01/01/2024" },
                { icon: <Key size={13} />, label: "Đăng nhập cuối", value: "27/05/2024 10:32" },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <div style={{ color: "#334155", marginTop: 1, flexShrink: 0 }}>{row.icon}</div>
                  <div>
                    <div style={{ fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>{row.label}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1, wordBreak: "break-all" }}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Forms */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Profile info */}
            <SectionCard title="Thông tin cá nhân" description="Cập nhật tên hiển thị và thông tin liên hệ">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Họ tên</label>
                    <div style={{ position: "relative" }}>
                      <User size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} />
                      <input style={{ ...inputStyle, paddingLeft: 30 }} value={name} onChange={e => setName(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <div style={{ position: "relative" }}>
                      <Mail size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} />
                      <input style={{ ...inputStyle, paddingLeft: 30 }} value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Điện thoại</label>
                    <div style={{ position: "relative" }}>
                      <Phone size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} />
                      <input style={{ ...inputStyle, paddingLeft: 30 }} value={phone} onChange={e => setPhone(e.target.value)} placeholder="0901 234 567" />
                    </div>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Giới thiệu</label>
                  <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={bio} onChange={e => setBio(e.target.value)} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="primary" size="sm" icon={<Save size={13} />} onClick={handleSaveProfile} disabled={!isDirty}>
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </SectionCard>

            {/* Change password */}
            <SectionCard title="Đổi mật khẩu" description="Nên dùng mật khẩu mạnh và không dùng lại">
              <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420 }}>
                {[
                  { label: "Mật khẩu hiện tại", value: curPw, set: setCurPw, placeholder: "••••••••" },
                  { label: "Mật khẩu mới",      value: newPw, set: setNewPw, placeholder: "Tối thiểu 8 ký tự" },
                  { label: "Xác nhận mật khẩu", value: confPw, set: setConfPw, placeholder: "••••••••" },
                ].map(({ label, value, set, placeholder }) => (
                  <div key={label}>
                    <label style={labelStyle}>{label}</label>
                    <div style={{ position: "relative" }}>
                      <Lock size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} />
                      <input style={{ ...inputStyle, paddingLeft: 30, paddingRight: 36 }} type={showPw ? "text" : "password"} value={value} onChange={e => set(e.target.value)} placeholder={placeholder} />
                      <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
                        {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                ))}
                {pwErr && <div style={{ fontSize: 12, color: "#f87171", display: "flex", alignItems: "center", gap: 6 }}><AlertCircle size={13} />{pwErr}</div>}
                <Button variant="primary" size="sm" icon={<Lock size={13} />} style={{ alignSelf: "flex-start" }} onClick={handleChangePw}>
                  Cập nhật mật khẩu
                </Button>
              </div>
            </SectionCard>

            {/* Activity log */}
            <SectionCard title="Lịch sử hoạt động gần đây" description="5 hoạt động gần nhất của tài khoản">
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {ACTIVITY_LOG.map((log, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: i < ACTIVITY_LOG.length - 1 ? "1px solid rgba(30,42,80,0.4)" : "none" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", flexShrink: 0, marginTop: 5, boxShadow: "0 0 6px rgba(59,130,246,0.5)" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#cbd5e1" }}>{log.action}</div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>{log.detail}</div>
                    </div>
                    <div style={{ fontSize: 10, color: "#334155", flexShrink: 0 }}>{log.time}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}
