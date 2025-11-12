'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Send, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useInvoices } from '@/contexts/InvoiceContext';

export default function OdeslatFakturu() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params?.id as string;
  const { invoices, updateInvoice } = useInvoices();
  
  const invoice = invoices.find(inv => inv.id === invoiceId);
  const [userProfile, setUserProfile] = useState<{firstName?: string; lastName?: string; companyName?: string; businessName?: string; email?: string} | null>(null);
  
  const [subject, setSubject] = useState(`Faktura č. ${invoiceId}`);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Завантажити профіль користувача
    if (typeof window !== 'undefined') {
      const profile = localStorage.getItem('userProfile');
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        setUserProfile(parsedProfile);
        
        // Встановити початкове повідомлення
        setMessage(`Hezký den,

vystavil jsem pro Vás fakturu ${invoiceId}.

S pozdravem,
${parsedProfile.firstName || ''} ${parsedProfile.lastName || ''}`);
      }
    }

    // Встановити email клієнта з фактури
    if (invoice && 'client' in invoice) {
      const invoiceWithClient = invoice as { client?: { email?: string } };
      if (invoiceWithClient.client?.email) {
        setRecipientEmail(invoiceWithClient.client.email);
      }
    }
  }, [invoice, invoiceId]);

  const handleMarkAsSent = async () => {
    if (invoice) {
      await updateInvoice(invoiceId, { ...invoice, status: 'sent' });
    }
    router.back();
  };

  const handleSendEmail = async () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setErrorMessage('Zadejte prosím platný email');
      setSendStatus('error');
      return;
    }

    setIsSending(true);
    setSendStatus('idle');
    setErrorMessage('');

    try {
      // Використовуємо професійний email шаблон
      const { getInvoiceEmailTemplate } = await import('@/lib/email-templates');
      
      const invoiceWithClient = invoice && 'client' in invoice ? invoice as { client?: { name?: string } } : null;
      
      const emailTemplate = getInvoiceEmailTemplate({
        userName: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 'Faktix',
        userCompany: userProfile?.companyName || userProfile?.businessName,
        userEmail: userProfile?.email || '',
        recipientName: invoiceWithClient?.client?.name,
        invoiceNumber: invoiceId,
        amount: invoice?.total ? `${invoice.total.toLocaleString('cs-CZ')} Kč` : '0 Kč',
        dueDate: invoice?.dueDate || '',
        message: message || undefined
      });

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          userName: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 'Faktix',
          userEmail: userProfile?.email || '',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSendStatus('success');
        
        // Оновити статус фактури
        if (invoice) {
          await updateInvoice(invoiceId, { ...invoice, status: 'sent' });
        }

        // Повернутися назад через 2 секунди
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        throw new Error(data.error || 'Chyba při odesílání');
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error('❌ Chyba při odesílání:', err);
      setErrorMessage(err.message || 'Nepodařilo se odeslat email');
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />

      {/* Main Content */}
      <div className="ml-16 min-h-screen flex flex-col bg-gradient-to-b from-gray-900/20 to-black/40">
        {/* Header */}
        <div className="border-b border-gray-700 bg-black/30 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Odeslat fakturu {invoiceId}
              </h1>
              <div className="mt-1 text-sm text-gray-400">
                <span className="font-medium text-white">LIVEN s.r.o.</span>
                <span className="mx-2 text-gray-500">•</span>
                <span className="font-medium text-money">545,00 Kč</span>
              </div>
            </div>
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zpět</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            {/* Mark as Sent Button */}
            <div className="text-center mb-8">
              <button
                onClick={handleMarkAsSent}
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-money text-black rounded-lg hover:bg-money-light transition-colors mx-auto font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Pouze označit za odeslanou</span>
              </button>
              <p className="mt-3 text-gray-400">nebo poslat email</p>
            </div>

            {/* Email Form */}
            <div className="space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-money-dark mb-2">
                  Předmět
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-lg focus:outline-none focus:border-money/50 transition-colors text-white"
                />
              </div>

              {/* Recipient Email */}
              <div>
                <label className="block text-sm font-medium text-money-dark mb-2">
                  Email příjemce
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-lg focus:outline-none focus:border-money/50 transition-colors text-white"
                  placeholder="zadejte email příjemce"
                />
              </div>

              {/* CC Email */}
              <div>
                <label className="block text-sm font-medium text-money-dark mb-2">
                  Kopie na email
                </label>
                <input
                  type="text"
                  value={ccEmail}
                  onChange={(e) => setCcEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-lg focus:outline-none focus:border-money/50 transition-colors text-white"
                  placeholder="zadejte email pro kopii"
                />
                <p className="mt-1 text-sm text-gray-400">
                  Až tři emaily. Oddělujte čárkou nebo středníkem.
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-money-dark mb-2">
                  Zpráva
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-lg focus:outline-none focus:border-money/50 transition-colors text-white resize-none"
                />
              </div>

              {/* Send Button */}
              <div className="pt-4">
                <button
                  onClick={handleSendEmail}
                  disabled={isSending || !recipientEmail}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-money text-black rounded-lg hover:bg-money-light transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Odesílání...</span>
                    </>
                  ) : sendStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Odesláno!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Odeslat fakturu</span>
                    </>
                  )}
                </button>
                
                {sendStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-center">✅ Faktura byla úspěšně odeslána!</p>
                  </div>
                )}
                
                {sendStatus === 'error' && errorMessage && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-center">❌ {errorMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}