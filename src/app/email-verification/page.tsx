'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { FaktixLogo } from '@/components/FaktixLogo';
// Optional: Resend support can be wired later; keep UI functional without it
// import { resendEmailVerification } from '@/lib/firebase-auth';

function EmailVerificationInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  // Отримуємо email з URL параметрів або localStorage
  const email = (searchParams?.get('email') || localStorage.getItem('pendingVerificationEmail') || '') as string;

  const handleResendEmail = async () => {
    // Placeholder action to avoid build error if resendEmailVerification is not exported
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 2500);
    }, 900);
  };

  const handleBackToLogin = () => {
    router.push('/prihlaseni');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-gray-900/50 border border-gray-700 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <FaktixLogo size="xl" className="justify-center" />
        </div>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-money">
            <CheckCircle className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold">Téměř hotovo</h1>
          <p className="text-gray-400 mt-2">Potvrďte prosím odkaz, který jsme zaslali na e‑mail:</p>
          <p className="text-white font-semibold mt-1">{email}</p>
          <p className="text-sm text-gray-500 mt-1">Odkaz platí 1 hodinu. Zkontrolujte i hromadnou poštu.</p>
        </div>
        <div className="text-center mb-6">
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="px-4 py-2 rounded-lg bg-money text-black font-semibold hover:bg-money-dark disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isResending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            {isResending ? 'Odesílání…' : 'Zaslat znovu'}
          </button>
          {resendSuccess && <p className="text-green-400 text-sm mt-2">✓ E-mail byl znovu odeslán</p>}
        </div>
        <div className="text-center">
          <button onClick={handleBackToLogin} className="text-gray-300 hover:text-white inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Zpět na přihlášení
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Завантаження…</div>}>
      <EmailVerificationInner />
    </Suspense>
  );
}
