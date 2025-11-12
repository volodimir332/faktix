'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/firebase-auth';
import { saveUserProfile } from '@/lib/firestore-service';
import { getCompanyData } from '@/lib/ares-api';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { FaktixLogo } from '@/components/FaktixLogo';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    ico: '',
    hasIco: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleIcoToggle = () => {
    setFormData(prev => ({
      ...prev,
      hasIco: !prev.hasIco,
      ico: !prev.hasIco ? '' : prev.ico
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gdprConsent) {
      setError('Musíte souhlasit se zpracováním osobních údajů');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Hesla se neshodují');
      return;
    }

    if (formData.password.length < 6) {
      setError('Heslo musí mít alespoň 6 znaků');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Реєструємо користувача
      const reg = await registerUser(formData.email, formData.password);
      
      if (reg && reg.success && reg.user) {
        // Якщо є IČO, отримуємо дані компанії
        let companyData = null;
        if (formData.hasIco && formData.ico.trim()) {
          try {
            companyData = await getCompanyData(formData.ico);
          } catch (error) {
            console.warn('Nepodařilo se načíst data společnosti:', error);
          }
        }

        // Зберігаємо профіль користувача
        const profileData = {
          email: formData.email,
          ico: formData.hasIco ? formData.ico : '',
          companyName: companyData?.name || '',
          street: companyData?.street || '',
          city: companyData?.city || '',
          postalCode: companyData?.postalCode || '',
          country: 'Česká republika',
          registrationNumber: formData.hasIco ? formData.ico : '',
          businessType: companyData?.businessType || 'Nedefinováno',
          typZivnosti: companyData?.typZivnosti || 'Nedefinováno'
        };

        await saveUserProfile(reg.user.uid, profileData);
        
        // Зберігаємо email для сторінки підтвердження
        localStorage.setItem('pendingVerificationEmail', formData.email);
        
        setSuccess(true);
        setTimeout(() => {
          router.push(`/email-verification?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Chyba při registraci';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
              <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <FaktixLogo size="xl" className="justify-center mb-6" />
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Účet vytvořen!</h1>
          <p className="text-gray-400">Přesměrování na ověření e-mailu...</p>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <FaktixLogo size="xl" className="justify-center" />
        </div>

        {/* Main Title */}
        <h2 className="text-2xl font-bold text-center mb-8">
          Vytvořte si účet v Faktix
        </h2>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              E-mailová adresa <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
              placeholder="vas@email.cz"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Heslo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white pr-12"
                placeholder="Minimálně 6 znaků"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Potvrzení hesla <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white pr-12"
                placeholder="Zopakujte heslo"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* IČO */}
          <div>
            <label className="block text-sm font-medium mb-2">
              IČ <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                name="ico"
                value={formData.ico}
                onChange={handleInputChange}
                disabled={!formData.hasIco}
                required={formData.hasIco}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white disabled:opacity-50"
                placeholder="12345678"
              />
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleIcoToggle}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    formData.hasIco ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.hasIco ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
                <span className="text-sm text-gray-400">Nemám IČ</span>
              </div>
            </div>
          </div>

          {/* GDPR Consent */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="gdpr"
              checked={gdprConsent}
              onChange={(e) => setGdprConsent(e.target.checked)}
              className="mt-1 w-4 h-4 text-green-500 bg-gray-800 border-gray-700 rounded focus:ring-green-500"
            />
            <label htmlFor="gdpr" className="text-sm text-gray-300">
              Souhlasím se zpracováním osobních údajů ve smyslu čl. 6 odst. 1 písm. a) GDPR.
              <button
                type="button"
                className="ml-1 w-4 h-4 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-blue-600"
                title="Více informací o ochraně osobních údajů"
              >
                ?
              </button>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Vytváření účtu...</span>
              </>
            ) : (
              <span>Vstupte ZDARMA</span>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">Máte už účet?</p>
          <button
            onClick={() => router.push('/login')}
            className="text-blue-400 hover:text-blue-300 underline mt-1"
          >
            Přihlásit se
          </button>
        </div>
      </div>
    </div>
  );
}
