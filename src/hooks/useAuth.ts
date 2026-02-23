"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/types";
import { setAuthToken } from "@/lib/api";

interface UseAuthReturn {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Verifier le profil au montage
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        setAuthToken(data.token);
      } else {
        setUser(null);
        setToken(null);
        setAuthToken(null);
      }
    } catch {
      setUser(null);
      setToken(null);
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  }

  const login = useCallback(
    async (email: string, password: string, redirectTo = "/admin") => {
      setError(null);
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Identifiants invalides");
        }

        const data = await res.json();
        setUser(data.user);
        // Recuperer le token via /me apres le login
        await checkAuth();
        router.push(redirectTo);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de connexion");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setToken(null);
    setAuthToken(null);
    router.push("/admin/login");
  }, [router]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
  };
}
