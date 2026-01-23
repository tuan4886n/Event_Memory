"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ============================================================
// AUTH SERVICE - Replace with your Backend API calls
// ============================================================
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: "admin" | "owner";
    name: string;
  };
  token?: string;
  error?: string;
}

// Mock API call - Replace with actual API from Python Backend
async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock validation - Replace with actual API call to your Microservice Auth
  // Example: const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
  if (credentials.email === "admin@event.com" && credentials.password === "admin123") {
    return {
      success: true,
      user: { id: "1", email: credentials.email, role: "admin", name: "Admin" },
      token: "mock-jwt-token-admin",
    };
  }

  if (credentials.email === "owner@event.com" && credentials.password === "owner123") {
    return {
      success: true,
      user: { id: "2", email: credentials.email, role: "owner", name: "Event Owner" },
      token: "mock-jwt-token-owner",
    };
  }

  return {
    success: false,
    error: "Email hoac mat khau khong chinh xac",
  };
}
// ============================================================

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginUser(formData);

      if (response.success && response.user) {
        // Store token - Replace with your auth state management
        localStorage.setItem("auth_token", response.token || "");
        localStorage.setItem("user", JSON.stringify(response.user));

        // Redirect based on role
        if (response.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(response.error || "Dang nhap that bai");
      }
    } catch {
      setError("Co loi xay ra. Vui long thu lai.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-white/80 text-sm font-medium">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="login-email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20 transition-all"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-white/80 text-sm font-medium">
          Mat khau
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20 transition-all"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          Quen mat khau?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white shadow-lg shadow-teal-500/30"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Dang xu ly...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-5 w-5" />
            Dang nhap
          </>
        )}
      </Button>

      <div className="pt-4 text-center text-xs text-slate-400/70">
        <p>Demo: admin@event.com / admin123</p>
        <p>hoac: owner@event.com / owner123</p>
      </div>
    </form>
  );
}
