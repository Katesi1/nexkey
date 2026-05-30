"use client";

import * as React from "react";
import type { Order, PaymentMethod } from "@/lib/types";
import { formatVnd } from "@/lib/currency";
import { getProductById } from "@/lib/catalog";
import { loadPersisted, savePersisted } from "@/store/persist";
import type { StoreApi, StoreState } from "@/store/storeTypes";
import { shopCheckout, fetchShopOrder } from "@/lib/api";
import type { ApiOrder } from "@/lib/api";

const StoreContext = React.createContext<StoreApi | null>(null);

const initialState: StoreState = {
  user:      null,
  cart:      [],
  orders:    [],
  orderIds:  [],
  couponCode: "",
};

function clampQty(qty: number) {
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.min(99, Math.floor(qty)));
}

function computeSubtotal(cart: StoreState["cart"]) {
  return cart.reduce((sum, line) => {
    const p = getProductById(line.productId);
    if (!p) return sum;
    return sum + p.price * line.quantity;
  }, 0);
}

function computeDiscount(subtotal: number, couponCode: string) {
  const code = couponCode.trim().toUpperCase();
  if (!code) return 0;
  if (code === "NEXKEY10")  return Math.round(subtotal * 0.1);
  if (code === "WELCOME20") return Math.min(50000, Math.round(subtotal * 0.2));
  return 0;
}

// Payment method mapping: web string → API number
const PAYMENT_TO_API: Record<string, number> = {
  vnpay:  1,
  momo:   2,
  bank:   3,
  vietqr: 3,
  card:   4,
};

// Payment method mapping: API number → web string
const PAYMENT_FROM_API: Record<number, PaymentMethod> = {
  1: "vnpay",
  2: "momo",
  3: "bank",
  4: "bank",
};

// Order status: API number → web string
const STATUS_FROM_API: Record<number, Order["status"]> = {
  1: "Chờ thanh toán",   // DangXuLy → treating as pending
  2: "Đã giao hàng",     // HoanThanh
  3: "Đã hủy",           // DaHuy
  4: "Đã thanh toán",    // HoanTien
  5: "Chờ thanh toán",   // ChoThanhToan
};

function mapApiOrder(api: ApiOrder, subtotal: number, discount: number): Order {
  return {
    id:        api.id,
    createdAt: api.createdAt,
    customer: {
      fullName: api.customerName,
      email:    api.customerEmail,
      phone:    api.customerPhone,
    },
    paymentMethod: PAYMENT_FROM_API[api.paymentMethod] ?? "bank",
    status:        STATUS_FROM_API[api.status] ?? "Chờ thanh toán",
    items:         (api.items ?? []).map(i => ({
      productId: i.productId,
      name:      i.name,
      unitPrice: i.price,
      quantity:  i.quantity,
    })),
    subtotal,
    discount,
    total:    api.total,
    delivered: (api.items ?? [])
      .filter(i => i.licenseKey)
      .map(i => ({
        productId: i.productId,
        label:     i.name,
        value:     i.licenseKey!,
      })),
  };
}

// Mock helpers (kept for backward compat)
function makeOrderId() {
  const ts  = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `NK-${ts}-${rnd}`;
}

function makeDeliveredMock(order: Order): Order["delivered"] {
  return order.items.map((item, idx) => ({
    productId: item.productId,
    label:     item.name,
    value:     `XXXXX-XXXXX-XXXXX-XXXXX-${String(idx + 1).padStart(2, "0")}`,
    hint:      "Key demo (mock). API thật sẽ giao key thực.",
  }));
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState]     = React.useState<StoreState>(initialState);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setState(loadPersisted(initialState));
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    savePersisted(state);
  }, [state, hydrated]);

  const cartSubtotal = React.useMemo(() => computeSubtotal(state.cart), [state]);
  const cartDiscount = React.useMemo(
    () => computeDiscount(cartSubtotal, state.couponCode),
    [cartSubtotal, state.couponCode],
  );
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);
  const cartCount = state.cart.reduce((sum, line) => sum + line.quantity, 0);

  const api = React.useMemo<StoreApi>(() => ({
    ...state,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartTotal,

    // ── Auth ──────────────────────────────────────────────────────────────
    setUser: (user) => setState(s => ({ ...s, user })),

    loginMock: (email) => {
      setState(s => ({
        ...s,
        user: { id: `guest_${Date.now()}`, fullName: "Khách hàng", email, phone: "" },
      }));
    },

    loginWithGoogleMock: () => {
      setState(s => ({
        ...s,
        user: { id: "u_google", fullName: "Google User", email: "google@gmail.com", phone: "" },
      }));
    },

    logout: () => setState(s => ({ ...s, user: null })),

    updateProfile: (patch) =>
      setState(s => ({ ...s, user: s.user ? { ...s.user, ...patch } : s.user })),

    // ── Cart ──────────────────────────────────────────────────────────────
    addToCart: (productId, quantity = 1) => {
      const q = clampQty(quantity);
      setState(s => {
        const existing = s.cart.find(l => l.productId === productId);
        if (existing) {
          return {
            ...s,
            cart: s.cart.map(l =>
              l.productId === productId ? { ...l, quantity: clampQty(l.quantity + q) } : l,
            ),
          };
        }
        return { ...s, cart: [...s.cart, { productId, quantity: q }] };
      });
    },

    setCartQty: (productId, quantity) => {
      const q = clampQty(quantity);
      setState(s => ({
        ...s,
        cart: s.cart.map(l => l.productId === productId ? { ...l, quantity: q } : l),
      }));
    },

    removeFromCart: (productId) =>
      setState(s => ({ ...s, cart: s.cart.filter(l => l.productId !== productId) })),

    clearCart: () => setState(s => ({ ...s, cart: [] })),

    setCouponCode: (code) => setState(s => ({ ...s, couponCode: code })),

    // ── Orders — Real API ─────────────────────────────────────────────────
    placeOrder: async ({ customer, paymentMethod, note }) => {
      const subtotal = computeSubtotal(state.cart);
      const discount = computeDiscount(subtotal, state.couponCode);

      const items = state.cart
        .map(l => {
          const p = getProductById(l.productId);
          return p ? { productId: p.id, quantity: l.quantity } : null;
        })
        .filter(Boolean) as { productId: string; quantity: number }[];

      const apiOrder = await shopCheckout({
        fullName:      customer.fullName,
        email:         customer.email,
        phone:         customer.phone,
        paymentMethod: PAYMENT_TO_API[paymentMethod] ?? 3,
        note,
        discount,
        items,
      });

      const order = mapApiOrder(apiOrder, subtotal, discount);

      setState(s => ({
        ...s,
        orders:   [order, ...s.orders],
        orderIds: [order.id, ...s.orderIds.filter(id => id !== order.id)],
        cart:     [],
        couponCode: "",
      }));

      return order;
    },

    addOrder: (order) =>
      setState(s => ({
        ...s,
        orders:   [order, ...s.orders.filter(o => o.id !== order.id)],
        orderIds: [order.id, ...s.orderIds.filter(id => id !== order.id)],
      })),

    // ── Backward compat mock (kept for code that still calls these) ────────
    createOrder: ({ customer, paymentMethod }) => {
      const subtotal = computeSubtotal(state.cart);
      const discount = computeDiscount(subtotal, state.couponCode);
      const total    = Math.max(0, subtotal - discount);
      const items    = state.cart
        .map(l => {
          const p = getProductById(l.productId);
          if (!p) return null;
          return { productId: p.id, name: p.name, unitPrice: p.price, quantity: l.quantity };
        })
        .filter(Boolean) as Order["items"];

      const order: Order = {
        id: makeOrderId(), createdAt: new Date().toISOString(),
        customer, paymentMethod: paymentMethod as PaymentMethod,
        status: "Chờ thanh toán", items, subtotal, discount, total, delivered: [],
      };

      setState(s => ({
        ...s,
        orders:   [order, ...s.orders],
        orderIds: [order.id, ...s.orderIds],
        cart:     [],
        couponCode: "",
      }));
      return order;
    },

    markOrderPaidAndDeliveredMock: (orderId) => {
      setState(s => ({
        ...s,
        orders: s.orders.map(o => {
          if (o.id !== orderId) return o;
          return { ...o, status: "Đã giao hàng", delivered: makeDeliveredMock(o) };
        }),
      }));
    },
  }), [state, cartCount, cartSubtotal, cartDiscount, cartTotal]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStoreContext() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("StoreContext not found. Wrap with <StoreProvider />.");
  return ctx;
}

export function debugPriceLine(subtotal: number, discount: number) {
  return `${formatVnd(subtotal)} - ${formatVnd(discount)}`;
}
