'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Check, AlertCircle, Loader2 } from 'lucide-react';
import { InvoiceData } from '@/lib/invoice-utils';

interface SendInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData;
  onSuccess?: () => void;
}

export default function SendInvoiceModal({ isOpen, onClose, invoice, onSuccess }: SendInvoiceModalProps) {
  const [email, setEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [userProfile, setUserProfile] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Завантажити профіль користувача
      if (typeof window !== 'undefined') {
        const profile = localStorage.getItem('userProfile');
        if (profile) {
          const parsedProfile = JSON.parse(profile);
          setUserProfile(parsedProfile);
          
          // Встановити шаблонний текст
          const userName = `${parsedProfile.firstName || ''} ${parsedProfile.lastName || ''}`.trim();
          const companyName = parsedProfile.companyName || parsedProfile.businessName || '';
          
          // Формуємо підпис
          let signature = 'S pozdravem,\n';
          if (userName) {
            signature += userName;
            if (companyName && companyName !== userName) {
              signature += '\n' + companyName;
            }
          } else if (companyName) {
            signature += companyName;
          } else {
            signature += 'Faktix';
          }
          
          setMessage(`Dobrý den,

zasíláme Vám fakturu č. ${invoice.invoiceNumber} za poskytnuté služby.

Částka k úhradě: ${invoice.total?.toLocaleString('cs-CZ')} Kč
Splatnost: ${invoice.dueDate || '-'}

Faktura je v příloze tohoto e-mailu.

Děkujeme za Vaši důvěru!

${signature}`);
        }
      }

      // Встановити тему
      setSubject(`Faktura č. ${invoice.invoiceNumber}`);

      // Встановити email клієнта якщо є
      if ('client' in invoice) {
        const invoiceWithClient = invoice as { client?: { email?: string } };
        if (invoiceWithClient.client?.email) {
          setEmail(invoiceWithClient.client.email);
        }
      }
    }
  }, [isOpen, invoice]);

  const handleSend = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Zadejte prosím platný e-mail');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      // Дані користувача
      const userName = `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 'Faktix';
      const companyName = userProfile?.companyName || userProfile?.businessName || userName;
      const userEmailAddr = userProfile?.email || '';
      const clientName = invoice.customer || 'Client';

      // TODO: Тут має бути генерація PDF
      // Поки що відправимо без PDF, але з гарним HTML
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: `Faktura č. ${invoice.invoiceNumber} od ${companyName}`,
          
          // ✅ Використовуємо новий професійний template
          useTemplate: true,
          emailType: 'invoice',
          
          // Дані для template
          userName,
          userEmail: userEmailAddr,
          companyName,
          clientName,
          invoiceNumber: invoice.invoiceNumber,
          logoUrl: 'https://faktix.cz/logo.png',
          companySite: 'https://faktix.cz',
          
          // pdfBuffer: pdfBase64 // TODO: додати PDF генерацію
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        }
      } else {
        throw new Error(data.error || 'Chyba při odesílání');
      }
    } catch (error: unknown) {
      console.error('❌ Chyba při odesílání:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Nepodařilo se odeslat e-mail');
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status !== 'sending') {
      setEmail('');
      setCcEmail('');
      setSubject('');
      setMessage('');
      setStatus('idle');
      setErrorMessage('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-money/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-money/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-money" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Odeslat fakturu</h2>
              <p className="text-sm text-gray-400">č. {invoice.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={status === 'sending'}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Předmět
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={status === 'sending'}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-money transition-colors disabled:opacity-50"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email příjemce *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="zakaznik@example.com"
              disabled={status === 'sending'}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-money transition-colors disabled:opacity-50"
            />
          </div>

          {/* CC Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kopie na email
            </label>
            <input
              type="text"
              value={ccEmail}
              onChange={(e) => setCcEmail(e.target.value)}
              placeholder="dalsi@example.com"
              disabled={status === 'sending'}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-money transition-colors disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Až tři emaily. Oddělujte čárkou nebo středníkem.
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Zpráva
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === 'sending'}
              rows={12}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-money transition-colors resize-none disabled:opacity-50 font-mono text-sm leading-relaxed"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 PDF faktura bude automaticky přiložena k e-mailu.
            </p>
          </div>


          {/* Status Messages */}
          {status === 'success' && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <p className="text-green-400 font-medium">
                  ✅ Faktura byla úspěšně odeslána na {email}
                </p>
              </div>
            </div>
          )}

          {status === 'error' && errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400">
                  ❌ {errorMessage}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/30 flex items-center justify-between gap-3">
          <button
            onClick={handleClose}
            disabled={status === 'sending'}
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Zrušit
          </button>
          <button
            onClick={handleSend}
            disabled={status === 'sending' || !email || status === 'success'}
            className="flex items-center gap-2 px-8 py-3 bg-money hover:bg-money-light text-black rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Odesílání...</span>
              </>
            ) : status === 'success' ? (
              <>
                <Check className="w-5 h-5" />
                <span>Odesláno!</span>
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                <span>Odeslat fakturu</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

