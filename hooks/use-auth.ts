"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
  });

export function useAuth(requiredRole?: string | string[]) {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<{ user: User }>(
    "/api/auth/me",
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const user = data?.user;

  // Check role authorization
  const isAuthorized = (() => {
    if (!user) return false;
    if (!requiredRole) return true;
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(user.role);
  })();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    mutate(undefined);
    router.push("/login");
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isAuthorized,
    error,
    logout,
    mutate,
  };
}
