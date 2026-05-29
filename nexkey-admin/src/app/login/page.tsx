"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, LogIn, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/store/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070b16",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background gradients */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(30,42,80,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(30,42,80,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 0 40px rgba(124,58,237,0.35)",
          }}>
            <KeyRound size={28} style={{ color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.5px", marginBottom: 6 }}>
            NexKey Admin
          </h1>
          <p style={{ fontSize: 13, color: "#475569" }}>
            Hệ thống quản trị cửa hàng phần mềm bản quyền
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(13,18,38,0.9)",
          border: "1px solid rgba(30,42,80,0.8)",
          borderRadius: 18,
          padding: "32px 32px 28px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <ShieldCheck size={16} style={{ color: "#3b82f6" }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>Đăng nhập</span>
            </div>
            <p style={{ fontSize: 12, color: "#334155" }}>Chỉ dành cho quản trị viên được cấp quyền</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 7 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="admin@nexkey.vn"
                autoComplete="email"
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
                  background: "#060a15",
                  border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(30,42,80,0.9)"}`,
                  color: "#e2e8f0", outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(59,130,246,0.6)"; }}
                onBlur={e => { e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(30,42,80,0.9)"; }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 7 }}>
                Mật khẩu
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: "100%", padding: "11px 44px 11px 14px", borderRadius: 10, fontSize: 14,
                    background: "#060a15",
                    border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(30,42,80,0.9)"}`,
                    color: "#e2e8f0", outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => { e.target.style.borderColor = "rgba(59,130,246,0.6)"; }}
                  onBlur={e => { e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(30,42,80,0.9)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "#475569", cursor: "pointer", padding: 2,
                  }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 12px", borderRadius: 8,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                fontSize: 12, color: "#f87171",
              }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px 0", borderRadius: 10,
                background: loading
                  ? "rgba(37,99,235,0.5)"
                  : "linear-gradient(135deg, #2563eb, #7c3aed)",
                border: "none", color: "#fff",
                fontSize: 14, fontWeight: 700, cursor: loading ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: loading ? "none" : "0 4px 20px rgba(37,99,235,0.4)",
                transition: "all 0.2s",
                marginTop: 4,
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Đang xác thực...
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  Đăng nhập
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#1e293b" }}>
          Bạn không có tài khoản? Liên hệ Super Admin để được cấp quyền.
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
