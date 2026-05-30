import type { ComponentType } from "react";
import { Google, Microsoft, YouTube } from "developer-icons";
import type { ProductCategory } from "@/lib/types";

type ProductIconComponent = ComponentType<{
  size?: number;
  className?: string;
}>;

export const PRODUCT_CATEGORY_ICONS: Record<
  ProductCategory,
  ProductIconComponent | ProductIconComponent[]
> = {
  windows:      Microsoft,
  office:       Microsoft,
  youtube:      YouTube,
  "google-one": Google,
  combo:        [YouTube, Google],
  subscription: YouTube,
  security:     Microsoft,
};

export function ProductCategoryIcon({
  category,
  size = 48,
  className,
}: {
  category: ProductCategory;
  size?: number;
  className?: string;
}) {
  const icons = PRODUCT_CATEGORY_ICONS[category];
  const list = Array.isArray(icons) ? icons : [icons];

  if (list.length === 1) {
    const Icon = list[0];
    return <Icon size={size} className={className} aria-hidden />;
  }

  const comboSize = Math.round(size * 0.72);
  return (
    <div className={className} aria-hidden>
      <div className="flex items-center justify-center gap-1">
        {list.map((Icon, i) => (
          <Icon key={i} size={comboSize} />
        ))}
      </div>
    </div>
  );
}
