"use client";

import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { auth, getToken, clearToken } from "@/lib/api";
import type { AdminInfo } from "@/lib/types";

type AuthState = {
  user: AdminInfo | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const me = await auth.me();
      setUser(me);
      document.cookie = "nexkey_logged_in=1; path=/; max-age=86400; SameSite=Lax";
    } catch {
      clearToken();
      setUser(null);
      document.cookie = "nexkey_logged_in=; path=/; max-age=0";
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const { admin } = await auth.login(email, password);
    setUser(admin);
    document.cookie = "nexkey_logged_in=1; path=/; max-age=86400; SameSite=Lax";
    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(async () => {
    await auth.logout();
    setUser(null);
    document.cookie = "nexkey_logged_in=; path=/; max-age=0";
    router.push("/login");
  }, [router]);

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
