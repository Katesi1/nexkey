"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SupportPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [issueType, setIssueType] = useState("Key không active");
  const [content, setContent] = useState("");

  return (
    <main className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Hỗ trợ / Bảo hành
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Gửi yêu cầu để NexKey hỗ trợ nhanh. (Mock form — chưa gửi server)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="space-y-4">
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">
              Form gửi yêu cầu
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <div className="text-xs font-semibold text-slate-600">
                  Mã đơn hàng
                </div>
                <input
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                  placeholder="NK-XXXX-XXXXX"
                />
              </label>
              <label className="block">
                <div className="text-xs font-semibold text-slate-600">Email</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                  placeholder="email@example.com"
                />
              </label>
              <label className="block sm:col-span-2">
                <div className="text-xs font-semibold text-slate-600">
                  Loại vấn đề
                </div>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                >
                  <option>Key không active</option>
                  <option>Cài đặt lỗi</option>
                  <option>Chưa nhận được key</option>
                  <option>Yêu cầu hoàn tiền</option>
                  <option>Khác</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <div className="text-xs font-semibold text-slate-600">Nội dung</div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 min-h-28 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-ring"
                  placeholder="Mô tả lỗi, ảnh chụp màn hình, mã lỗi..."
                />
              </label>
              <label className="block sm:col-span-2">
                <div className="text-xs font-semibold text-slate-600">
                  Upload ảnh lỗi (placeholder)
                </div>
                <input
                  type="file"
                  multiple
                  className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => {
                  setOrderId("");
                  setEmail("");
                  setIssueType("Key không active");
                  setContent("");
                }}
                variant="secondary"
              >
                Gửi yêu cầu (mock)
              </Button>
              <Button href="/orders" variant="outline">
                Xem đơn hàng
              </Button>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Mẹo: hãy cung cấp mã đơn hàng + ảnh lỗi để xử lý nhanh.
            </div>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-900">FAQ</div>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl border border-border p-4">
                <div className="font-semibold text-slate-900">
                  Key không active được thì sao?
                </div>
                <div className="mt-1 text-slate-600">
                  Gửi yêu cầu hỗ trợ với mã đơn hàng. NexKey sẽ hướng dẫn hoặc đổi
                  key theo chính sách.
                </div>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <div className="font-semibold text-slate-900">
                  Bao lâu nhận được key?
                </div>
                <div className="mt-1 text-slate-600">
                  Tự động sau thanh toán và hiển thị trong trang đơn hàng.
                </div>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <div className="font-semibold text-slate-900">
                  Có hoàn tiền không?
                </div>
                <div className="mt-1 text-slate-600">
                  Tuỳ trường hợp. Liên hệ hỗ trợ để được hướng dẫn.
                </div>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <div className="font-semibold text-slate-900">
                  Key dùng được mấy máy?
                </div>
                <div className="mt-1 text-slate-600">
                  Tuỳ loại key/gói. Xem mô tả sản phẩm hoặc hỏi hỗ trợ.
                </div>
              </div>
            </div>

            <div className="mt-5 text-xs text-slate-500">
              Bạn cũng có thể xem{" "}
              <Link className="font-semibold hover:underline" href="/guides">
                hướng dẫn kích hoạt
              </Link>{" "}
              trước khi gửi yêu cầu.
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}

