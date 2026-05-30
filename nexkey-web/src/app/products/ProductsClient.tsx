"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product, ProductCategory, ProductType } from "@/lib/types";
import type { WebCategory } from "@/lib/mappers";
import { ProductCard } from "@/components/products/ProductCard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 9;

// ── Price ranges ───────────────────────────────────────────────────────────
const priceRanges = [
  { id: "all",     label: "Tất cả",                  min: 0,      max: Infinity },
  { id: "lt100",   label: "Dưới 100.000đ",            min: 0,      max: 100_000 },
  { id: "100-300", label: "100.000đ - 300.000đ",      min: 100_000, max: 300_000 },
  { id: "300-700", label: "300.000đ - 700.000đ",      min: 300_000, max: 700_000 },
  { id: "gt700",   label: "Trên 700.000đ",            min: 700_000, max: Infinity },
] as const;

// ── Pagination ─────────────────────────────────────────────────────────────
function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

function Pagination({ current, total, onPageChange }: {
  current: number; total: number; onPageChange: (p: number) => void;
}) {
  const base = "inline-flex h-9 min-w-9 items-center justify-center rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring";
  return (
    <nav aria-label="Phân trang" className="mt-8 flex items-center justify-center gap-1.5">
      <button onClick={() => onPageChange(current - 1)} disabled={current === 1} aria-label="Trang trước"
        className={`${base} border-border bg-white px-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}>
        <ChevronLeft size={16} />
      </button>
      {getPageNumbers(current, total).map((p, i) =>
        p === "…" ? (
          <span key={`e-${i}`} className="px-1 text-sm text-slate-400">…</span>
        ) : (
          <button key={p} onClick={() => onPageChange(p)} aria-current={p === current ? "page" : undefined}
            className={`${base} px-3 ${p === current ? "border-slate-900 bg-slate-900 text-white" : "border-border bg-white text-slate-700 hover:bg-slate-50"}`}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onPageChange(current + 1)} disabled={current === total} aria-label="Trang sau"
        className={`${base} border-border bg-white px-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
type Props = {
  products: Product[];
  categories: WebCategory[];
  initialCategory?: string;
};

export function ProductsClient({ products, categories, initialCategory }: Props) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<ProductCategory | "all">(
    (initialCategory as ProductCategory) ?? "all",
  );
  const [price, setPrice] = useState<(typeof priceRanges)[number]["id"]>("all");
  const [type,  setType]  = useState<ProductType | "all">("all");
  const [sort,  setSort]  = useState<"bestseller" | "new" | "deal">("bestseller");

  const currentPage = Math.max(1, Number(searchParams.get("page") ?? "1"));

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete("page"); else params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  }

  function changeFilter<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };
  }

  const filtered = useMemo(() => {
    const pr = priceRanges.find(r => r.id === price) ?? priceRanges[0];
    const list = products.filter(p => {
      if (category !== "all" && p.category !== category) return false;
      if (type !== "all" && p.type !== type) return false;
      if (p.price < pr.min || p.price > pr.max) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sort === "deal") return ((b.compareAtPrice ?? b.price) - b.price) - ((a.compareAtPrice ?? a.price) - a.price);
      if (sort === "new")  return b.badges?.includes("Mới") ? 1 : -1;
      return (b.badges?.includes("Bán chạy") ? 10 : b.rating) - (a.badges?.includes("Bán chạy") ? 10 : a.rating);
    });
  }, [products, category, price, type, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const hasProducts = products.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* ── Sidebar filter ── */}
      <aside className="space-y-4">
        <Card>
          <CardHeader title="Bộ lọc" subtitle="Lọc theo danh mục, giá, loại" />
          <CardBody className="space-y-5">

            {/* Danh mục từ API */}
            <div>
              <div className="text-sm font-semibold text-slate-900">Danh mục</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant={category === "all" ? "secondary" : "outline"} size="sm"
                  onClick={() => changeFilter(setCategory)("all")}>
                  Tất cả
                </Button>
                {categories.map(c => (
                  <Button key={c.id} variant={category === c.key ? "secondary" : "outline"} size="sm"
                    onClick={() => changeFilter(setCategory)(c.key)}>
                    {c.icon} {c.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Khoảng giá */}
            <div>
              <div className="text-sm font-semibold text-slate-900">Khoảng giá</div>
              <div className="mt-2 space-y-2">
                {priceRanges.map(r => (
                  <label key={r.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input type="radio" name="price" checked={price === r.id}
                      onChange={() => changeFilter(setPrice)(r.id)} />
                    {r.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Loại sản phẩm */}
            <div>
              <div className="text-sm font-semibold text-slate-900">Loại sản phẩm</div>
              <select className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                value={type}
                onChange={e => {
                  const v = e.target.value;
                  changeFilter(setType)(v as ProductType | "all");
                }}>
                <option value="all">Tất cả</option>
                <option value="Retail">Retail</option>
                <option value="Subscription">Subscription</option>
                <option value="Combo">Combo</option>
              </select>
            </div>

            {/* Sắp xếp */}
            <div>
              <div className="text-sm font-semibold text-slate-900">Sắp xếp</div>
              <select className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                value={sort}
                onChange={e => changeFilter(setSort)(e.target.value as typeof sort)}>
                <option value="bestseller">Bán chạy</option>
                <option value="new">Ưu đãi nhiều nhất</option>
                <option value="deal">Giảm giá</option>
              </select>
            </div>
          </CardBody>
        </Card>
      </aside>

      {/* ── Product grid ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {!hasProducts ? (
              <span className="text-slate-400">Không tải được sản phẩm</span>
            ) : (
              <>
                <span className="font-semibold">{filtered.length}</span> sản phẩm
                {totalPages > 1 && (
                  <span className="ml-1 text-slate-400">— trang {safePage}/{totalPages}</span>
                )}
              </>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => {
            changeFilter(setCategory)("all");
            setPrice("all");
            setType("all");
            setSort("bestseller");
          }}>
            Reset bộ lọc
          </Button>
        </div>

        {paged.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-slate-500">
            {hasProducts ? "Không có sản phẩm phù hợp bộ lọc." : "Đang tải sản phẩm…"}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination current={safePage} total={totalPages} onPageChange={goToPage} />
        )}
      </section>
    </div>
  );
}
