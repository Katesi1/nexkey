"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { formatVnd } from "@/lib/currency";

export default function AccountPage() {
  const router = useRouter();
  const { user, orders, updateProfile, logout } = useStore();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpend = orders.reduce((s, o) => s + o.total, 0);
    return { totalOrders, totalSpend };
  }, [orders]);

  if (!user) {
    return (
      <main className="container-page py-10">
        <Card className="mx-auto max-w-xl p-6">
          <div className="text-sm text-slate-700">
            Bạn chưa đăng nhập. Vui lòng đăng nhập để xem tài khoản.
          </div>
          <div className="mt-4">
            <Button href="/login">Đăng nhập</Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Tài khoản
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Quản lý thông tin cá nhân, đơn hàng và yêu cầu hỗ trợ.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-4">
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">
              Thông tin cá nhân
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <div className="text-xs font-semibold text-slate-600">Họ tên</div>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block sm:col-span-2">
                <div className="text-xs font-semibold text-slate-600">Email</div>
                <input
                  value={user.email}
                  disabled
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-slate-50 px-3 text-sm text-slate-600"
                />
              </label>
              <label className="block sm:col-span-2">
                <div className="text-xs font-semibold text-slate-600">
                  Số điện thoại
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                onClick={() => updateProfile({ fullName, phone })}
              >
                Lưu thay đổi
              </Button>
              <Button variant="outline" onClick={() => router.push("/orders")}>
                Xem đơn hàng
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">Đổi mật khẩu</div>
            <div className="mt-2 text-sm text-slate-600">
              Demo UI — sẽ nối API thật sau.
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                type="password"
                placeholder="Mật khẩu hiện tại"
                className="h-11 rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
              />
              <input
                type="password"
                placeholder="Mật khẩu mới"
                className="h-11 rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
              />
              <div className="sm:col-span-2">
                <Button variant="outline">Cập nhật mật khẩu (mock)</Button>
              </div>
            </div>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">Tổng quan</div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-border bg-white p-4">
                <div className="text-xs font-semibold text-slate-500">
                  Tổng số đơn đã mua
                </div>
                <div className="mt-1 text-xl font-black text-slate-900">
                  {stats.totalOrders}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <div className="text-xs font-semibold text-slate-500">
                  Tổng chi tiêu
                </div>
                <div className="mt-1 text-xl font-black text-slate-900">
                  {formatVnd(stats.totalSpend)}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">
              Đơn hàng gần đây
            </div>
            <div className="mt-4 space-y-2">
              {orders.slice(0, 3).map((o) => (
                <Link
                  key={o.id}
                  href={`/orders/${encodeURIComponent(o.id)}`}
                  className="block rounded-2xl border border-border bg-white p-4 hover:bg-slate-50"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {o.id}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {o.status} • {formatVnd(o.total)}
                  </div>
                </Link>
              ))}
              {orders.length === 0 ? (
                <div className="text-sm text-slate-600">
                  Chưa có đơn hàng.
                </div>
              ) : null}
            </div>
            <div className="mt-4">
              <Button href="/orders" variant="outline" className="w-full">
                Xem tất cả đơn hàng
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">Ticket hỗ trợ</div>
            <div className="mt-2 text-sm text-slate-600">
              Tạo ticket mới để yêu cầu hỗ trợ/bảo hành.
            </div>
            <div className="mt-4 space-y-2">
              <Button href="/support" className="w-full">
                Tạo ticket hỗ trợ
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => logout()}
              >
                Đăng xuất
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}

