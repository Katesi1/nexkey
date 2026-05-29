"use client";

import { NotificationProvider } from "@/store/NotificationContext";
import { AuthProvider } from "@/store/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </AuthProvider>
  );
}
