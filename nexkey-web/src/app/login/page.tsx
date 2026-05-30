"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Google } from "developer-icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.14),transparent_55%)]" />
      <div className="container-page relative py-8 md:py-10">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
          <Card className="hidden border-white/60 bg-white/70 p-6 backdrop-blur lg:block">
            <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Chào mừng quay lại NexKey
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              Đăng nhập và quản lý đơn hàng dễ dàng
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Theo dõi lịch sử mua, xem key đã giao và nhận hỗ trợ nhanh chỉ trong
              một nơi.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Giao nhanh", "Nhận key tự động sau thanh toán"],
                ["Bảo mật", "Tài khoản được lưu an toàn"],
                ["Hỗ trợ", "Kích hoạt và bảo hành 24/7"],
              ].map(([title, desc]) => (
                <div
                  key={title}
                  className="rounded-xl border border-border/80 bg-white/90 p-3"
                >
                  <div className="text-sm font-semibold text-slate-900">{title}</div>
                  <div className="mt-1 text-xs text-slate-600">{desc}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-white/70 bg-white/95 p-5 shadow-lg shadow-slate-200/50 md:p-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Đăng nhập
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Đăng nhập để xem đơn hàng, quản lý tài khoản và hỗ trợ nhanh.
            </p>

            <div className="mt-5 space-y-3">
              <label className="block">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                  placeholder="email@example.com"
                />
              </label>
              <label className="block">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Mật khẩu
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                />
              </label>
            </div>

            <div className="mt-5 space-y-2">
              <Button
                className="w-full"
                disabled={!email}
                onClick={() => {
                  if (!email) return;
                  setUser({ id: `guest_${email}`, fullName: email.split("@")[0], email, phone: "" });
                  router.push("/account");
                }}
              >
                Tiếp tục với Email
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-600">Quên mật khẩu?</span>
              <Link className="font-semibold hover:underline" href="/register">
                Tạo tài khoản
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

