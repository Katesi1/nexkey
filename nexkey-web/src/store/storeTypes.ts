import type { CartLine, Order, User } from "@/lib/types";

export type StoreState = {
  user:      User | null;
  cart:      CartLine[];
  orders:    Order[];       // cached orders (fetched from API)
  orderIds:  string[];      // list of order IDs placed by this device
  couponCode: string;
};

export type StoreActions = {
  // Auth (simple guest — no real password auth for customers)
  loginMock: (email: string, password: string) => void;
  loginWithGoogleMock: () => void;
  setUser: (user: User) => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;

  // Cart
  addToCart: (productId: string, quantity?: number) => void;
  setCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setCouponCode: (code: string) => void;

  // Orders
  placeOrder: (input: {
    customer: { fullName: string; email: string; phone: string };
    paymentMethod: Order["paymentMethod"];
    note?: string;
  }) => Promise<Order>;
  addOrder: (order: Order) => void;

  // Deprecated mock (kept for backward compat)
  createOrder: (input: {
    customer: { fullName: string; email: string; phone: string };
    paymentMethod: Order["paymentMethod"];
  }) => Order;
  markOrderPaidAndDeliveredMock: (orderId: string) => void;
};

export type StoreApi = StoreState &
  StoreActions & {
    cartCount:    number;
    cartSubtotal: number;
    cartDiscount: number;
    cartTotal:    number;
  };
