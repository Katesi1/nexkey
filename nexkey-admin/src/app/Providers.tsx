"use client";

import { NotificationProvider } from "@/store/NotificationContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
