'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaktixLogo } from './FaktixLogo';

interface WelcomeModalProps {
  storageKey?: string;
}

export default function WelcomeModal({ storageKey = 'faktix-welcome-shown' }: WelcomeModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const profileName = useMemo(() => {
    if (typeof window === 'undefined') return '';
    try {
      const raw = localStorage.getItem('faktix-profile');
      if (!raw) return '';
      const data = JSON.parse(raw) as { company?: { name?: string } } | { companyName?: string } | undefined;
      // Support both onboarding shape and older profile shape
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyData = data as any;
      return (
        anyData?.company?.name || anyData?.companyName || ''
      );
    } catch {
      return '';
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const hasProfile = !!localStorage.getItem('faktix-profile');
      const alreadyShown = !!localStorage.getItem(storageKey);
      if (hasProfile && !alreadyShown) {
        setOpen(true);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const closeAndRemember = () => {
    try {
      localStorage.setItem(storageKey, new Date().toISOString());
    } catch {
      // ignore
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={closeAndRemember} />
      <div className="relative w-full max-w-3xl mx-4 bg-neutral-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-8">
          <div className="flex items-center justify-center">
            <FaktixLogo />
          </div>
          <h2 className="mt-4 text-center text-2xl sm:text-3xl font-semibold text-white">
            Vítejte ve Faktixu{profileName ? `, ${profileName}` : ''}!
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-300">
            V aplikaci zvládnete vše kolem fakturace – od vystavení první faktury až po přehledné statistiky. 
            Vyzkoušejte si vše hned teď.
          </p>
        </div>

        {/* Body preview card */}
        <div className="px-6 sm:px-8 py-6">
          <div className="bg-gradient-to-br from-sky-400/15 via-indigo-500/10 to-purple-500/10 border border-white/10 rounded-xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6">
              <div className="flex-1">
                <div className="text-white text-lg font-medium">
                  Začněte bez rizika
                </div>
                <div className="mt-2 text-sm text-gray-300 leading-relaxed">
                  Vystavte první fakturu, sledujte úhrady a mějte své podnikání pod kontrolou. 
                  Můžete kdykoliv pokračovat později.
                </div>
                <div className="mt-4 hidden sm:block text-xs text-gray-400">
                  Tip: V profilu doplňte své firemní údaje a bankovní účet pro rychlejší práci.
                </div>
              </div>
              <div className="w-full sm:w-72 h-36 sm:h-40 rounded-lg bg-black/40 border border-white/10 grid place-items-center text-gray-400 text-sm">
                Náhled rozhraní
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            className="flex-1 inline-flex items-center justify-center h-11 rounded-lg bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-medium hover:opacity-90 transition"
            onClick={() => { closeAndRemember(); router.push('/faktury'); }}
          >
            Vystavit první fakturu
          </button>
          <button
            className="flex-1 inline-flex items-center justify-center h-11 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition"
            onClick={closeAndRemember}
          >
            Později
          </button>
        </div>
      </div>
    </div>
  );
}







