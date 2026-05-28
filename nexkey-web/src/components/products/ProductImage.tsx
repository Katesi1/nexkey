import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/lib/types";
import { ProductCategoryIcon } from "@/lib/productIcons";

export function ProductImage({
  name,
  category,
  className,
}: {
  name: string;
  category: ProductCategory;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-slate-50 to-slate-100",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.18),transparent_55%)]" />
      <div className="relative flex h-full min-h-40 flex-col justify-between p-5">
        <div className="flex flex-1 items-center justify-center">
          <div className="grid size-20 place-items-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm sm:size-24">
            <ProductCategoryIcon category={category} size={56} />
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500">NexKey</div>
          <div className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">
            {name}
          </div>
        </div>
      </div>
    </div>
  );
}
