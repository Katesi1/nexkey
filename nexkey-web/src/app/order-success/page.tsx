import { Suspense } from "react";
import { OrderSuccessClient } from "@/app/order-success/OrderSuccessClient";

export default function OrderSuccessPage() {
  return (
    <main className="container-page py-10">
      <Suspense
        fallback={
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-border bg-white p-6 text-sm text-slate-600">
              Đang tải thông tin đơn hàng…
            </div>
          </div>
        }
      >
        <OrderSuccessClient />
      </Suspense>
    </main>
  );
}

