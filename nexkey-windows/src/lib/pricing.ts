/** Giá bán key Windows (VND) */
export const WINDOWS_KEY_SALE_PRICE = 766_000;

/** Giá gốc tham chiếu (giá Microsoft / thị trường) */
export const WINDOWS_KEY_ORIGINAL_PRICE = 1_290_000;

/** Giá bán key Office theo năm (VND/năm) */
export const OFFICE_KEY_SALE_PRICE = 499_000;

/** Giá gốc tham chiếu Office theo năm (giá Microsoft / thị trường) */
export const OFFICE_KEY_ORIGINAL_PRICE = 999_000;

export function formatVnd(amount: number): string {
  return `${amount.toLocaleString("vi-VN")}₫`;
}

export function discountPercent(original: number, sale: number): number {
  if (original <= 0) return 0;
  return Math.round((1 - sale / original) * 100);
}
