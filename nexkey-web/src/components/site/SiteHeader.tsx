"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ShoppingCart, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

const NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/guides", label: "Hướng dẫn" },
  { href: "/support", label: "Hỗ trợ" },
];

export function SiteHeader() {
  const { cartCount, user } = useStore();
  const [q, setQ] = useState("");

  const accountHref = useMemo(() => {
    if (user?.id) return "/account";
    return "/login";
  }, [user?.id]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/80 backdrop-blur">
      <div className="container-page">
        <div className="flex h-14 items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-from via-brand-via to-brand-to text-white shadow-sm">
              <span className="text-sm font-semibold tracking-tight">NK</span>
            </div>
            <span className="hidden text-base font-semibold tracking-tight sm:inline">
              NexKey
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="hidden w-full max-w-md md:block">
              <label className="relative block">
                <span className="sr-only">Tìm kiếm sản phẩm</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm…"
                  className="w-full rounded-lg border border-border bg-white px-4 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-ring"
                />
                <span className="pointer-events-none absolute right-3 top-2 text-slate-400">
                  <Search size={15} />
                </span>
              </label>
            </div>

            {/* cart icon button */}
            <Link
              href="/cart"
              aria-label={`Giỏ hàng${cartCount > 0 ? ` (${cartCount} sản phẩm)` : ""}`}
              className={cn(
                "relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* account button */}
            <Link
              href={accountHref}
              aria-label={user?.id ? "Tài khoản" : "Đăng nhập"}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-brand-from via-brand-via to-brand-to px-3.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              <User size={15} />
              <span>{user?.id ? "Tài khoản" : "Đăng nhập"}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

