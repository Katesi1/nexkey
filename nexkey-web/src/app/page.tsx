import Link from "next/link";
import { PRODUCTS, CATEGORY_LABEL } from "@/lib/catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCategoryIcon } from "@/lib/productIcons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import type { ProductCategory } from "@/lib/types";

export default function Home() {
  const featured = PRODUCTS.slice(0, 4);
  const trustStats = [
    ["10.000+", "Khách hàng tin tưởng"],
    ["99.9%", "Kích hoạt thành công"],
    ["5 phút", "Giao hàng tự động"],
    ["24/7", "Hỗ trợ khách hàng"],
    ["100%", "Hàng chính hãng"],
    ["4.9 ★", "Đánh giá trung bình"],
    ["3 bước", "Quy trình đơn giản"],
    ["0 phí ẩn", "Minh bạch giá cả"],
    ["30 ngày", "Bảo hành rõ ràng"],
    ["VietQR & MoMo", "Thanh toán linh hoạt"],
  ] as const;

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.22),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.22),transparent_55%)]" />
        <div className="container-page relative py-12 md:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge tone="blue" className="bg-blue-50 text-blue-700">
                SaaS e-commerce • Giao tự động
              </Badge>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                Key Windows, YouTube Premium, Google One{" "}
                <span className="bg-gradient-to-br from-brand-from via-brand-via to-brand-to bg-clip-text text-transparent">
                  chính hãng
                </span>
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
                Giao tự động sau thanh toán - Hỗ trợ 24/7. Trải nghiệm mua nhanh,
                giao rõ ràng, bảo hành minh bạch.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button href="/products" size="lg">
                  Mua ngay
                </Button>
                <Button href="/products" variant="outline" size="lg">
                  Xem sản phẩm
                </Button>
              </div>

            </div>

            <div className="relative">
              <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Tại sao chọn NexKey?
                    </div>
                    <div className="text-xs text-slate-500">
                      Uy tín • Rõ ràng • Nhanh chóng
                    </div>
                  </div>
                  <div className="grid size-10 place-items-center rounded-2xl bg-slate-900 text-white">
                    ✓
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  {[
                    ["Giao hàng tự động", "Nhận key ngay sau thanh toán"],
                    ["Hỗ trợ kích hoạt", "Cài đặt/active nhanh 24/7"],
                    ["Bảo hành rõ ràng", "Chính sách minh bạch"],
                    ["Thanh toán an toàn", "Nhiều phương thức tiện lợi"],
                  ].map(([t, d]) => (
                    <div
                      key={t}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-slate-50 p-4"
                    >
                      <div className="mt-0.5 grid size-8 place-items-center rounded-xl bg-white shadow-sm">
                        <span className="text-slate-900">●</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {t}
                        </div>
                        <div className="text-xs text-slate-500">{d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pointer-events-none absolute -right-6 -top-6 hidden size-28 rounded-full bg-gradient-to-br from-brand-from via-brand-via to-brand-to opacity-20 blur-2xl md:block" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pt-6">
        <MarqueeStrip items={trustStats} />
      </section>

      <section className="container-page py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Danh mục nhanh
          </h2>
          <Link
            className="text-sm font-semibold text-slate-700 hover:underline"
            href="/products"
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {(
            [
              "windows",
              "office",
              "youtube",
              "google-one",
              "combo",
            ] as const
          ).map((c) => (
            <Link
              key={c}
              href={`/products?category=${c}`}
              className="rounded-2xl border border-border bg-white p-4 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              <div className="mb-3 grid size-10 place-items-center rounded-xl bg-slate-50">
                <ProductCategoryIcon
                  category={c as ProductCategory}
                  size={28}
                />
              </div>
              {CATEGORY_LABEL[c]}
              <div className="mt-1 text-xs font-normal text-slate-500">
                Xem sản phẩm
              </div>
            </Link>
          ))}
          <Link
            href="/products"
            className="hidden rounded-2xl border border-border bg-white p-4 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 lg:block"
          >
            Khác
            <div className="mt-1 text-xs font-normal text-slate-500">
              Tất cả danh mục
            </div>
          </Link>
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Sản phẩm nổi bật
          </h2>
          <Button href="/products" variant="outline" size="sm">
            Xem tất cả
          </Button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="container-page pb-14">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Hướng dẫn mua nhanh 3 bước
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">
              1) Chọn sản phẩm
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Tìm nhanh theo danh mục hoặc tìm kiếm.
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">
              2) Thanh toán
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Chuyển khoản/VietQR/MoMo/VNPay (mock).
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">
              3) Nhận key tự động
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Key/tài khoản hiển thị trong đơn hàng & gửi email.
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
