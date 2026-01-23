"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image - Nature/Landscape */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/auth-bg.png"
          alt="Beautiful landscape"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay - Teal/Cyan theme for memories */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-teal-950/60 to-cyan-950/70" />
      </div>

      {/* Decorative Elements - Subtle floating orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-teal-400/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-cyan-300/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-teal-500/10 blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Branding - Album/Memory focused */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg shadow-teal-500/30">
            {/* Custom Logo - Layered photos/album concept */}
            <div className="relative">
              <Layers className="w-6 h-6 text-white absolute -top-0.5 -left-0.5 opacity-50" />
              <Camera className="w-7 h-7 text-white relative z-10" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-white">
            EventMemory
          </h1>
          <p className="text-sm text-teal-100/70">
            Luu giu nhung khoanh khac dang nho
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div className="rounded-3xl p-6 md:p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-black/20">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full h-12 p-1 rounded-xl mb-6 bg-slate-800/50">
              <TabsTrigger
                value="login"
                className="rounded-lg text-sm font-medium transition-all duration-300 data-[state=active]:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-slate-300"
              >
                Dang nhap
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-lg text-sm font-medium transition-all duration-300 data-[state=active]:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-slate-300"
              >
                Dang ky
              </TabsTrigger>
            </TabsList>

            <div className="relative overflow-hidden">
              <TabsContent
                value="login"
                className="mt-0 transition-all duration-500 data-[state=inactive]:absolute data-[state=inactive]:opacity-0 data-[state=inactive]:translate-x-[-20px] data-[state=active]:opacity-100 data-[state=active]:translate-x-0"
              >
                <LoginForm />
              </TabsContent>

              <TabsContent
                value="register"
                className="mt-0 transition-all duration-500 data-[state=inactive]:absolute data-[state=inactive]:opacity-0 data-[state=inactive]:translate-x-[20px] data-[state=active]:opacity-100 data-[state=active]:translate-x-0"
              >
                <RegisterForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6 text-slate-400/60">
          &copy; 2025 EventMemory. All rights reserved.
        </p>
      </div>
    </div>
  );
}
