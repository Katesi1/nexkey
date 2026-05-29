"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { adminsApi, rolesApi } from "@/lib/api";
import type { Admin as ApiAdmin, Role as ApiRole } from "@/lib/types";
import {
  Plus, X, ShieldCheck, ShieldAlert, Shield, Key,
  Pencil, Trash2, CheckCircle, AlertCircle, Users,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
type Role = {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  isSystem: boolean;
  adminCount: number;
};

type Admin = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  status: "HoatDong" | "BiKhoa";
  lastLogin?: string;
};

function mapApiAdmin(a: ApiAdmin): Admin {
  return { id: a.id, name: a.name, email: a.email, roleId: a.roleId, roleName: a.roleName, status: a.status, lastLogin: a.lastLogin };
}
function mapApiRole(r: ApiRole): Role {
  return { id: r.id, name: r.name, description: r.description ?? "", color: r.color, permissions: r.permissions, isSystem: r.isSystem, adminCount: r.adminCount };
}

/* ─── All available permissions ─────────────────────────────── */
const PERMISSION_GROUPS: Record<string, string[]> = {
  "Dashboard":       ["Xem Dashboard", "Xem thống kê doanh thu", "Xem báo cáo"],
  "Đơn hàng":        ["Xem đơn hàng", "Tạo đơn hàng", "Sửa đơn hàng", "Xóa đơn hàng", "Hoàn tiền đơn hàng", "Xuất Excel đơn hàng"],
  "Sản phẩm":        ["Xem sản phẩm", "Tạo sản phẩm", "Sửa sản phẩm", "Xóa sản phẩm", "Xuất Excel sản phẩm"],
  "Danh mục":        ["Xem danh mục", "Tạo danh mục", "Sửa danh mục", "Xóa danh mục"],
  "Khách hàng":      ["Xem khách hàng", "Sửa khách hàng", "Khóa/Mở khóa khách hàng", "Xóa khách hàng", "Xuất Excel khách hàng"],
  "Nhà cung cấp":    ["Xem nhà cung cấp", "Tạo nhà cung cấp", "Sửa nhà cung cấp", "Xóa nhà cung cấp"],
  "Kho hàng":        ["Xem kho hàng", "Nhập kho", "Xuất kho"],
  "Key / License":   ["Xem key", "Tạo key", "Tạo key hàng loạt", "Khóa/Mở khóa key", "Xóa key"],
  "Nội dung":        ["Quản lý Banner", "Quản lý Tin tức", "Quản lý Trang tĩnh", "Quản lý FAQ"],
  "Tài chính":       ["Xem doanh thu", "Xuất báo cáo tài chính", "Cấu hình thanh toán"],
  "Hệ thống":        ["Cài đặt chung", "Quản lý Admin & Phân quyền", "Xem nhật ký hoạt động"],
};
const ALL_PERMISSIONS = Object.values(PERMISSION_GROUPS).flat();


const COLOR_PRESETS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899", "#64748b"];

/* ─── Toast ──────────────────────────────────────────────────── */
function Toast({ msg, ok, onClose }: { msg: string; ok: boolean; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 2000, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 10, background: ok ? "#064e3b" : "#450a0a", border: `1px solid ${ok ? "#10b981" : "#ef4444"}`, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", fontSize: 13, color: "#e2e8f0", fontWeight: 500, maxWidth: 360 }}>
      {ok ? <CheckCircle size={15} style={{ color: "#10b981" }} /> : <AlertCircle size={15} style={{ color: "#ef4444" }} />}
      {msg}
      <button onClick={onClose} style={{ marginLeft: 8, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}><X size={13} /></button>
    </div>
  );
}

/* ─── Modal wrapper ──────────────────────────────────────────── */
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* ─── Role Form Modal ────────────────────────────────────────── */
function RoleFormModal({ role, onSave, onClose }: {
  role?: Role;
  onSave: (data: Partial<Role> & { id?: string }) => void;
  onClose: () => void;
}) {
  const isEdit = !!role;
  const [name, setName]         = useState(role?.name ?? "");
  const [description, setDesc]  = useState(role?.description ?? "");
  const [color, setColor]       = useState(role?.color ?? "#3b82f6");
  const [perms, setPerms]       = useState<string[]>(role?.permissions ?? []);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const togglePerm = (p: string) => setPerms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const toggleGroup = (group: string) => {
    const groupPerms = PERMISSION_GROUPS[group];
    const allSelected = groupPerms.every(p => perms.includes(p));
    if (allSelected) setPerms(prev => prev.filter(p => !groupPerms.includes(p)));
    else setPerms(prev => [...new Set([...prev, ...groupPerms])]);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Bắt buộc";
    if (perms.length === 0) e.perms = "Chọn ít nhất 1 quyền";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ id: role?.id, name: name.trim(), description: description.trim(), color, permissions: perms, isSystem: role?.isSystem ?? false });
    onClose();
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: "#060a15", border: "1px solid rgba(30,42,80,0.9)", color: "#e2e8f0", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 580, maxWidth: "94vw", maxHeight: "92vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${color},transparent)`, flexShrink: 0 }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: `${color}20`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={18} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>{isEdit ? "Chỉnh sửa vai trò" : "Tạo vai trò mới"}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{perms.length} quyền được chọn</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Basic info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Tên vai trò <span style={{ color: "#ef4444" }}>*</span></label>
              <input style={{ ...inputStyle, borderColor: errors.name ? "#ef4444" : "rgba(30,42,80,0.9)" }} value={name} onChange={e => setName(e.target.value)} placeholder="Ví dụ: Biên tập viên" />
              {errors.name && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.name}</span>}
            </div>
            <div>
              <label style={labelStyle}>Màu đại diện</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                {COLOR_PRESETS.map(c => (
                  <button key={c} onClick={() => setColor(c)} style={{ width: 26, height: 26, borderRadius: 99, background: c, border: color === c ? "3px solid #fff" : "3px solid transparent", cursor: "pointer", boxShadow: color === c ? `0 0 8px ${c}80` : "none" }} />
                ))}
                <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 26, height: 26, borderRadius: 99, border: "none", cursor: "pointer", padding: 0 }} />
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Mô tả vai trò</label>
            <input style={inputStyle} value={description} onChange={e => setDesc(e.target.value)} placeholder="Mô tả ngắn gọn về vai trò này..." />
          </div>

          {/* Permissions matrix */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Phân quyền <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setPerms([...ALL_PERMISSIONS])} style={{ fontSize: 11, color: "#60a5fa", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>Chọn tất cả</button>
                <button onClick={() => setPerms([])} style={{ fontSize: 11, color: "#64748b", background: "transparent", border: "1px solid rgba(30,42,80,0.8)", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>Bỏ chọn</button>
              </div>
            </div>
            {errors.perms && <div style={{ fontSize: 11, color: "#ef4444", marginBottom: 8 }}>{errors.perms}</div>}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(PERMISSION_GROUPS).map(([group, groupPerms]) => {
                const allSelected = groupPerms.every(p => perms.includes(p));
                const someSelected = groupPerms.some(p => perms.includes(p));
                return (
                  <div key={group} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 10, border: "1px solid rgba(30,42,80,0.5)", overflow: "hidden" }}>
                    {/* Group header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(0,0,0,0.15)", cursor: "pointer" }} onClick={() => toggleGroup(group)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${allSelected ? color : someSelected ? color : "rgba(30,42,80,0.8)"}`, background: allSelected ? color : someSelected ? `${color}40` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {allSelected && <CheckCircle size={10} style={{ color: "#fff" }} />}
                          {someSelected && !allSelected && <div style={{ width: 6, height: 2, background: color, borderRadius: 1 }} />}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: someSelected ? color : "#64748b" }}>{group}</span>
                        <span style={{ fontSize: 10, color: "#334155" }}>({groupPerms.filter(p => perms.includes(p)).length}/{groupPerms.length})</span>
                      </div>
                    </div>
                    {/* Permissions */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 14px" }}>
                      {groupPerms.map(perm => {
                        const selected = perms.includes(perm);
                        return (
                          <label key={perm} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", padding: "5px 10px", borderRadius: 7, border: "1px solid", borderColor: selected ? color : "rgba(30,42,80,0.8)", background: selected ? `${color}12` : "transparent", transition: "all 0.12s" }}>
                            <input type="checkbox" checked={selected} onChange={() => togglePerm(perm)} style={{ display: "none" }} />
                            <div style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${selected ? color : "rgba(30,42,80,0.8)"}`, background: selected ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {selected && <CheckCircle size={9} style={{ color: "#fff" }} />}
                            </div>
                            <span style={{ fontSize: 12, color: selected ? color : "#64748b", fontWeight: selected ? 600 : 400 }}>{perm}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={isEdit ? <Pencil size={13} /> : <Plus size={13} />} style={{ flex: 2 }}>
            {isEdit ? "Lưu thay đổi" : "Tạo vai trò"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Role Modal ──────────────────────────────────────── */
function DeleteModal({ role, adminCount, onConfirm, onClose }: { role: Role; adminCount: number; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ width: 380, maxWidth: "90vw", background: "#0d1226", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Xóa vai trò?</div>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            Vai trò <strong style={{ color: role.color }}>{role.name}</strong> sẽ bị xóa vĩnh viễn.
            {adminCount > 0 && <><br /><span style={{ color: "#f87171" }}>⚠ Có {adminCount} admin đang dùng vai trò này.</span></>}
          </div>
        </div>
        <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="danger" size="sm" onClick={() => { onConfirm(); onClose(); }} style={{ flex: 1 }}>Xóa</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Assign Role Modal ──────────────────────────────────────── */
function AssignRoleModal({ admins, roles, onSave, onClose }: {
  admins: Admin[];
  roles: Role[];
  onSave: (adminId: string, roleId: string) => void;
  onClose: () => void;
}) {
  const [adminId, setAdminId] = useState(admins[0]?.id ?? "");
  const [roleId, setRoleId]   = useState("");
  const [error, setError]     = useState("");

  const selectedAdmin = admins.find(a => a.id === adminId);
  const selectedRole  = roles.find(r => r.id === roleId);
  const currentRole   = roles.find(r => r.id === selectedAdmin?.roleId);

  const handleSubmit = () => {
    if (!roleId) { setError("Vui lòng chọn vai trò"); return; }
    if (roleId === selectedAdmin?.roleId) { setError("Tài khoản đang có vai trò này rồi"); return; }
    onSave(adminId, roleId);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 500, maxWidth: "92vw", maxHeight: "90vh", background: "#080d1c", border: "1px solid rgba(30,42,80,0.7)", borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${selectedRole?.color ?? "#3b82f6"},transparent)`, flexShrink: 0, transition: "background 0.3s" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(30,42,80,0.6)", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>Gán vai trò cho tài khoản</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Chọn tài khoản và vai trò muốn gán</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(30,42,80,0.8)", background: "rgba(255,255,255,0.04)", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Step 1: Chọn tài khoản */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
              1. Chọn tài khoản
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {admins.map(admin => {
                const aRole = roles.find(r => r.id === admin.roleId);
                const selected = adminId === admin.id;
                return (
                  <button key={admin.id} onClick={() => { setAdminId(admin.id); setRoleId(""); setError(""); }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "1px solid", borderColor: selected ? "#3b82f6" : "rgba(30,42,80,0.7)", background: selected ? "rgba(59,130,246,0.08)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: aRole ? `${aRole.color}20` : "rgba(30,42,80,0.8)", display: "flex", alignItems: "center", justifyContent: "center", color: aRole?.color ?? "#64748b", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                      {admin.name[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: selected ? "#f1f5f9" : "#94a3b8" }}>{admin.name}</div>
                      <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>{admin.email}</div>
                    </div>
                    {aRole && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: aRole.color, background: `${aRole.color}15`, padding: "2px 8px", borderRadius: 99, flexShrink: 0 }}>
                        {aRole.name}
                      </span>
                    )}
                    <div style={{ width: 18, height: 18, borderRadius: 99, border: `2px solid ${selected ? "#3b82f6" : "rgba(30,42,80,0.8)"}`, background: selected ? "#3b82f6" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {selected && <div style={{ width: 7, height: 7, borderRadius: 99, background: "#fff" }} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Chọn vai trò */}
          {adminId && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                2. Chọn vai trò mới
                {currentRole && <span style={{ fontSize: 10, fontWeight: 400, color: "#334155", textTransform: "none", marginLeft: 8 }}>
                  (hiện tại: <span style={{ color: currentRole.color }}>{currentRole.name}</span>)
                </span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {roles.map(r => {
                  const isCurrent = r.id === selectedAdmin?.roleId;
                  const selected  = roleId === r.id;
                  return (
                    <button key={r.id} onClick={() => { setRoleId(r.id); setError(""); }}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: "1px solid", borderColor: selected ? r.color : isCurrent ? `${r.color}40` : "rgba(30,42,80,0.7)", background: selected ? `${r.color}12` : isCurrent ? `${r.color}06` : "transparent", cursor: "pointer", textAlign: "left", position: "relative" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${r.color}20`, border: `1px solid ${r.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ShieldCheck size={17} style={{ color: r.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: selected ? r.color : "#94a3b8" }}>{r.name}</span>
                          {isCurrent && <span style={{ fontSize: 9, fontWeight: 700, color: "#64748b", background: "rgba(100,116,139,0.15)", padding: "1px 6px", borderRadius: 99 }}>Hiện tại</span>}
                          {r.isSystem && <span style={{ fontSize: 9, fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "1px 6px", borderRadius: 99 }}>HỆ THỐNG</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>{r.description} · {r.permissions.length} quyền</div>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: 99, border: `2px solid ${selected ? r.color : "rgba(30,42,80,0.8)"}`, background: selected ? r.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {selected && <div style={{ width: 7, height: 7, borderRadius: 99, background: "#fff" }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {error && <div style={{ fontSize: 12, color: "#f87171", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}><AlertCircle size={13} />{error}</div>}
            </div>
          )}

          {/* Preview */}
          {selectedAdmin && selectedRole && selectedRole.id !== selectedAdmin.roleId && (
            <div style={{ padding: "12px 16px", borderRadius: 10, background: `${selectedRole.color}06`, border: `1px solid ${selectedRole.color}20`, display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle size={16} style={{ color: selectedRole.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                <strong style={{ color: "#e2e8f0" }}>{selectedAdmin.name}</strong> sẽ được gán vai trò{" "}
                <strong style={{ color: selectedRole.color }}>{selectedRole.name}</strong> ({selectedRole.permissions.length} quyền)
              </span>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(30,42,80,0.6)", display: "flex", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.015)" }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} icon={<ShieldCheck size={13} />} style={{ flex: 2 }} disabled={!roleId || roleId === selectedAdmin?.roleId}>
            Gán vai trò
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Admin Modal ─────────────────────────────────────── */
function DeleteAdminModal({ admin, onConfirm, onClose }: { admin: Admin; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ width: 360, maxWidth: "90vw", background: "#0d1226", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Xóa tài khoản?</div>
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            Tài khoản <strong style={{ color: "#cbd5e1" }}>{admin.name}</strong><br />
            <span style={{ fontSize: 11 }}>{admin.email}</span><br />
            sẽ bị xóa và mất toàn bộ quyền truy cập.
          </div>
        </div>
        <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          <Button variant="danger" size="sm" onClick={() => { onConfirm(); onClose(); }} style={{ flex: 1 }}>Xóa</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function AdminsPage() {
  const [roles, setRoles]       = useState<Role[]>([]);
  const [admins, setAdmins]     = useState<Admin[]>([]);
  const [loading, setLoading]   = useState(true);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin]   = useState<Admin | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing]   = useState<Role | null>(null);
  const [deleting, setDeleting] = useState<Role | null>(null);
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = useCallback((msg: string, ok = true) => setToast({ msg, ok }), []);

  const refreshData = useCallback(() => {
    setLoading(true);
    Promise.all([adminsApi.list(), rolesApi.list()])
      .then(([adminList, roleList]) => {
        setAdmins(adminList.map(mapApiAdmin));
        setRoles(roleList.map(mapApiRole));
      })
      .catch(() => showToast("Không thể tải dữ liệu", false))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { refreshData(); }, [refreshData]);

  const handleSave = useCallback(async (data: Partial<Role> & { id?: string }) => {
    try {
      if (data.id) {
        await rolesApi.update(data.id, { name: data.name, description: data.description, color: data.color, permissions: data.permissions });
        showToast(`Đã cập nhật vai trò "${data.name}"`);
      } else {
        await rolesApi.create({ name: data.name!, description: data.description ?? "", color: data.color!, permissions: data.permissions! });
        showToast(`Đã tạo vai trò "${data.name}"`);
      }
      refreshData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Lưu vai trò thất bại", false);
    }
  }, [showToast, refreshData]);

  const handleDelete = useCallback(async (id: string) => {
    const role = roles.find(r => r.id === id);
    try {
      await rolesApi.delete(id);
      showToast(`Đã xóa vai trò "${role?.name}"`);
      refreshData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Xóa vai trò thất bại", false);
    }
  }, [roles, showToast, refreshData]);

  const handleAssignRole = useCallback(async (adminId: string, roleId: string) => {
    const admin = admins.find(a => a.id === adminId);
    const role  = roles.find(r => r.id === roleId);
    try {
      await adminsApi.assignRole(adminId, roleId);
      showToast(`Đã gán "${role?.name}" cho ${admin?.name}`);
      refreshData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Gán vai trò thất bại", false);
    }
  }, [admins, roles, showToast, refreshData]);

  const handleDeleteAdmin = useCallback(async (id: string) => {
    const admin = admins.find(a => a.id === id);
    try {
      await adminsApi.delete(id);
      showToast(`Đã xóa tài khoản ${admin?.name}`);
      refreshData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Xóa tài khoản thất bại", false);
    }
  }, [admins, showToast, refreshData]);

  const handleLockAdmin = useCallback(async (id: string, locked: boolean) => {
    try {
      await adminsApi.lock(id, locked);
      showToast(locked ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản");
      refreshData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Thao tác thất bại", false);
    }
  }, [showToast, refreshData]);

  const totalPerms = new Set(roles.flatMap(r => r.permissions)).size;

  return (
    <AdminLayout title="Phân quyền Admin" subtitle="Quản lý vai trò và quyền hạn hệ thống">
      <div className="page-content">

        {loading && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <span style={{ display: "inline-block", width: 24, height: 24, border: "2px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          </div>
        )}

        {!loading && (
        <><StatsGrid cols={4}>
          <StatCard label="Tổng vai trò" value={roles.length} changeLabel="vai trò" icon="users" color="blue" />
          <StatCard label="Tổng quyền hạn" value={totalPerms} changeLabel="quyền khả dụng" icon="activity" color="purple" />
          <StatCard label="Tổng admin" value={admins.length} changeLabel="tài khoản" icon="users" color="green" />
          <StatCard label="Vai trò tùy chỉnh" value={roles.filter(r => !r.isSystem).length} changeLabel="do bạn tạo" icon="activity" color="cyan" />
        </StatsGrid>

        {/* Header + Add */}
        <div className="glass-card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Vai trò & Quyền hạn</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>Click vào vai trò để xem chi tiết quyền hạn, nhấn sửa để chỉnh quyền</div>
          </div>
          <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setCreating(true)}>Thêm vai trò</Button>
        </div>

        {/* Role cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {roles.map(role => {
            const adminCount = admins.filter(a => a.roleId === role.id).length;
            const roleAdmins = admins.filter(a => a.roleId === role.id);
            return (
              <div key={role.id} className="glass-card" style={{ overflow: "hidden", borderTop: `3px solid ${role.color}` }}>
                {/* Card header */}
                <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(30,42,80,0.5)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${role.color}18`, border: `1px solid ${role.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {role.name === "Super Admin" ? <ShieldAlert size={18} style={{ color: role.color }} /> : role.name === "Quản lý" ? <ShieldCheck size={18} style={{ color: role.color }} /> : role.name === "Kế toán" ? <Key size={18} style={{ color: role.color }} /> : <Shield size={18} style={{ color: role.color }} />}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{role.name}</span>
                          {role.isSystem && <span style={{ fontSize: 9, fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "1px 6px", borderRadius: 99 }}>HỆ THỐNG</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{role.description}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <button onClick={() => setEditing(role)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(30,42,80,0.8)", background: "transparent", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Pencil size={12} /></button>
                      {!role.isSystem && (
                        <button onClick={() => setDeleting(role)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(239,68,68,0.2)", background: "transparent", color: "#f87171", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Trash2 size={12} /></button>
                      )}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontSize: 12, color: role.color, fontWeight: 700 }}>{role.permissions.length} quyền</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#475569" }}>
                      <Users size={11} />{adminCount} admin
                    </span>
                  </div>
                </div>

                {/* Permissions by group */}
                <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {Object.entries(PERMISSION_GROUPS).map(([group, groupPerms]) => {
                    const granted = groupPerms.filter(p => role.permissions.includes(p));
                    if (granted.length === 0) return null;
                    return (
                      <div key={group}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{group}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {granted.map(p => (
                            <span key={p} style={{ fontSize: 11, color: role.color, background: `${role.color}10`, border: `1px solid ${role.color}20`, padding: "2px 8px", borderRadius: 99 }}>{p}</span>
                          ))}
                          {groupPerms.filter(p => !role.permissions.includes(p)).map(p => (
                            <span key={p} style={{ fontSize: 11, color: "#1e293b", background: "rgba(15,23,42,0.5)", padding: "2px 8px", borderRadius: 99, textDecoration: "line-through" }}>{p}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Admins using this role */}
                {roleAdmins.length > 0 && (
                  <div style={{ padding: "10px 18px 14px", borderTop: "1px solid rgba(30,42,80,0.4)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Admin đang dùng vai trò này</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {roleAdmins.map(a => (
                        <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 8px 3px 4px", borderRadius: 99, background: "rgba(30,42,80,0.5)", border: "1px solid rgba(30,42,80,0.8)" }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${role.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: role.color }}>{a.name[0]}</div>
                          <span style={{ fontSize: 11, color: a.status === "BiKhoa" ? "#475569" : "#94a3b8" }}>{a.name.split(" ").slice(-1)[0]}</span>
                          {a.status === "BiKhoa" && <span style={{ fontSize: 9, color: "#ef4444" }}>●</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 12, color: "#334155" }}>
          {roles.length} vai trò · Vai trò <span style={{ color: "#f59e0b", fontWeight: 600 }}>HỆ THỐNG</span> không thể xóa · Quyền bị gạch ngang là quyền không được cấp
        </div>

        {/* ─── Accounts section ─── */}
        <div className="glass-card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Tài khoản quản trị viên</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>Quản lý danh sách admin, phân công vai trò</div>
          </div>
          <Button variant="primary" size="sm" icon={<ShieldCheck size={13} />} onClick={() => setCreatingAdmin(true)}>Gán vai trò</Button>
        </div>

        <div className="glass-card" style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tài khoản</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Đăng nhập gần nhất</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => {
                const role = roles.find(r => r.id === admin.roleId);
                const isLocked = admin.status === "BiKhoa";
                const avatarBg = role ? `${role.color}30` : "rgba(71,85,105,0.5)";
                return (
                  <tr key={admin.id} style={{ opacity: isLocked ? 0.6 : 1 }}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: avatarBg, display: "flex", alignItems: "center", justifyContent: "center", color: role?.color ?? "#64748b", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                          {admin.name[0]}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{admin.name}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 12, color: "#64748b" }}>{admin.email}</span></td>
                    <td>
                      {role ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: role.color, background: `${role.color}15`, padding: "2px 10px", borderRadius: 99 }}>
                          <ShieldCheck size={11} />{role.name}
                        </span>
                      ) : <span style={{ color: "#334155", fontSize: 11 }}>{admin.roleName || "—"}</span>}
                    </td>
                    <td><span style={{ fontSize: 11, color: "#475569" }}>{admin.lastLogin ?? "—"}</span></td>
                    <td>
                      <span
                        style={{ fontSize: 11, fontWeight: 700, color: isLocked ? "#ef4444" : "#10b981", background: isLocked ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: 99, cursor: "pointer" }}
                        onClick={() => handleLockAdmin(admin.id, !isLocked)}
                        title={isLocked ? "Nhấn để mở khóa" : "Nhấn để khóa"}
                      >
                        {isLocked ? "Bị khóa" : "Hoạt động"}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setEditingAdmin(admin)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(30,42,80,0.8)", background: "transparent", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Pencil size={12} /></button>
                        {!role?.isSystem && (
                          <button onClick={() => setDeletingAdmin(admin)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(239,68,68,0.2)", background: "transparent", color: "#f87171", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Trash2 size={12} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ fontSize: 12, color: "#334155" }}>
          {admins.length} tài khoản · Vai trò hệ thống <span style={{ color: "#f59e0b", fontWeight: 600 }}>không thể xóa admin</span>
        </div>
        </>
        )}
      </div>

      {/* Modals */}
      {creating && <RoleFormModal onSave={handleSave} onClose={() => setCreating(false)} />}
      {editing && <RoleFormModal role={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
      {deleting && <DeleteModal role={deleting} adminCount={admins.filter(a => a.roleId === deleting.id).length} onConfirm={() => handleDelete(deleting.id)} onClose={() => setDeleting(null)} />}
      {creatingAdmin && <AssignRoleModal admins={admins} roles={roles} onSave={handleAssignRole} onClose={() => setCreatingAdmin(false)} />}
      {editingAdmin && <AssignRoleModal admins={admins.filter(a => a.id === editingAdmin.id)} roles={roles} onSave={handleAssignRole} onClose={() => setEditingAdmin(null)} />}
      {deletingAdmin && <DeleteAdminModal admin={deletingAdmin} onConfirm={() => handleDeleteAdmin(deletingAdmin.id)} onClose={() => setDeletingAdmin(null)} />}
      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}
