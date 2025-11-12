"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Building2, Loader2 } from "lucide-react";
import { FaktixLogo } from "@/components/FaktixLogo";
import { CloudBackground } from "@/components/CloudBackground";
import { useAuth } from "@/hooks/useAuth";
import { searchByICO, AresCompanyData } from "@/lib/ares-api";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingICO, setIsLoadingICO] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    ico: "",
    dic: "",
    street: "",
    city: "",
    postalCode: "",
    country: "Česká republika",
    typZivnosti: "",
    agreeToTerms: false,
  });

  // Стан для валідації пароля
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Функція для валідації пароля
  const validatePassword = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  // Функція для визначення сили пароля
  const getPasswordStrength = () => {
    const validCount = Object.values(passwordValidation).filter(Boolean).length;
    if (validCount <= 2) return { strength: 'slabé', color: 'text-red-400', bgColor: 'bg-red-500' };
    if (validCount <= 3) return { strength: 'střední', color: 'text-yellow-400', bgColor: 'bg-yellow-500' };
    if (validCount <= 4) return { strength: 'silné', color: 'text-blue-400', bgColor: 'bg-blue-500' };
    return { strength: 'velmi silné', color: 'text-green-400', bgColor: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  // Автоматичне заповнення при введенні 8 цифр IČ
  useEffect(() => {
    const cleanIco = formData.ico.replace(/\s/g, '');
    if (cleanIco.length === 8 && /^\d{8}$/.test(cleanIco)) {
      console.log('🔄 Auto-filling company data for IČ:', cleanIco);
      handleIcoLookup();
    }
  }, [formData.ico]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Валідація обов'язкових полів
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Prosím vyplňte všechna povinná pole označená *");
      return;
    }

    // Валідація email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Prosím zadejte platný e-mail");
      return;
    }

    // Валідація пароля
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
      setError("Heslo nesplňuje požadavky na bezpečnost");
      return;
    }

    // Валідація підтвердження пароля
    if (formData.password !== formData.confirmPassword) {
      setError("Hesla se neshodují");
      return;
    }

    // Валідація IČ (якщо введено)
    if (formData.ico && !/^\d{8}$/.test(formData.ico.replace(/\s/g, ''))) {
      setError("IČ musí mít 8 číslic");
      return;
    }

    // Валідація погодження з умовами
    if (!formData.agreeToTerms) {
      setError("Musíte souhlasit s obchodními podmínkami");
      return;
    }

    console.log('🔄 Attempting registration for:', formData.email);

    const result = await register(formData.email, formData.password, `${formData.firstName} ${formData.lastName}`);

    if (result.success) {
      console.log('✅ Registration successful, email verification sent');
      
      // Показуємо повідомлення про підтвердження email
      alert(result.message || 'Реєстрація майже завершена! Ми надіслали лист на вашу пошту для підтвердження.');
      
      // Перенаправляємо на сторінку підтвердження email
      router.push("/potvrdit-email");
    } else {
      console.log('❌ Registration failed:', result.message);
      
      // Детальна обробка помилок Firebase
      let errorMessage = result.message || "Registrace se nezdařila";
      
      if (result.error) {
        switch (result.error) {
          case 'auth/email-already-in-use':
            errorMessage = 'Tento email již existuje. Zkuste se přihlásit nebo obnovit heslo.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Neplatný formát emailu.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Heslo je příliš slabé. Musí obsahovat alespoň 6 znaků.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Chyba připojení k síti. Zkontrolujte internetové připojení.';
            break;
          case 'auth/configuration-not-found':
            errorMessage = 'Firebase konfigurace nebyla nalezena. Kontaktujte správce.';
            break;
          default:
            errorMessage = `Chyba: ${result.error} - ${result.message}`;
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
    
    // Валідація пароля при зміні
    if (name === 'password') {
      validatePassword(value);
    }
    
    // Очищаємо помилку при зміні полів
    if (error) {
      setError(null);
    }
  };

  const handleIcoLookup = async () => {
    const cleanIco = formData.ico.replace(/\s/g, '');
    
    if (!cleanIco) {
      setError("Prosím zadejte IČ pro vyhledání");
      return;
    }

    if (cleanIco.length !== 8 || !/^\d{8}$/.test(cleanIco)) {
      setError("IČ musí mít přesně 8 číslic");
      return;
    }

    setIsLoadingICO(true);
    setError(null);

    try {
      const result = await searchByICO(cleanIco);
      
      if (result.success && result.data) {
        const companyData = result.data;
        setFormData(prev => ({
          ...prev,
          company: companyData.obchodniJmeno,
          dic: companyData.dic || "",
          street: `${companyData.adresa.ulice} ${companyData.adresa.cisloOrientacni || companyData.adresa.cisloEvidencni || ""}`.trim(),
          city: companyData.adresa.mesto,
          postalCode: companyData.adresa.psc,
          typZivnosti: companyData.typZivnosti || "Nedefinováno"
        }));

        console.log('✅ Company data auto-filled successfully');
        setLoadingStep('Firma nalezena a vyplněna!');
        setTimeout(() => setLoadingStep(''), 2000);
      } else {
        console.log('❌ Company not found for IČ:', cleanIco);
        setLoadingStep('Firma nebyla nalezena');
        setTimeout(() => setLoadingStep(''), 3000);
      }
    } catch (error) {
      console.error('ARES API error:', error);
      setLoadingStep('Chyba při vyhledávání');
      setTimeout(() => setLoadingStep(''), 3000);
    } finally {
      setIsLoadingICO(false);
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

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    Jméno <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="minimal-input w-full px-3 py-2"
                    placeholder="Jan"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Příjmení <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="minimal-input w-full px-3 py-2"
                    placeholder="Novák"
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                  placeholder="jan@novak.cz"
                  disabled={isLoading}
                />
              </div>

              {/* ICO */}
              <div>
                <label htmlFor="ico" className="block text-sm font-medium text-gray-300 mb-2">
                  IČ <span className="text-gray-500">(auto-doplnění z ARES)</span>
                  {formData.ico.length === 8 && (
                    <span className="ml-2 text-xs text-green-400">✓ Automatické vyplnění</span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="ico"
                    name="ico"
                    value={formData.ico}
                    onChange={handleChange}
                    className="minimal-input flex-1 px-3 py-2"
                    placeholder="12345678"
                    disabled={isLoading}
                    maxLength={8}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleIcoLookup}
                    disabled={!formData.ico || isLoading || isLoadingICO}
                    className="min-w-[80px]"
                  >
                    {isLoadingICO ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Najít"
                    )}
                  </Button>
                </div>
                {/* Status message for auto-fill */}
                {loadingStep && (
                  <div className="mt-2 text-sm text-blue-400 flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {loadingStep}
                  </div>
                )}
                {/* Auto-fill hint */}
                {formData.ico.length > 0 && formData.ico.length < 8 && (
                  <div className="mt-1 text-xs text-gray-500">
                    Zadejte 8 číslic pro automatické vyplnění
                  </div>
                )}
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Firma <span className="text-gray-500">(auto-doplněno z ARES)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="minimal-input w-full px-3 py-2 pl-10"
                    placeholder="Název firmy"
                    disabled={isLoading}
                  />
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* DIC */}
              <div>
                <label htmlFor="dic" className="block text-sm font-medium text-gray-300 mb-2">
                  DIČ <span className="text-gray-500">(auto-doplněno z ARES)</span>
                </label>
                <input
                  type="text"
                  id="dic"
                  name="dic"
                  value={formData.dic}
                  onChange={handleChange}
                  className="minimal-input w-full px-3 py-2"
                  placeholder="CZ12345678"
                  disabled={isLoading}
                />
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-2">
                    Ulice
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="minimal-input w-full px-3 py-2"
                    placeholder="Hlavní 123"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                    Město
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="minimal-input w-full px-3 py-2"
                    placeholder="Praha"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-2">
                    PSČ
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="minimal-input w-full px-3 py-2"
                    placeholder="11000"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                    Země
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="minimal-input w-full px-3 py-2"
                    placeholder="Česká republika"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Typ živnosti */}
              <div>
                <label htmlFor="typZivnosti" className="block text-sm font-medium text-gray-300 mb-2">
                  Typ živnosti <span className="text-gray-500">(auto-doplněno z ARES)</span>
                </label>
                <input
                  type="text"
                  id="typZivnosti"
                  name="typZivnosti"
                  value={formData.typZivnosti}
                  onChange={handleChange}
                  className="minimal-input w-full px-3 py-2"
                  placeholder="Nedefinováno"
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
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Síla hesla:</span>
                      <span className={`text-sm font-medium ${passwordStrength.color}`}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.bgColor}`}
                        style={{ 
                          width: `${(Object.values(passwordValidation).filter(Boolean).length / 5) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                {/* Password Requirements */}
                <div className="mt-2 text-sm text-gray-400">
                  Heslo musí obsahovat:
                  <div className="grid grid-cols-1 gap-1 mt-1">
                    <span className={`${passwordValidation.length ? 'text-green-400' : 'text-red-400'}`}>
                      {passwordValidation.length ? '✓' : '✗'} Minimálně 8 znaků
                    </span>
                    <span className={`${passwordValidation.uppercase ? 'text-green-400' : 'text-red-400'}`}>
                      {passwordValidation.uppercase ? '✓' : '✗'} Velké písmeno (A-Z)
                    </span>
                    <span className={`${passwordValidation.lowercase ? 'text-green-400' : 'text-red-400'}`}>
                      {passwordValidation.lowercase ? '✓' : '✗'} Malé písmeno (a-z)
                    </span>
                    <span className={`${passwordValidation.number ? 'text-green-400' : 'text-red-400'}`}>
                      {passwordValidation.number ? '✓' : '✗'} Číslo (0-9)
                    </span>
                    <span className={`${passwordValidation.special ? 'text-green-400' : 'text-red-400'}`}>
                      {passwordValidation.special ? '✓' : '✗'} Speciální znak (!@#$%^&*)
                    </span>
                  </div>
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
                    placeholder="••••••••"
                    disabled={isLoading}
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
                {isLoading ? "Registruji..." : "Registrovat se"}
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