"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      router.replace(user?.role === "teacher" ? "/teacher/dashboard" : "/principal/dashboard");
    }
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) return null;
  return children;
}
