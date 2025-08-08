'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Send } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function OdeslatFakturu() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params?.id as string;
  
  const [subject, setSubject] = useState(`Faktura č. ${invoiceId}`);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [message, setMessage] = useState(`Hezký den,

vystavil jsem pro Vás fakturu ${invoiceId}.

Díky!
Roman Korol`);

  const handleMarkAsSent = () => {
    // Логіка для позначення фактури як відправленої
    router.back();
  };

  const handleSendEmail = () => {
    // Логіка для відправки email
    console.log('Sending email:', { subject, recipientEmail, ccEmail, message });
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
              <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900/20 to-black/40">
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
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-money text-black rounded-lg hover:bg-money-light transition-colors font-medium"
                >
                  <Send className="w-5 h-5" />
                  <span>Odeslat fakturu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}