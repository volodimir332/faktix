"use client";

import { useState, useEffect } from 'react';
import { X, Send, Mail, Eye, Download, Users, ChevronDown } from 'lucide-react';
import { FaktixIcon } from './FaktixLogo';
import { fixClonedDocument } from '@/lib/color-fix';
import { useClients } from '@/contexts/ClientContext';

interface TemplateItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  total: number;
  defaultPrice?: number;
}

interface SendTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
  items: TemplateItem[];
  total: number;
  onSend: (email: string) => void;
  mode?: 'kalkulace' | 'cenove-nabidky';
}

export default function SendTemplateModal({ 
  isOpen, 
  onClose, 
  templateName, 
  items, 
  total,
  onSend,
  mode = 'kalkulace'
}: SendTemplateModalProps) {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const { clients } = useClients();

  // Filter clients that have email
  const clientsWithEmail = clients.filter(client => client.email && client.email.trim() !== '');

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setShowClientDropdown(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!email.trim()) {
      alert('Prosím, zadejte e-mailovou adresu');
      return;
    }

    setIsSending(true);
    try {
      // Генеруємо PDF
      console.log('📧 Generování PDF pro email...');
      
      // Ensure preview is shown
      if (!showPreview) {
        setShowPreview(true);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      let previewElement = document.getElementById('hidden-pdf-template') as HTMLElement;
      
      if (!previewElement) {
        await new Promise(resolve => setTimeout(resolve, 200));
        previewElement = document.getElementById('hidden-pdf-template') as HTMLElement;
      }
      
      if (!previewElement) {
        throw new Error('Nepodařilo se najít element pro PDF (#hidden-pdf-template)');
      }

      // Імпортуємо html2canvas і jsPDF динамічно
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        // ВИМКНЕНО виправлення - просто копіюємо стилі як є
        // onclone: (clonedDoc) => {
        //   fixClonedDocument(clonedDoc);
        // }
      });

      // Створюємо PDF (ТОЧНО ЯК У ФАКТУРАХ)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Розраховуємо розміри для A4 (ТОЧНО ЯК У ФАКТУРАХ)
      const imgWidth = 210; // A4 ширина в мм
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Додаємо зображення до PDF (ТОЧНО ЯК У ФАКТУРАХ)
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

      // Конвертуємо PDF в Base64
      const pdfBase64 = pdf.output('dataurlstring').split(',')[1];

      // Генеруємо HTML для email
      const itemsHtml = items
        .filter(item => mode === 'kalkulace' ? item.quantity > 0 : item.price > 0)
        .map(item => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity || '-'}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.unit}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: right;">${(item.price || item.defaultPrice || 0).toLocaleString('cs-CZ')} Kč</td>
            ${mode === 'kalkulace' ? `<td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: right;"><strong>${item.total.toLocaleString('cs-CZ')} Kč</strong></td>` : ''}
          </tr>
        `).join('');
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 30px; background: #ffffff; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f9fafb; padding: 15px; text-align: left; border-bottom: 3px solid #10b981; font-weight: 600; }
            .total { font-size: 28px; color: #10b981; text-align: right; margin-top: 30px; padding: 20px; background: #f0fdf4; border-radius: 10px; }
            .footer { text-align: center; color: #666; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; }
            .pdf-note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">✨ faktix</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">${mode === 'kalkulace' ? 'Kalkulace' : 'Cenová nabídka'}</p>
            </div>
            <div class="content">
              <h2 style="color: #1f2937; margin-top: 0;">${templateName}</h2>
              
              <div class="pdf-note">
                <strong>📎 PDF příloha:</strong> Detailní rozpočet naleznete v příloze tohoto e-mailu.
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th>Položka</th>
                    <th style="text-align: center;">Množství</th>
                    <th style="text-align: center;">Jednotka</th>
                    <th style="text-align: right;">Cena/jedn.</th>
                    ${mode === 'kalkulace' ? '<th style="text-align: right;">Celkem</th>' : ''}
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              ${mode === 'kalkulace' ? `
                <div class="total">
                  <strong>Celková částka: ${total.toLocaleString('cs-CZ')} Kč</strong>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <p><strong>Děkujeme za Váš zájem!</strong></p>
              <p style="font-size: 14px; color: #999;">Tento e-mail byl vygenerován systémem faktix</p>
              <p style="font-size: 12px; color: #999; margin-top: 20px;">faktix - Rychlá fakturace pro moderní podnikatele</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Отримуємо дані користувача
      const userProfile = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userProfile') || '{}') : {};
      
      const userName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Faktix';
      const companyName = userProfile.companyName || userProfile.businessName || userName;
      const userEmailAddr = userProfile.email || '';
      const totalAmount = `${total.toLocaleString('cs-CZ')} Kč`;

      // Відправляємо email з PDF вкладенням
      console.log('📤 Odesílání e-mailu...');
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: mode === 'kalkulace' 
            ? `Kalkulace - ${templateName}` 
            : `Cenová nabídka - ${templateName}`,
          
          // ✅ Використовуємо новий професійний template
          useTemplate: true,
          emailType: mode === 'kalkulace' ? 'calculation' : 'offer',
          
          // Дані для template
          userName,
          userEmail: userEmailAddr,
          companyName,
          clientName: undefined, // можна додати якщо є дані клієнта
          calculationName: templateName,
          totalAmount: totalAmount,
          logoUrl: 'https://faktix.cz/logo.png',
          companySite: 'https://faktix.cz',
          
          // PDF вкладення
          attachments: [{
            filename: `${mode === 'kalkulace' ? 'kalkulace' : 'nabidka'}_${templateName.replace(/\s+/g, '_')}.pdf`,
            content: pdfBase64,
            encoding: 'base64'
          }]
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ ${mode === 'kalkulace' ? 'Kalkulace' : 'Nabídka'} byla úspěšně odeslána na:\n${email}\n\n📎 S přílohou PDF`);
        onClose();
        setEmail('');
      } else {
        throw new Error(result.error || 'Chyba při odesílání');
      }
    } catch (error) {
      console.error('❌ Chyba při odesílání:', error);
      alert('❌ Chyba při odesílání e-mailu.\nZkuste to prosím znovu nebo kontaktujte podporu.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = async () => {
    console.log('=== ПОЧАТОК ГЕНЕРАЦІЇ PDF ===');
    
    // Ensure preview is shown before generating PDF
    if (!showPreview) {
      console.log('⚠️ Preview je skrytý, zobrazuji...');
      setShowPreview(true);
      // Wait for React to render the element
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
      // CRITICAL: Use HIDDEN element with INLINE styles (like in faktury/[id]/page.tsx)
      // This ensures PDF looks exactly like preview (no Tailwind class issues)
      let previewElement = document.getElementById('hidden-pdf-template') as HTMLElement;
    
    // Retry logic if element not found
    if (!previewElement) {
      console.log('⏳ Čekám на vykreslení elementu...');
      await new Promise(resolve => setTimeout(resolve, 200));
      previewElement = document.getElementById('hidden-pdf-template') as HTMLElement;
    }
    
    if (!previewElement) {
      console.error('❌ Елемент #hidden-pdf-template не знайдено!');
      console.error('showPreview:', showPreview);
      alert('Chyba: Nepodařilo se najít element pro PDF. Zkuste to prosím znovu.');
      return;
    }

    console.log('✅ Елемент знайдено!');
    console.log('📏 Розміри:', previewElement.offsetWidth, 'x', previewElement.offsetHeight);
    console.log('📄 Вміст (символів):', previewElement.innerHTML.length);

    // Перевіряємо, чи елемент містить контент
    if (previewElement.innerHTML.length < 100) {
      console.error('❌ Елемент має занадто мало контенту!');
      return;
    }

    const currentDate = new Date().toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });

    try {
      console.log('🔄 Починаємо конвертацію в canvas...');
      
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      console.log('🎨 Генеруємо PDF з inline стилів (без виправлень oklab)...');

      // Конвертуємо HTML в canvas - ПРОСТО КОПІЮЄМО без виправлень
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: previewElement.offsetWidth,
        height: previewElement.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        // ВИМКНЕНО виправлення - inline стилі вже безпечні
        // onclone: (clonedDoc) => {
        //   console.log('💉 Виправляємо oklab у клонованому документі...');
        //   fixClonedDocument(clonedDoc);
        // }
      });

      console.log('✅ Canvas створено!');
      console.log('📏 Розміри canvas:', canvas.width, 'x', canvas.height);

      // Створюємо PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      console.log('✅ PDF документ створено!');

      // Розраховуємо розміри для A4
      const imgWidth = 210; // A4 ширина в мм
      const pageHeight = 297; // A4 висота в мм
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      console.log('📏 Розраховані розміри зображення:', imgWidth, 'x', imgHeight, 'мм');

      // Додаємо зображення до PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

      console.log('✅ Зображення додано до PDF!');

      // Зберігаємо PDF
      const filename = `${templateName}-${currentDate}.pdf`;
      pdf.save(filename);

      console.log('✅ PDF успішно збережено як:', filename);
      console.log('=== КІНЕЦЬ ГЕНЕРАЦІЇ PDF ===');

    } catch (error) {
      console.error('❌ Помилка при генерації PDF:', error);
    }
  };

  // Filter items based on mode
  const visibleItems = mode === 'kalkulace' 
    ? items.filter(item => item.quantity > 0) // Show only items with quantity in calculation mode
    : items.filter(item => (item.defaultPrice || item.price) > 0); // Show all items with price in offer mode

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-money/10 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-money" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Odeslat rozpočet</h2>
              <p className="text-sm text-gray-400">Náhled před odesláním</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Preview Toggle & Download */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Skrýt náhled' : 'Zobrazit náhled'}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-3 py-1.5 bg-money hover:bg-money-dark text-black rounded-lg text-sm transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Stáhnout PDF
            </button>
          </div>

          {/* PDF Preview - Full A4 Page */}
          {showPreview && (
            <div className="mb-6 flex justify-center">
              <div className="bg-gray-200 p-4 rounded-lg shadow-xl" style={{ maxHeight: '75vh', overflow: 'auto' }}>
                <div className="bg-white shadow-2xl" style={{ width: '210mm', minHeight: '297mm', transform: 'scale(0.75)', transformOrigin: 'top center' }}>
                  {/* PDF Content */}
                  <div id="pdf-preview-content" style={{ width: '210mm', minHeight: '297mm', padding: '20mm', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Main Content */}
                <div style={{ flex: 1 }}>
                  {/* Header with Logo */}
                  <div className="mb-4 pb-3 border-b-2 border-money">
                    <div className="flex items-start justify-between mb-2">
                      {/* Logo */}
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                          <FaktixIcon size="sm" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">faktix</div>
                        </div>
                      </div>
                    
                    {/* Date */}
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500">Datum vystavení</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {new Date().toLocaleDateString('cs-CZ', {
                          day: 'numeric',
                          month: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <h1 className="text-base font-bold text-gray-900 mt-2">{templateName}</h1>
                </div>

                {/* Items Table */}
                <table className="w-full mb-4 text-xs">
                  <thead>
                    <tr className="bg-money/10 border-b-2 border-money">
                      <th className="text-left py-1.5 px-2 text-gray-800 font-semibold">Položka</th>
                      <th className="text-center py-1.5 px-2 text-gray-800 font-semibold w-12">Jedn.</th>
                      {mode === 'kalkulace' && <th className="text-right py-1.5 px-2 text-gray-800 font-semibold w-16">Množství</th>}
                      <th className="text-right py-1.5 px-2 text-gray-800 font-semibold w-20">Cena/jedn.</th>
                      {mode === 'kalkulace' && <th className="text-right py-1.5 px-2 text-gray-800 font-semibold w-24 bg-money/20">Celkem</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((item, index) => (
                      <tr key={item.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="py-1.5 px-2 text-gray-900">{item.name}</td>
                        <td className="py-1.5 px-2 text-center text-gray-600">{item.unit}</td>
                        {mode === 'kalkulace' && <td className="py-1.5 px-2 text-right text-gray-900 font-medium">{item.quantity}</td>}
                        <td className="py-1.5 px-2 text-right text-gray-700">
                          {mode === 'kalkulace' 
                            ? item.price.toLocaleString() 
                            : (item.defaultPrice || item.price).toLocaleString()} Kč
                        </td>
                        {mode === 'kalkulace' && (
                          <td className="py-1.5 px-2 text-right font-semibold text-gray-900 bg-money/5">
                            {item.total.toLocaleString()} Kč
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total - Green accent like invoice (only in Kalkulace mode) */}
                {mode === 'kalkulace' && (
                  <div className="bg-gradient-to-r from-money to-money/80 rounded-lg p-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-black/70">Celková částka</div>
                        <div className="text-sm font-bold text-black">Celkem k úhradě</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-black">
                          {total.toLocaleString()} Kč
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </div>

                {/* Footer with line - at the very bottom */}
                <div className="pt-4 border-t border-gray-300" style={{ position: 'absolute', bottom: 0, left: '20mm', right: '20mm', paddingBottom: '10mm' }}>
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <FaktixIcon size="sm" />
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold">faktix.cz</span> — systém fakturace a kalkulací
                    </div>
                  </div>
                </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HIDDEN PDF Template - INLINE STYLES ONLY (like faktury/[id]/page.tsx) */}
          {/* This element is used for PDF generation - it has INLINE styles to avoid Tailwind oklab issues */}
          <div style={{ position: 'absolute', left: '-9999px' }}>
            <div 
              id="hidden-pdf-template" 
              style={{ 
                width: '210mm', 
                minHeight: '297mm', 
                fontFamily: 'Arial, Helvetica, sans-serif',
                padding: '20mm',
                backgroundColor: '#ffffff',
                color: '#000000',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Main Content */}
              <div style={{ flex: 1 }}>
                {/* Header */}
                <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div><FaktixIcon size="sm" /></div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>faktix</div>
                    </div>
                    
                    {/* Date */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>Datum vystavení</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                        {new Date().toLocaleDateString('cs-CZ', {
                          day: 'numeric',
                          month: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginTop: '8px' }}>
                    {templateName}
                  </h1>
                </div>

                {/* Items Table */}
                <table style={{ width: '100%', marginBottom: '16px', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderBottom: '2px solid #10b981' }}>
                      <th style={{ textAlign: 'left', padding: '6px 8px', color: '#1f2937', fontWeight: '600' }}>Položka</th>
                      <th style={{ textAlign: 'center', padding: '6px 8px', color: '#1f2937', fontWeight: '600', width: '48px' }}>Jedn.</th>
                      {mode === 'kalkulace' && <th style={{ textAlign: 'right', padding: '6px 8px', color: '#1f2937', fontWeight: '600', width: '64px' }}>Množství</th>}
                      <th style={{ textAlign: 'right', padding: '6px 8px', color: '#1f2937', fontWeight: '600', width: '80px' }}>Cena/jedn.</th>
                      {mode === 'kalkulace' && <th style={{ textAlign: 'right', padding: '6px 8px', color: '#1f2937', fontWeight: '600', width: '96px', backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>Celkem</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((item, index) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: index % 2 === 0 ? '#f9fafb' : '#ffffff' }}>
                        <td style={{ padding: '6px 8px', color: '#111827' }}>{item.name}</td>
                        <td style={{ padding: '6px 8px', textAlign: 'center', color: '#4b5563' }}>{item.unit}</td>
                        {mode === 'kalkulace' && <td style={{ padding: '6px 8px', textAlign: 'right', color: '#111827', fontWeight: '500' }}>{item.quantity}</td>}
                        <td style={{ padding: '6px 8px', textAlign: 'right', color: '#374151' }}>
                          {mode === 'kalkulace' 
                            ? item.price.toLocaleString() 
                            : (item.defaultPrice || item.price).toLocaleString()} Kč
                        </td>
                        {mode === 'kalkulace' && (
                          <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: '600', color: '#111827', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                            {item.total.toLocaleString()} Kč
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total (only for Kalkulace) */}
                {mode === 'kalkulace' && (
                  <div style={{ backgroundColor: '#10b981', borderRadius: '8px', padding: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.7)' }}>Celková částka</div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000' }}>Celkem k úhradě</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
                          {total.toLocaleString()} Kč
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid #d1d5db', position: 'absolute', bottom: '10mm', left: '20mm', right: '20mm' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div><FaktixIcon size="sm" /></div>
                  <div style={{ fontSize: '12px', color: '#4b5563' }}>
                    <span style={{ fontWeight: '600' }}>faktix.cz</span> — systém fakturace a kalkulací
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions with Email */}
        <div className="border-t border-gray-700 bg-gray-800/30">
          {/* Email Label */}
          <div className="px-6 pt-4 pb-2 flex items-center justify-between">
            <label className="text-xs text-gray-400">
              Zadejte e-mail zákazníka pro odeslání rozpočtu
            </label>
            {clientsWithEmail.length > 0 && (
              <button
                onClick={() => setShowClientDropdown(!showClientDropdown)}
                className="flex items-center gap-1.5 text-xs text-money hover:text-money-light transition-colors px-2 py-1 rounded hover:bg-money/10"
                type="button"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Vybrat klienta</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showClientDropdown ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
          
          {/* Client Dropdown */}
          {showClientDropdown && clientsWithEmail.length > 0 && (
            <div className="px-6 pb-2">
              <div className="bg-gray-900 border border-gray-700 rounded-lg max-h-48 overflow-y-auto">
                {clientsWithEmail.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setEmail(client.email || '');
                      setShowClientDropdown(false);
                    }}
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-0 group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white group-hover:text-money transition-colors truncate">
                          {client.name}
                        </div>
                        <div className="text-xs text-gray-400 truncate">{client.email}</div>
                      </div>
                      {client.ico && (
                        <div className="text-xs text-gray-500 flex-shrink-0">
                          IČ: {client.ico}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Email Input and Buttons */}
          <div className="flex items-center justify-between gap-4 px-6 pb-6">
            {/* Email Input - Compact */}
            <div className="flex items-center gap-3 flex-1 max-w-md relative">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.cz"
                className="flex-1 px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-money transition-colors"
                disabled={isSending}
              />
              {email && (
                <div className="absolute right-3 flex items-center gap-1 text-money pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-money animate-pulse"></div>
                  <span className="text-[10px] font-medium">OK</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm"
                disabled={isSending}
              >
                Zrušit
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || !email.trim()}
                className="px-5 py-2.5 bg-money hover:bg-money-dark text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Odesílání...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Odeslat rozpočet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

