'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentDetails, setPaymentDetails] = useState<{
    invoiceId: string;
    paymentIntentId: string;
    amount: string;
    currency: string;
    date: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const invoiceId = searchParams ? searchParams.get('invoiceId') : null;
  const paymentIntentId = searchParams ? searchParams.get('payment_intent') : null;

  useEffect(() => {
    // Тут можна додати логіку для отримання деталей платежу
    // з вашого API або з localStorage
    setTimeout(() => {
      setPaymentDetails({
        invoiceId: invoiceId || 'Unknown',
        paymentIntentId: paymentIntentId || 'Unknown',
        amount: '1,234.56',
        currency: 'CZK',
        date: new Date().toLocaleDateString('cs-CZ')
      });
      setIsLoading(false);
    }, 1000);
  }, [invoiceId, paymentIntentId]);

  const handleDownloadInvoice = () => {
    // Логіка для завантаження фактури
    console.log('Downloading invoice:', invoiceId);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-money mx-auto mb-4"></div>
            <p className="text-gray-300">Zpracování platby...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl p-8 max-w-2xl w-full text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-4">
            Platba úspěšná!
          </h1>

          {/* Description */}
          <p className="text-gray-300 mb-8 text-lg">
            Vaše platba byla zpracována úspěšně. Děkujeme za vaši důvěru.
          </p>

          {/* Payment Details */}
          <div className="bg-gray-800/60 border border-gray-600 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Detaily platby
            </h3>
            
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-300">Číslo faktury:</span>
                <span className="text-white font-medium">{paymentDetails?.invoiceId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">ID platby:</span>
                <span className="text-white font-medium">{paymentDetails?.paymentIntentId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Částka:</span>
                <span className="text-money font-bold text-lg">
                  {paymentDetails?.amount} {paymentDetails?.currency}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Datum:</span>
                <span className="text-white">{paymentDetails?.date}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-money text-black rounded-lg hover:bg-money-light transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Stáhnout fakturu
            </button>
            
            <button
              onClick={handleBackToDashboard}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Zpět na dashboard
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
            <p className="text-blue-200 text-sm">
              Potvrzení o platbě bylo odesláno na váš email. 
              Pokud máte jakékoliv dotazy, neváhejte nás kontaktovat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Завантаження…</div>}>
      <PaymentSuccessInner />
    </Suspense>
  );
}
