"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { FaktixLogo } from "@/components/FaktixLogo";
import { CloudBackground } from "@/components/CloudBackground";
import { useAuth } from "@/hooks/useAuth";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

function LoginPageContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Перевіряємо, чи є повідомлення про підтвердження email
  useEffect(() => {
    const message = searchParams?.get('message');
    if (message === 'verify-email') {
      setSuccessMessage('Реєстрація майже завершена! Перевірте вашу поштову скриньку та підтвердіть email для завершення реєстрації.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Валідація email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError("Prosím zadejte platný e-mail");
      return;
    }
    
    // Валідація пароля
    if (!formData.password || formData.password.length < 6) {
      setError("Heslo musí mít alespoň 6 znaků");
      return;
    }

    console.log('🔄 Attempting login for:', formData.email);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      console.log('✅ Login successful');
      try {
        const hasProfile = typeof window !== 'undefined' && !!localStorage.getItem('faktix-profile');
        router.push(hasProfile ? "/dashboard" : "/onboarding");
      } catch {
        router.push("/dashboard");
      }
    } else {
      console.log('❌ Login failed:', result.message);
      setError(result.message || "Přihlášení se nezdařilo");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Очищаємо помилку при зміні полів
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Cloud Background */}
      <CloudBackground />
      
      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-money transition-colors mb-8 backdrop-blur-sm bg-black/30 border border-gray-700/50 px-4 py-2 rounded-lg hover:bg-black/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na hlavní stránku
        </Link>

        <Card className="backdrop-blur-md bg-black/40 border-gray-700/50 shadow-2xl shadow-black/50">
          <CardHeader>
            <div className="text-center">
              {/* Logo */}
              <Link href="/" className="inline-flex mb-6">
                <FaktixLogo size="lg" />
              </Link>
              
              <h1 className="text-2xl font-bold text-white mb-2">
                Přihlášení
              </h1>
              <p className="text-gray-400">
                Zadejte své přihlašovací údaje
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Required Fields Notice */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-blue-400 text-sm">
                  <span className="text-red-500">*</span> Označuje povinná pole
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <p className="text-green-400 text-sm">{successMessage}</p>
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="minimal-input w-full px-3 py-2"
                  placeholder="vas@email.cz"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Heslo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="minimal-input w-full px-3 py-2 pr-10"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border border-gray-600 bg-transparent focus:ring-1 focus:ring-white"
                    disabled={isLoading}
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                    Zapamatovat si mě
                  </label>
                </div>
                <Link
                  href="/zapomenute-heslo"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Zapomněli jste heslo?
                </Link>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Přihlašuji..." : "Přihlásit se"}
              </Button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400">Nebo se přihlaste pomocí</span>
                </div>
              </div>

              <div className="mt-6">
                <GoogleSignInButton />
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Nemáte účet?{" "}
                <Link
                  href="/registrace"
                  className="text-white hover:text-gray-300 transition-colors font-medium"
                >
                  Registrujte se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
} 