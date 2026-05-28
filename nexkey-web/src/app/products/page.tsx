import { Suspense } from "react";
import { ProductsClient } from "@/app/products/ProductsClient";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <main className="container-page py-8">
      <div className="mb-6 rounded-3xl border border-border bg-gradient-to-br from-slate-50 to-white p-6">
        <div className="text-xs font-semibold text-slate-500">Banner</div>
        <div className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
          Tất cả sản phẩm
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Windows key, Office key, YouTube Premium, Google One và combo
          subscription.
        </div>
      </div>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-border bg-white p-6 text-sm text-slate-600">
            Đang tải danh sách sản phẩm…
          </div>
        }
      >
        <ProductsClient initialCategory={resolvedSearchParams?.category} />
      </Suspense>
    </main>
  );
}

