"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { activities as rawActivities } from "@/lib/mock-data";

export type NotifEntry = {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  unread: boolean;
};

const EXTRA: NotifEntry[] = [
  { id: "a-8",  type: "payment",  title: "Thanh toán thành công", description: "ORD-M4N6O8 thanh toán qua MoMo - 238.000đ",          createdAt: "2024-05-27T08:30:00Z", unread: true  },
  { id: "a-9",  type: "order",    title: "Đơn hàng bị hủy",       description: "ORD-Y1Z3A5 bị hủy bởi Vũ Thị Mai",                   createdAt: "2024-05-26T20:00:00Z", unread: false },
  { id: "a-10", type: "key",      title: "Key bị khóa",            description: "Key NEXK-WIN11-B1C3-D5E7 bị khóa do vi phạm",       createdAt: "2024-05-26T18:00:00Z", unread: false },
  { id: "a-11", type: "product",  title: "Sản phẩm hết hàng",     description: "ESET Internet Security đã hết hàng trong kho",        createdAt: "2024-05-26T16:00:00Z", unread: false },
  { id: "a-12", type: "customer", title: "Khách hàng bị khóa",    description: "Tài khoản Vũ Thị Mai bị khóa do vi phạm điều khoản", createdAt: "2024-05-25T14:00:00Z", unread: false },
  { id: "a-13", type: "admin",    title: "Cập nhật cài đặt",       description: "Admin đã thay đổi cấu hình SMTP email",               createdAt: "2024-05-25T11:00:00Z", unread: false },
  { id: "a-14", type: "payment",  title: "Hoàn tiền thành công",   description: "Hoàn tiền 350.000đ cho đơn ORD-E4F6G8",             createdAt: "2024-05-24T16:00:00Z", unread: false },
  { id: "a-15", type: "order",    title: "Đơn hàng mới",           description: "Bùi Văn Khánh đặt Office 2021 Professional",         createdAt: "2024-05-24T13:00:00Z", unread: false },
  { id: "a-16", type: "key",      title: "Key đã giao",            description: "Key Office 2021 Pro đã được giao cho Bùi Văn Khánh", createdAt: "2024-05-24T13:05:00Z", unread: false },
  { id: "a-17", type: "product",  title: "Nhập kho",               description: "Nhập 50 key Windows 11 Pro vào Kho chính",           createdAt: "2024-05-23T10:00:00Z", unread: false },
];

const INIT: NotifEntry[] = [
  ...rawActivities.map(a => ({ ...a, unread: ["a-1","a-2","a-3","a-4"].includes(a.id) })),
  ...EXTRA,
].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

type CtxType = {
  notifications: NotifEntry[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const Ctx = createContext<CtxType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotifEntry[]>(INIT);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  return (
    <Ctx.Provider value={{ notifications, unreadCount: notifications.filter(n => n.unread).length, markRead, markAllRead }}>
      {children}
    </Ctx.Provider>
  );
}

const FALLBACK: CtxType = {
  notifications: [],
  unreadCount: 0,
  markRead: () => {},
  markAllRead: () => {},
};

export function useNotifications(): CtxType {
  return useContext(Ctx) ?? FALLBACK;
}
