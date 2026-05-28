"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// ── mock data ──────────────────────────────────────────────────────
const REVIEWS = [
  {
    name: "Minh Quang",
    stars: 5,
    date: "20/05/2025",
    content:
      "Mình nhận key rất nhanh, thanh toán xong vài phút là dùng được luôn. Hỗ trợ cũng phản hồi nhiệt tình.",
    verified: true,
  },
  {
    name: "Thanh Trúc",
    stars: 5,
    date: "17/05/2025",
    content:
      "Đã mua nhiều lần ở đây, tài khoản ổn định, chính sách rõ ràng. Rất yên tâm khi mua hàng.",
    verified: true,
  },
  {
    name: "Hữu Phúc",
    stars: 5,
    date: "14/05/2025",
    content:
      "Điểm mình thích nhất là giao tự động và có hướng dẫn kích hoạt chi tiết cho người mới.",
    verified: true,
  },
  {
    name: "Lan Anh",
    stars: 4,
    date: "10/05/2025",
    content:
      "Sản phẩm tốt, giá hợp lý. Lần đầu mua hơi lo nhưng mọi thứ diễn ra rất suôn sẻ.",
    verified: false,
  },
  {
    name: "Quốc Bảo",
    stars: 5,
    date: "05/05/2025",
    content:
      "Key kích hoạt ngay sau thanh toán. Hỗ trợ giải quyết vấn đề trong 5 phút, rất ấn tượng.",
    verified: true,
  },
  {
    name: "Thu Hương",
    stars: 5,
    date: "28/04/2025",
    content:
      "Đã giới thiệu cho cả nhóm bạn dùng. Mọi người đều hài lòng với dịch vụ và sản phẩm.",
    verified: false,
  },
] as const;

// phân bổ sao (mock)
const DIST = [
  { star: 5, pct: 78 },
  { star: 4, pct: 14 },
  { star: 3, pct: 5 },
  { star: 2, pct: 2 },
  { star: 1, pct: 1 },
];

// ── avatar helpers ─────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function initials(name: string): string {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

// ── star display ───────────────────────────────────────────────────
function Stars({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "text-xl" : "text-sm";
  return (
    <span className={cls} aria-label={`${value} trên 5 sao`}>
      <span className="text-amber-400">{"★".repeat(value)}</span>
      <span className="text-slate-200">{"★".repeat(5 - value)}</span>
    </span>
  );
}

// ── interactive star picker ────────────────────────────────────────
const STAR_LABELS = ["", "Tệ", "Không hay", "Bình thường", "Tốt", "Xuất sắc"];

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            aria-label={`${s} sao`}
            className={`text-3xl leading-none transition-all hover:scale-110 ${
              s <= active ? "text-amber-400" : "text-slate-200 hover:text-amber-300"
            }`}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(s)}
          >
            ★
          </button>
        ))}
      </div>
      <span
        className={`text-sm font-medium transition-opacity ${
          active > 0 ? "text-amber-500 opacity-100" : "opacity-0"
        }`}
      >
        {STAR_LABELS[active]}
      </span>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────
interface ProductReviewsProps {
  rating: number;
  reviewCount: number;
}

export function ProductReviews({ rating, reviewCount }: ProductReviewsProps) {
  const { user } = useStore();
  const router = useRouter();

  const [newStars, setNewStars] = useState(0);
  const [newContent, setNewContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    // mock submit
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setNewContent("");
      setNewStars(0);
    }, 4000);
  }

  return (
    <section className="mt-10">
      {/* ── header ── */}
      <h2 className="mb-5 text-lg font-bold tracking-tight text-slate-900">
        Nhận xét &amp; đánh giá
      </h2>

      {/* ── rating overview ── */}
      <Card className="mb-6 overflow-hidden p-0">
        <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center">
          {/* big number */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 px-8 py-5 sm:min-w-[148px]">
            <span className="text-5xl font-black text-slate-900 tabular-nums">
              {rating.toFixed(1)}
            </span>
            <Stars value={Math.round(rating)} size="lg" />
            <span className="mt-1.5 text-xs text-slate-500">
              {reviewCount.toLocaleString("vi-VN")} đánh giá
            </span>
          </div>

          {/* distribution bars */}
          <div className="flex-1 space-y-2">
            {DIST.map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 shrink-0 text-right font-medium text-slate-600">
                  {star}
                </span>
                <span className="shrink-0 text-amber-400">★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-7 shrink-0 text-right text-slate-400">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── review cards ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r) => (
          <div
            key={r.name}
            className="flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${avatarColor(r.name)}`}
                >
                  {initials(r.name)}
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight text-slate-900">
                    {r.name}
                  </div>
                  {r.verified && (
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-emerald-600">
                      <span className="text-[10px]">✓</span>
                      <span>Đã mua hàng</span>
                    </div>
                  )}
                </div>
              </div>
              <span className="shrink-0 text-xs text-slate-400">{r.date}</span>
            </div>

            {/* stars */}
            <div className="mt-3">
              <Stars value={r.stars} />
            </div>

            {/* content */}
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
              &ldquo;{r.content}&rdquo;
            </p>
          </div>
        ))}
      </div>

      {/* ── write review ── */}
      <Card className="mt-6 p-6">
        <h3 className="mb-5 text-base font-bold text-slate-900">
          Viết đánh giá của bạn
        </h3>

        {submitted ? (
          /* success state */
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm text-emerald-600">
              ✓
            </span>
            <div className="text-sm">
              <span className="font-semibold text-emerald-700">Gửi thành công! </span>
              <span className="text-emerald-600">
                Cảm ơn bạn — nhận xét sẽ hiển thị sau khi được duyệt.
              </span>
            </div>
          </div>
        ) : !user ? (
          /* login wall */
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-white text-2xl shadow-sm">
              ✍️
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Bạn cần đăng nhập để viết đánh giá
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Chỉ khách hàng đã đăng nhập mới có thể nhận xét sản phẩm
              </p>
            </div>
            <Button size="sm" onClick={() => router.push("/login")}>
              Đăng nhập ngay
            </Button>
          </div>
        ) : (
          /* review form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Chọn số sao
              </label>
              <StarPicker value={newStars} onChange={setNewStars} />
            </div>

            <div>
              <label
                htmlFor="review-content"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Nhận xét của bạn
              </label>
              <textarea
                id="review-content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này…"
                rows={4}
                className="w-full resize-none rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-ring focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {newContent.length}/500
              </p>
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={newStars === 0 || newContent.trim().length < 10}
            >
              Gửi đánh giá
            </Button>
          </form>
        )}
      </Card>
    </section>
  );
}
