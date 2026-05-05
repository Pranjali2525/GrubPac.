"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    router.replace(user.role === "teacher" ? "/teacher/dashboard" : "/principal/dashboard");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Spinner size="lg" />
    </div>
  );
}
