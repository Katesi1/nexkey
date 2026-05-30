import { Suspense } from "react";
import { ProductsClient } from "@/app/products/ProductsClient";
import { fetchPublicProducts, fetchPublicCategories } from "@/lib/api";
import { mapApiProduct, mapApiCategory } from "@/lib/mappers";
import type { Product } from "@/lib/types";
import type { WebCategory } from "@/lib/mappers";

async function getProductsAndCategories() {
  try {
    const [apiProducts, apiCategories] = await Promise.all([
      fetchPublicProducts(),
      fetchPublicCategories(),
    ]);
    const products: Product[] = apiProducts.map(p => mapApiProduct(p, apiProducts));
    const categories: WebCategory[] = apiCategories.map(mapApiCategory);
    return { products, categories };
  } catch {
    return { products: [], categories: [] };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { products, categories } = await getProductsAndCategories();

  return (
    <main className="container-page py-8">
      <div className="mb-6 rounded-3xl border border-border bg-gradient-to-br from-slate-50 to-white p-6">
        <div className="text-xs font-semibold text-slate-500">Danh mục sản phẩm</div>
        <div className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
          Tất cả sản phẩm
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Windows key, Office key, YouTube Premium, Google One và nhiều hơn nữa.
        </div>
      </div>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-border bg-white p-6 text-sm text-slate-600">
            Đang tải danh sách sản phẩm…
          </div>
        }
      >
        <ProductsClient
          products={products}
          categories={categories}
          initialCategory={resolvedSearchParams?.category}
        />
      </Suspense>
    </main>
  );
}
