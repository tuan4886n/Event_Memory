"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// ============================================================
// AUTH SERVICE - Replace with your Backend API calls
// ============================================================
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: "owner";
    name: string;
  };
  token?: string;
  error?: string;
}

// Mock API call - Replace with actual API from Python Backend
async function registerUser(data: RegisterData): Promise<RegisterResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock validation - Replace with actual API call to your Microservice Auth
  // Example: const response = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })
  if (data.email.includes("@")) {
    return {
      success: true,
      user: { id: "new-user-id", email: data.email, role: "owner", name: data.name },
      token: "mock-jwt-token-new-user",
    };
  }

  return {
    success: false,
    error: "Email khong hop le",
  };
}
// ============================================================

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
      setError("Vui long dong y voi dieu khoan su dung");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mat khau phai co it nhat 6 ky tu");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser(formData);

      if (response.success && response.user) {
        // Store token - Replace with your auth state management
        localStorage.setItem("auth_token", response.token || "");
        localStorage.setItem("user", JSON.stringify(response.user));

        // Redirect to dashboard for new event owners
        router.push("/dashboard");
      } else {
        setError(response.error || "Dang ky that bai");
      }
    } catch {
      setError("Co loi xay ra. Vui long thu lai.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Inspirational Message */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20">
          <Sparkles className="h-4 w-4 text-teal-400" />
          <span className="text-sm text-teal-300 font-medium">
            Bat dau hanh trinh luu giu ky niem cua ban
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="register-name" className="text-white/80 text-sm font-medium">
          Ho va ten
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="register-name"
            type="text"
            placeholder="Nguyen Van A"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20 transition-all"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email" className="text-white/80 text-sm font-medium">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="register-email"
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
        <Label htmlFor="register-password" className="text-white/80 text-sm font-medium">
          Mat khau
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="register-password"
            type="password"
            placeholder="It nhat 6 ky tu"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20 transition-all"
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          disabled={isLoading}
          className="mt-0.5 border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
        />
        <Label htmlFor="terms" className="text-sm text-slate-300/80 leading-relaxed cursor-pointer">
          Toi dong y voi{" "}
          <span className="text-teal-400 hover:underline cursor-pointer">Dieu khoan su dung</span>
          {" "}va{" "}
          <span className="text-teal-400 hover:underline cursor-pointer">Chinh sach bao mat</span>
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white shadow-lg shadow-teal-500/30"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Dang tao tai khoan...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Tao tai khoan
          </>
        )}
      </Button>
    </form>
  );
}
