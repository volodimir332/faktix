"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { FaktixLogo } from "@/components/FaktixLogo";
import { CloudBackground } from "@/components/CloudBackground";
import { useAuth } from "@/hooks/useAuth";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Валідація email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError("Prosím zadejte platný e-mail");
      return;
    }
    
    // Валідація пароля (мінімум 6 символів)
    if (!formData.password || formData.password.length < 6) {
      setError("Heslo musí mít alespoň 6 znaků");
      return;
    }

    // Валідація підтвердження пароля
    if (formData.password !== formData.confirmPassword) {
      setError("Hesla se neshodují");
      return;
    }

    // Валідація погодження з умовами
    if (!formData.agreeToTerms) {
      setError("Musíte souhlasit s obchodními podmínkami");
      return;
    }

    console.log('🔄 Attempting registration for:', formData.email);

    const result = await register(formData.email, formData.password);

    if (result.success) {
      console.log('✅ Registration successful');
      
      // Перенаправляємо на onboarding для введення додаткових даних
      router.push("/onboarding");
    } else {
      console.log('❌ Registration failed:', result.message);
      
      // Детальна обробка помилок Firebase
      let errorMessage = result.message || "Registrace se nezdařila";
      
      if (result.error) {
        switch (result.error) {
          case 'auth/email-already-in-use':
            errorMessage = 'Tento email již existuje. Zkuste se přihlásit.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Neplatný formát emailu.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Heslo je příliš slabé. Musí obsahovat alespoň 6 znaků.';
            break;
          default:
            errorMessage = `Chyba: ${result.message}`;
        }
      }
      
      setError(errorMessage);
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
                Registrace
              </h1>
              <p className="text-gray-400">
                Začněte fakturovat během několika minut
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
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
                  autoComplete="email"
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
                    placeholder="Minimálně 6 znaků"
                    disabled={isLoading}
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Potvrzení hesla <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="minimal-input w-full px-3 py-2 pr-10"
                    placeholder="Zopakujte heslo"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border border-gray-600 bg-transparent focus:ring-1 focus:ring-white mt-0.5"
                  disabled={isLoading}
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-300">
                  Souhlasím s{" "}
                  <Link href="/podmínky" className="text-white hover:text-gray-300">
                    obchodními podmínkami
                  </Link>{" "}
                  a{" "}
                  <Link href="/ochrana-dat" className="text-white hover:text-gray-300">
                    zásadami ochrany osobních údajů
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={!formData.agreeToTerms || isLoading}
              >
                {isLoading ? "Registruji..." : "Vytvořit účet ZDARMA"}
              </Button>
            </form>

            {/* Social Registration */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400">Nebo se registrujte pomocí</span>
                </div>
              </div>

              <div className="mt-6">
                <GoogleSignInButton />
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Už máte účet?{" "}
                <Link
                  href="/prihlaseni"
                  className="text-white hover:text-gray-300 transition-colors font-medium"
                >
                  Přihlaste se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
