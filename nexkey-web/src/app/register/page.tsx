"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.16),transparent_55%)]" />
      <div className="container-page relative py-8 md:py-10">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_460px]">
          <Card className="hidden border-white/60 bg-white/70 p-6 backdrop-blur lg:block">
            <div className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              Tài khoản mới
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              Tạo tài khoản để mua nhanh hơn
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Lưu thông tin thanh toán, theo dõi lịch sử đơn hàng và nhận hỗ trợ
              kích hoạt tức thì từ đội ngũ NexKey.
            </p>
            <div className="mt-6 space-y-2">
              {[
                "Theo dõi đơn hàng & key đã giao tại một nơi",
                "Nhận ưu đãi thành viên và mã giảm giá riêng",
                "Rút ngắn thời gian thanh toán cho lần mua sau",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-xl border border-border/80 bg-white/90 p-3 text-sm text-slate-700"
                >
                  <span className="mt-0.5 text-emerald-600">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-white/70 bg-white/95 p-5 shadow-lg shadow-slate-200/50 md:p-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Đăng ký
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Tạo tài khoản NexKey để theo dõi đơn hàng và nhận hỗ trợ nhanh.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Họ tên
                </div>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                  placeholder="Nguyễn Văn A"
                />
              </label>
              <label className="block sm:col-span-2">
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
              <label className="block sm:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Số điện thoại
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                  placeholder="0900xxxxxx"
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
              <label className="block">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Xác nhận mật khẩu
                </div>
                <input
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  type="password"
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                />
              </label>
            </div>

            <div className="mt-5 space-y-2">
              <Button
                className="w-full"
                disabled={!fullName || !email}
                onClick={() => {
                  if (!fullName || !email) return;
                  setUser({ id: `guest_${email}`, fullName, email, phone });
                  router.push("/account");
                }}
              >
                Tạo tài khoản
              </Button>
              <Button href="/login" variant="outline" className="w-full">
                Đã có tài khoản? Đăng nhập
              </Button>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Bằng việc đăng ký, bạn đồng ý với điều khoản và chính sách của NexKey.
            </div>
            <div className="mt-2 text-sm">
              <Link className="font-semibold hover:underline" href="/login">
                Quay lại đăng nhập
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

