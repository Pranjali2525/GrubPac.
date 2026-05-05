"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button, Input, Alert, Card } from "@/components/ui";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}!`);
      router.push(user.role === "teacher" ? "/teacher/dashboard" : "/principal/dashboard");
    } catch (err) {
      setServerError(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">📡</div>
          <h1 className="text-3xl font-extrabold text-gray-900">EduBroadcast</h1>
          <p className="text-gray-500 mt-1">Content Broadcasting System</p>
        </div>

        <Card className="p-8 shadow-xl border-0">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Alert type="error" message={serverError} />

            <Input label="Email address" type="email" placeholder="you@school.com" error={errors.email?.message} required {...register("email")} />
            <Input label="Password" type="password" placeholder="Enter your password" error={errors.password?.message} required {...register("password")} />

            <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <p className="font-semibold text-indigo-600 mb-1">👩‍🏫 Teacher</p>
                <p>teacher@school.com</p>
                <p className="text-gray-400">teacher123</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <p className="font-semibold text-purple-600 mb-1">🏫 Principal</p>
                <p>principal@school.com</p>
                <p className="text-gray-400">principal123</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
