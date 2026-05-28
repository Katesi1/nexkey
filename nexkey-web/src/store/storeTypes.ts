import type { CartLine, Order, User } from "@/lib/types";

export type StoreState = {
  user: User | null;
  cart: CartLine[];
  orders: Order[];
  couponCode: string;
};

export type StoreActions = {
  loginMock: (email: string, password: string) => void;
  loginWithGoogleMock: () => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;

  addToCart: (productId: string, quantity?: number) => void;
  setCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setCouponCode: (code: string) => void;

  createOrder: (input: {
    customer: { fullName: string; email: string; phone: string };
    paymentMethod: Order["paymentMethod"];
  }) => Order;
  markOrderPaidAndDeliveredMock: (orderId: string) => void;
};

export type StoreApi = StoreState &
  StoreActions & {
    cartCount: number;
    cartSubtotal: number;
    cartDiscount: number;
    cartTotal: number;
  };

