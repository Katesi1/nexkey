"use client";

import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  User, Mail, Shield, Clock, Key,
  Save, Eye, EyeOff, CheckCircle, AlertCircle, X,
  Camera, Lock,
} from "lucide-react";
import { useAuth } from "@/store/AuthContext";
import { auth, logsApi, getToken } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import type { Activity } from "@/lib/types";
import { AdminStatus } from "@/lib/types";

function Toast({ msg, ok, onClose }: { msg: string; ok: boolean; onClose: () => void }) {
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });
  useEffect(() => { const t = setTimeout(() => onCloseRef.current(), 3000); return () => clearTimeout(t); }, []);
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
  const { user } = useAuth();

  const [curPw, setCurPw]   = useState("");
  const [newPw, setNewPw]   = useState("");
  const [confPw, setConfPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwErr, setPwErr]   = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const showToast = (msg: string, ok = true) => setToast({ msg, ok });

  useEffect(() => {
    if (!getToken()) return;
    logsApi.list({ limit: 5 }).then(({ data }) => setActivities(data)).catch(() => {});
  }, []);

  const handleChangePw = async () => {
    setPwErr("");
    if (!curPw) { setPwErr("Nhập mật khẩu hiện tại"); return; }
    if (newPw.length < 8) { setPwErr("Mật khẩu mới tối thiểu 8 ký tự"); return; }
    if (newPw !== confPw) { setPwErr("Mật khẩu xác nhận không khớp"); return; }
    setSavingPw(true);
    try {
      await auth.changePassword(curPw, newPw);
      setCurPw(""); setNewPw(""); setConfPw("");
      showToast("Đã đổi mật khẩu thành công");
    } catch (err) {
      setPwErr(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
    } finally {
      setSavingPw(false);
    }
  };

  const name = user?.name ?? "Admin";
  const email = user?.email ?? "";
  const roleName = user?.role?.name ?? "Admin";

  return (
    <AdminLayout title="Hồ sơ cá nhân" subtitle="Thông tin tài khoản quản trị viên">
      <div className="page-content">
        <div className="resp-grid-profile">

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
                <Shield size={11} />{roleName}
              </span>
            </div>

            <div className="glass-card" style={{ padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>Thông tin</div>
              {[
                { icon: <Mail size={13} />,   label: "Email",        value: email },
                { icon: <Shield size={13} />, label: "Vai trò",      value: roleName },
                { icon: <Clock size={13} />,  label: "Trạng thái",   value: user?.status === AdminStatus.HoatDong ? "Hoạt động" : "Bị khóa" },
                { icon: <Key size={13} />,    label: "ID",           value: user?.id ? user.id.slice(0, 8) + "..." : "—" },
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

            {/* Profile info (read-only, from auth) */}
            <SectionCard title="Thông tin cá nhân" description="Thông tin tài khoản quản trị viên">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Họ tên</label>
                    <div style={{ position: "relative" }}>
                      <User size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} />
                      <input style={{ ...inputStyle, paddingLeft: 30, opacity: 0.7 }} value={name} readOnly />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <div style={{ position: "relative" }}>
                      <Mail size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} />
                      <input style={{ ...inputStyle, paddingLeft: 30, opacity: 0.7 }} value={email} readOnly />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Vai trò</label>
                    <div style={{ position: "relative" }}>
                      <Shield size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} />
                      <input style={{ ...inputStyle, paddingLeft: 30, opacity: 0.7 }} value={roleName} readOnly />
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "#334155" }}>
                  Để thay đổi tên hoặc email, vui lòng liên hệ Super Admin.
                </p>
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
                <Button variant="primary" size="sm" icon={<Lock size={13} />} style={{ alignSelf: "flex-start" }} onClick={handleChangePw} disabled={savingPw}>
                  {savingPw ? "Đang lưu..." : "Cập nhật mật khẩu"}
                </Button>
              </div>
            </SectionCard>

            {/* Activity log */}
            <SectionCard title="Hoạt động gần đây" description="5 hoạt động mới nhất trong hệ thống">
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {activities.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#334155", textAlign: "center", padding: "12px 0" }}>Chưa có dữ liệu</div>
                ) : activities.map((log, i) => (
                  <div key={log.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: i < activities.length - 1 ? "1px solid rgba(30,42,80,0.4)" : "none" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", flexShrink: 0, marginTop: 5, boxShadow: "0 0 6px rgba(59,130,246,0.5)" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#cbd5e1" }}>{log.title}</div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>{log.description}</div>
                    </div>
                    <div style={{ fontSize: 10, color: "#334155", flexShrink: 0 }}>{formatDateTime(log.createdAt)}</div>
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
