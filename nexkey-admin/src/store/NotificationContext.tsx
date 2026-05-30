"use client";

import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from "react";
import { logsApi, getToken } from "@/lib/api";

export type NotifEntry = {
  id: string;
  type: number;
  title: string;
  description: string;
  createdAt: string;
  unread: boolean;
};

type CtxType = {
  notifications: NotifEntry[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const Ctx = createContext<CtxType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotifEntry[]>([]);

  useEffect(() => {
    if (!getToken()) return;
    logsApi
      .list({ limit: 20, isRead: false })
      .then(({ data }) => {
        setNotifications(
          data.map(a => ({
            id: a.id,
            type: a.type,
            title: a.title,
            description: a.description,
            createdAt: a.createdAt,
            unread: !a.isRead,
          })),
        );
      })
      .catch(() => {});
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    logsApi.markRead(id).catch(() => {});
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    logsApi.markAllRead().catch(() => {});
  }, []);

  return (
    <Ctx.Provider value={{
      notifications,
      unreadCount: notifications.filter(n => n.unread).length,
      markRead,
      markAllRead,
    }}>
      {children}
    </Ctx.Provider>
  );
}

const FALLBACK: CtxType = {
  notifications: [], unreadCount: 0, markRead: () => {}, markAllRead: () => {},
};

export function useNotifications(): CtxType {
  return useContext(Ctx) ?? FALLBACK;
}
