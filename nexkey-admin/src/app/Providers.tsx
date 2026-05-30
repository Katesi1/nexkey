"use client";

import { NotificationProvider } from "@/store/NotificationContext";
import { AuthProvider } from "@/store/AuthContext";
import { SidebarProvider } from "@/store/SidebarContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
