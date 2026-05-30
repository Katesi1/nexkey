"use client";

import { notFound, useRouter } from "next/navigation";
import { use, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { fetchPublicProducts } from "@/lib/api";
import { mapApiProduct, toSlug } from "@/lib/mappers";
import { cacheProducts } from "@/lib/catalog";
import { formatVnd } from "@/lib/currency";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stars } from "@/components/ui/Stars";
import { ProductImage } from "@/components/products/ProductImage";
import { ProductCategoryIcon } from "@/lib/productIcons";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductReviews } from "@/components/products/ProductReviews";
import { useStore } from "@/store/useStore";

const tabs = [
  { id: "desc",     label: "Mô tả sản phẩm" },
  { id: "guide",    label: "Hướng dẫn kích hoạt" },
  { id: "warranty", label: "Chính sách bảo hành" },
  { id: "faq",      label: "Câu hỏi thường gặp" },
] as const;

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router         = useRouter();
  const { slug }       = use(params);
  const { addToCart }  = useStore();
  const [qty, setQty]  = useState(1);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("desc");
  const [product,  setProduct]  = useState<Product | null | undefined>(undefined);
  const [related,  setRelated]  = useState<Product[]>([]);

  useEffect(() => {
    fetchPublicProducts()
      .then(apiProducts => {
        const products = apiProducts.map(p => mapApiProduct(p, apiProducts));
        cacheProducts(products); // populate cache for cart/checkout
        const found    = products.find(p => p.slug === slug);
        setProduct(found ?? null);
        if (found) {
          setRelated(products.filter(p => found.relatedSlugs.includes(p.slug)));
        }
      })
      .catch(() => setProduct(null));
  }, [slug]);

  // Loading state
  if (product === undefined) {
    return (
      <main className="container-page py-8">
        <div className="text-sm text-slate-500">Đang tải sản phẩm…</div>
      </main>
    );
  }

  if (product === null) return notFound();

  return (
    <main className="container-page py-8">
      <div className="mb-5 text-sm text-slate-600">
        <Link className="hover:underline" href="/products">Sản phẩm</Link>{" "}
        <span className="text-slate-400">/</span>{" "}
        <span className="text-slate-900">{product.name}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <ProductImage name={product.name} category={product.category} className="h-[340px]" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex h-20 items-center justify-center rounded-2xl border border-border bg-slate-50">
                <ProductCategoryIcon category={product.category} size={32} />
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blue">{product.type}</Badge>
            {(product.badges ?? []).map(b => (
              <Badge key={b} tone={b === "Bán chạy" ? "green" : b === "Ưu đãi" ? "amber" : "purple"}>{b}</Badge>
            ))}
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2">
            <Stars value={product.rating} />
            <span className="text-sm font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-slate-500">({product.reviewCount.toLocaleString("vi-VN")} đã mua)</span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <div className="text-2xl font-black text-slate-900">{formatVnd(product.price)}</div>
              {product.compareAtPrice && (
                <div className="text-sm text-slate-400 line-through">{formatVnd(product.compareAtPrice)}</div>
              )}
            </div>
            <div className={`text-sm font-semibold ${product.inStock ? "text-emerald-600" : "text-rose-600"}`}>
              {product.inStock ? "Còn hàng" : "Hết hàng"}
            </div>
          </div>

          <div className="mt-5 space-y-2 text-sm text-slate-700">
            {product.shortBullets.slice(0, 4).map(t => (
              <div key={t} className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> <span>{t}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-xl border border-border bg-white shadow-sm">
              <button aria-label="Giảm" className="flex h-10 w-10 items-center justify-center rounded-l-xl text-slate-500 hover:bg-slate-50" onClick={() => setQty(q => Math.max(1, q - 1))}>
                <Minus size={14} />
              </button>
              <input value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value || 1)))}
                className="h-10 w-14 border-x border-border text-center text-sm font-semibold text-slate-900 focus:outline-none" />
              <button aria-label="Tăng" className="flex h-10 w-10 items-center justify-center rounded-r-xl text-slate-500 hover:bg-slate-50" onClick={() => setQty(q => Math.min(99, q + 1))}>
                <Plus size={14} />
              </button>
            </div>
            <Button size="md" className="flex-1" disabled={!product.inStock}
              onClick={() => { addToCart(product.id, qty); router.push("/cart"); }}>
              Mua ngay
            </Button>
            <Button size="md" variant="outline" disabled={!product.inStock}
              onClick={() => { addToCart(product.id, qty); }}>
              <ShoppingCart size={15} /> Thêm vào giỏ
            </Button>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Thông tin nhanh</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Giao tự động qua email</li>
              <li>Bảo hành rõ ràng</li>
              <li>Hỗ trợ cài đặt/kích hoạt</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* ── Tabs ── */}
      <section className="mt-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map(t => (
            <Button key={t.id} variant={activeTab === t.id ? "secondary" : "outline"} size="sm"
              onClick={() => setActiveTab(t.id)}>
              {t.label}
            </Button>
          ))}
        </div>
        <Card className="mt-4 p-6">
          {activeTab === "desc" && (
            <div className="space-y-3 text-sm leading-7 text-slate-700">
              <p>{product.description}</p>
              <p>Cam kết: hàng chính hãng, hỗ trợ nhanh, quy trình minh bạch và dễ yêu cầu bảo hành.</p>
            </div>
          )}
          {activeTab === "guide" && (
            <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{product.activationGuide}</pre>
          )}
          {activeTab === "warranty" && (
            <div className="space-y-3 text-sm leading-7 text-slate-700">
              <p>{product.warrantyPolicy}</p>
              <p>Nếu gặp lỗi, vào trang <Link className="font-semibold hover:underline" href="/support">hỗ trợ</Link> và gửi mã đơn hàng để được xử lý nhanh.</p>
            </div>
          )}
          {activeTab === "faq" && (
            <div className="space-y-4">
              {product.faq.map(f => (
                <div key={f.q} className="rounded-2xl border border-border p-4">
                  <div className="text-sm font-semibold text-slate-900">{f.q}</div>
                  <div className="mt-1 text-sm text-slate-600">{f.a}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <ProductReviews rating={product.rating} reviewCount={product.reviewCount} />

      {related.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Sản phẩm liên quan</h2>
            <Button href="/products" variant="outline" size="sm">Xem tất cả</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}
