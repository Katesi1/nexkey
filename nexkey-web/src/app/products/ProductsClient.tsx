"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORY_LABEL, PRODUCTS } from "@/lib/catalog";
import type { ProductCategory, ProductType } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 9;

// ── Pagination component ───────────────────────────────────────────
function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

function Pagination({
  current,
  total,
  onPageChange,
}: {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const pages = getPageNumbers(current, total);
  const btnBase =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <nav
      aria-label="Phân trang"
      className="mt-8 flex items-center justify-center gap-1.5"
    >
      {/* prev */}
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        aria-label="Trang trước"
        className={`${btnBase} border-border bg-white px-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronLeft size={16} />
      </button>

      {/* page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-label={`Trang ${p}`}
            aria-current={p === current ? "page" : undefined}
            className={`${btnBase} px-3 ${
              p === current
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-border bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ),
      )}

      {/* next */}
      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        aria-label="Trang sau"
        className={`${btnBase} border-border bg-white px-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

// ── price ranges ───────────────────────────────────────────────────
const priceRanges = [
  { id: "all", label: "Tất cả", min: 0, max: Infinity },
  { id: "lt100", label: "Dưới 100.000đ", min: 0, max: 100000 },
  { id: "100-300", label: "100.000đ - 300.000đ", min: 100000, max: 300000 },
  { id: "300-700", label: "300.000đ - 700.000đ", min: 300000, max: 700000 },
  { id: "gt700", label: "Trên 700.000đ", min: 700000, max: Infinity },
] as const;

function isProductType(v: string): v is ProductType {
  return v === "Retail" || v === "Subscription" || v === "Combo";
}

function isSort(v: string): v is "bestseller" | "new" | "deal" {
  return v === "bestseller" || v === "new" || v === "deal";
}

export function ProductsClient({ initialCategory }: { initialCategory?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = (initialCategory ?? "") as ProductCategory;
  const initialOk = (Object.keys(CATEGORY_LABEL) as ProductCategory[]).includes(initial);

  const [category, setCategory] = useState<ProductCategory | "all">(
    initialOk ? initial : "all",
  );
  const [price, setPrice] = useState<(typeof priceRanges)[number]["id"]>("all");
  const [type, setType] = useState<ProductType | "all">("all");
  const [sort, setSort] = useState<"bestseller" | "new" | "deal">("bestseller");

  // đọc page từ URL, fallback về 1
  const currentPage = Math.max(1, Number(searchParams.get("page") ?? "1"));

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete("page");
    else params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  }

  // reset về trang 1 khi bộ lọc thay đổi
  function changeFilter<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };
  }

  const filtered = useMemo(() => {
    const pr = priceRanges.find((p) => p.id === price) ?? priceRanges[0];
    const list = PRODUCTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (type !== "all" && p.type !== type) return false;
      if (p.price < pr.min || p.price > pr.max) return false;
      return true;
    });

    const score = (p: (typeof PRODUCTS)[number]) => {
      if (sort === "deal") return (p.compareAtPrice ?? p.price) - p.price;
      if (sort === "new") return p.badges?.includes("Mới") ? 10 : 0;
      return p.badges?.includes("Bán chạy") ? 10 : p.rating;
    };

    return [...list].sort((a, b) => score(b) - score(a));
  }, [category, price, type, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4">
        <Card>
          <CardHeader title="Bộ lọc" subtitle="Lọc theo danh mục, giá, loại" />
          <CardBody className="space-y-5">
            <div>
              <div className="text-sm font-semibold text-slate-900">Danh mục</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  variant={category === "all" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => changeFilter(setCategory)("all")}
                >
                  Tất cả
                </Button>
                {(Object.keys(CATEGORY_LABEL) as ProductCategory[]).map((c) => (
                  <Button
                    key={c}
                    variant={category === c ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => changeFilter(setCategory)(c)}
                  >
                    {CATEGORY_LABEL[c]}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900">
                Khoảng giá
              </div>
              <div className="mt-2 space-y-2">
                {priceRanges.map((r) => (
                  <label
                    key={r.id}
                    className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={price === r.id}
                      onChange={() => changeFilter(setPrice)(r.id)}
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900">
                Loại sản phẩm
              </div>
              <select
                className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                value={type}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "all") changeFilter(setType)("all");
                  else if (isProductType(v)) changeFilter(setType)(v);
                }}
              >
                <option value="all">Tất cả</option>
                <option value="Retail">Retail</option>
                <option value="Subscription">Subscription</option>
                <option value="Combo">Combo</option>
              </select>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900">Sắp xếp</div>
              <select
                className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                value={sort}
                onChange={(e) => {
                  const v = e.target.value;
                  if (isSort(v)) changeFilter(setSort)(v);
                }}
              >
                <option value="bestseller">Bán chạy</option>
                <option value="new">Mới nhất</option>
                <option value="deal">Ưu đãi</option>
              </select>
            </div>
          </CardBody>
        </Card>
      </aside>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <span className="font-semibold">{filtered.length}</span> sản phẩm
            {totalPages > 1 && (
              <span className="ml-1 text-slate-400">
                — trang {safePage}/{totalPages}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              changeFilter(setCategory)("all");
              setPrice("all");
              setType("all");
              setSort("bestseller");
            }}
          >
            Reset bộ lọc
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <Pagination
            current={safePage}
            total={totalPages}
            onPageChange={goToPage}
          />
        )}
      </section>
    </div>
  );
}

