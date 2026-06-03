/** Giá bán key Windows (VND) */
export const WINDOWS_KEY_SALE_PRICE = 299_000;

/** Giá gốc tham chiếu (giá Microsoft / thị trường) */
export const WINDOWS_KEY_ORIGINAL_PRICE = 599_000;

export function formatVnd(amount: number): string {
  return `${amount.toLocaleString("vi-VN")}₫`;
}

export function discountPercent(original: number, sale: number): number {
  if (original <= 0) return 0;
  return Math.round((1 - sale / original) * 100);
}
