"use client";

import * as React from "react";
import type { Order, PaymentMethod } from "@/lib/types";
import { formatVnd } from "@/lib/currency";
import { getProductById } from "@/lib/catalog";
import { loadPersisted, savePersisted } from "@/store/persist";
import type { StoreApi, StoreState } from "@/store/storeTypes";

const StoreContext = React.createContext<StoreApi | null>(null);

const initialState: StoreState = {
  user: null,
  cart: [],
  orders: [],
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
  if (code === "NEXKEY10") return Math.round(subtotal * 0.1);
  if (code === "WELCOME20") return Math.min(50000, Math.round(subtotal * 0.2));
  return 0;
}

function makeOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `NK-${ts}-${rnd}`;
}

function makeDeliveredMock(order: Order): Order["delivered"] {
  return order.items.map((item, idx) => ({
    productId: item.productId,
    label: item.name,
    value: `XXXXX-XXXXX-XXXXX-XXXXX-${String(idx + 1).padStart(2, "0")}`,
    hint: "Key/demo (mock). Khi nối API thật, sẽ hiển thị key/tài khoản thực.",
  }));
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<StoreState>(initialState);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    // Rehydrate from localStorage after mount (server and first client render stay in sync).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time rehydration
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

  const api = React.useMemo<StoreApi>(() => {
    return {
      ...state,
      cartCount,
      cartSubtotal,
      cartDiscount,
      cartTotal,

      loginMock: (email) => {
        setState((s) => ({
          ...s,
          user: {
            id: "u_mock",
            fullName: "Nguyễn Văn A",
            email,
            phone: "0900000000",
          },
        }));
      },
      loginWithGoogleMock: () => {
        setState((s) => ({
          ...s,
          user: {
            id: "u_google",
            fullName: "Google User",
            email: "google.user@gmail.com",
            phone: "0900000000",
          },
        }));
      },
      logout: () => setState((s) => ({ ...s, user: null })),
      updateProfile: (patch) =>
        setState((s) => ({
          ...s,
          user: s.user ? { ...s.user, ...patch } : s.user,
        })),

      addToCart: (productId, quantity = 1) => {
        const q = clampQty(quantity);
        setState((s) => {
          const existing = s.cart.find((l) => l.productId === productId);
          if (existing) {
            return {
              ...s,
              cart: s.cart.map((l) =>
                l.productId === productId
                  ? { ...l, quantity: clampQty(l.quantity + q) }
                  : l,
              ),
            };
          }
          return { ...s, cart: [...s.cart, { productId, quantity: q }] };
        });
      },
      setCartQty: (productId, quantity) => {
        const q = clampQty(quantity);
        setState((s) => ({
          ...s,
          cart: s.cart.map((l) =>
            l.productId === productId ? { ...l, quantity: q } : l,
          ),
        }));
      },
      removeFromCart: (productId) =>
        setState((s) => ({
          ...s,
          cart: s.cart.filter((l) => l.productId !== productId),
        })),
      clearCart: () => setState((s) => ({ ...s, cart: [] })),
      setCouponCode: (code) => setState((s) => ({ ...s, couponCode: code })),

      createOrder: ({ customer, paymentMethod }) => {
        const subtotal = computeSubtotal(state.cart);
        const discount = computeDiscount(subtotal, state.couponCode);
        const total = Math.max(0, subtotal - discount);
        const items = state.cart
          .map((l) => {
            const p = getProductById(l.productId);
            if (!p) return null;
            return {
              productId: p.id,
              name: p.name,
              unitPrice: p.price,
              quantity: l.quantity,
            };
          })
          .filter(Boolean) as Order["items"];

        const order: Order = {
          id: makeOrderId(),
          createdAt: new Date().toISOString(),
          customer,
          paymentMethod: paymentMethod as PaymentMethod,
          status: "Chờ thanh toán",
          items,
          subtotal,
          discount,
          total,
          delivered: [],
        };

        setState((s) => ({
          ...s,
          orders: [order, ...s.orders],
          cart: [],
          couponCode: "",
        }));

        return order;
      },

      markOrderPaidAndDeliveredMock: (orderId) => {
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) => {
            if (o.id !== orderId) return o;
            const paid: Order = { ...o, status: "Đã thanh toán" };
            const delivered: Order = {
              ...paid,
              status: "Đã giao hàng",
              delivered: makeDeliveredMock(paid),
            };
            return delivered;
          }),
        }));
      },
    };
  }, [state, cartCount, cartSubtotal, cartDiscount, cartTotal]);

  return (
    <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
  );
}

export function useStoreContext() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) {
    throw new Error("StoreContext not found. Wrap with <StoreProvider />.");
  }
  return ctx;
}

export function debugPriceLine(subtotal: number, discount: number) {
  return `${formatVnd(subtotal)} - ${formatVnd(discount)}`;
}

