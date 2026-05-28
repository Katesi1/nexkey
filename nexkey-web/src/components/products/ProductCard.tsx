"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { formatVnd } from "@/lib/currency";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { ProductImage } from "@/components/products/ProductImage";
import { useStore } from "@/store/useStore";

function badgeTone(label: string) {
  if (label === "Bán chạy") return "green";
  if (label === "Ưu đãi") return "amber";
  if (label === "Mới") return "purple";
  return "slate";
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const router = useRouter();

  return (
    <div className="group rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-4">
        <ProductImage
          name={product.name}
          category={product.category}
          className="h-40"
        />

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${product.slug}`}
              className="line-clamp-2 text-sm font-semibold tracking-tight text-slate-900 hover:underline"
            >
              {product.name}
            </Link>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="blue">{product.type}</Badge>
              {(product.badges ?? []).slice(0, 2).map((b) => (
                <Badge key={b} tone={badgeTone(b)}>
                  {b}
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-right">
            <div className="text-base font-bold text-slate-900">
              {formatVnd(product.price)}
            </div>
            {product.compareAtPrice ? (
              <div className="text-xs text-slate-400 line-through">
                {formatVnd(product.compareAtPrice)}
              </div>
            ) : (
              <div className="h-4" />
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stars value={product.rating} />
            <span className="text-xs text-slate-500">({product.reviewCount})</span>
          </div>
          <span
            className={`text-xs font-semibold ${
              product.inStock ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {product.inStock ? "Còn hàng" : "Hết hàng"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button href={`/products/${product.slug}`} variant="outline" size="sm">
            Xem chi tiết
          </Button>
          <Button
            onClick={() => {
              addToCart(product.id, 1);
              router.push("/cart");
            }}
            variant="primary"
            size="sm"
            disabled={!product.inStock}
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </div>
  );
}

