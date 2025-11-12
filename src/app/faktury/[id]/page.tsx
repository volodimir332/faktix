"use client";

import { 
  ChevronRight,
  Bell,
  MoreHorizontal,
  Download,
  Send,
  Edit,
  Trash2,
  FileX,
  FileText as FileTextIcon,
  Repeat,
  CheckCircle,
  Layers
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { useInvoices } from "@/contexts/InvoiceContext";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { InvoicePreviewModal } from "@/components/InvoicePreviewModal";
import { NewInvoiceModal } from "@/components/NewInvoiceModal";
import SendInvoiceModal from "@/components/SendInvoiceModal";

// Function to generate QR Platba code for Czech payments
function generateQRPlatbaCode(invoiceData: {
  iban?: string;
  totalAmount?: string;
  currency?: string;
  variableSymbol?: string;
  constantSymbol?: string;
  supplierEmail?: string;
}) {
  const {
    iban = 'CZ33 5500 0000 0049 1491 9003',
    totalAmount = '24150,00',
    currency = 'CZK',
    variableSymbol = '20250001',
    constantSymbol = '0308',
    supplierEmail = 'info@faktix.cz'
  } = invoiceData || {};

  // Format amount without spaces and with dot as decimal separator
  const formattedAmount = totalAmount.replace(/\s/g, '').replace(',', '.');
  
  // Format IBAN without spaces
  const formattedIBAN = iban.replace(/\s/g, '');
  
  // Create QR Platba string according to Czech standard
  const qrData = [
    'SPD*1.0*ACC:' + formattedIBAN + '*AM:' + formattedAmount + '*CC:' + currency,
    'MSG:' + 'Faktura ' + (variableSymbol || ''),
    'RN:' + (supplierEmail || ''),
    'VS:' + (variableSymbol || ''),
    'KS:' + (constantSymbol || ''),
    'DT:' + new Date().toISOString().split('T')[0]
  ].join('*');

  return qrData;
}

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params?.id as string;
  const { invoices, addInvoice, updateInvoice, updateInvoiceStatus, deleteInvoice: deleteInvoiceFromContext } = useInvoices();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWebfakturaModal, setShowWebfakturaModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const moreMenuRef = useRef<HTMLDivElement>(null);
  
  // Отримуємо дані фактури з контексту
  const invoice = invoices.find(inv => inv.invoiceNumber === invoiceId);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreMenuOpen]);

  // Generate QR code when invoice data is available
  useEffect(() => {
    if (invoice) {
      const invoiceData = {
        iban: 'CZ33 5500 0000 0049 1491 9003',
        totalAmount: invoice.total.toFixed(2).replace('.', ','),
        currency: 'CZK',
        variableSymbol: invoice.invoiceNumber.replace('-', ''),
        constantSymbol: '0308',
        supplierEmail: 'info@faktix.cz'
      };
      
      const qrData = generateQRPlatbaCode(invoiceData);
      QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(url => {
        setQrCodeDataUrl(url);
      }).catch(err => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [invoice]);

  // Якщо фактура не знайдена, показуємо повідомлення
  if (!invoice) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white mb-4">Faktura nenalezena</h1>
            <p className="text-gray-400 mb-6">Faktura s číslem {invoiceId} nebyla nalezena.</p>
            <button
              onClick={() => router.push('/faktury')}
              className="bg-money hover:bg-money-light text-black px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Zpět na faktury
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Конвертуємо дані для відображення
  const invoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    issueDate: new Date(invoice.date).toLocaleDateString('cs-CZ'),
    dueDate: new Date(invoice.dueDate).toLocaleDateString('cs-CZ'),
    customer: invoice.customer,
    customerAddress: (invoice as unknown as Record<string, unknown>).customerAddress as string || '',
    customerCity: (invoice as unknown as Record<string, unknown>).customerCity as string || '',
    customerICO: (invoice as unknown as Record<string, unknown>).customerICO as string || '',
    ownerName: (invoice as unknown as Record<string, unknown>).ownerName as string || '',
    supplierAddress: (invoice as unknown as Record<string, unknown>).supplierAddress as string || 'Technologická 377/8',
    supplierCity: (invoice as unknown as Record<string, unknown>).supplierCity as string || '708 00 Ostrava - Poruba',
    supplierICO: (invoice as unknown as Record<string, unknown>).supplierICO as string || '10754466',
    totalAmount: invoice.total.toFixed(2).replace('.', ','),
    currency: 'Kč',
    variableSymbol: invoice.invoiceNumber.replace('-', ''),
    constantSymbol: '0308',
    bankAccount: '4914919003/5500',
    iban: 'CZ33 5500 0000 0049 1491 9003',
    swift: 'RZBCCZPP',
    paymentMethod: 'Převodem',
    language: 'cs',
    items: invoice.items.map(item => ({
      description: item.description,
      quantity: item.quantity.toString(),
      unit: 'ks',
      price: item.unitPrice.toFixed(2).replace('.', ','),
      total: item.total.toFixed(2).replace('.', ',')
    }))
  };

  const handleWebfaktura = () => {
    // Відкрити модальне вікно веб-перегляду фактури
    setShowWebfakturaModal(true);
  };

  const generatePDF = async () => {
    console.log('=== ПОЧАТОК ГЕНЕРАЦІЇ PDF ===');
    
    // Get the invoice element from the preview (same as in InvoicePreviewModal)
    const invoiceElement = document.querySelector('.print-page') as HTMLElement;
    
    if (!invoiceElement) {
      console.error('❌ Елемент .print-page не знайдено!');
      alert('Помилка: Елемент фактури не знайдено');
      return;
    }
    
    console.log('✅ Елемент знайдено!');
    console.log('📏 Розміри:', invoiceElement.offsetWidth, 'x', invoiceElement.offsetHeight);
    console.log('📄 Вміст (символів):', invoiceElement.innerHTML.length);
    
    // Перевіряємо, чи елемент містить контент
    if (invoiceElement.innerHTML.length < 100) {
      console.error('❌ Елемент має занадто мало контенту!');
      alert('Помилка: Елемент фактури має занадто мало контенту');
      return;
    }
    
    // Зберігаємо оригінальні стилі
    const originalStyles = invoiceElement.getAttribute('style') || '';
    
    try {
      console.log('🔄 Починаємо конвертацію в canvas...');
      console.log('🎨 Використовуємо ТІЛЬКИ inline HEX стилі (без fixClonedDocument)...');
      
      // Конвертуємо HTML в canvas БЕЗ onclone callback
      // Всі кольори в прихованому template - це inline HEX стилі, тому окlab проблем немає
      const canvas = await html2canvas(invoiceElement, {
        scale: 2, // Висока якість
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: invoiceElement.offsetWidth,
        height: invoiceElement.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false, // Вимікаємо логи для зменшення шуму
        // ВИМКНЕНО: onclone callback більше не потрібен, бо всі кольори - HEX
        // onclone: (clonedDoc) => {
        //   console.log('💉 Виправляємо oklab у клонованому документі...');
        //   fixClonedDocument(clonedDoc);
        // }
      });
      
      console.log('✅ Canvas створено!');
      console.log('📏 Розміри canvas:', canvas.width, 'x', canvas.height);
      
      // Створюємо PDF (same as in InvoicePreviewModal)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      console.log('✅ PDF документ створено!');
      
      // Розраховуємо розміри для A4 (same as in InvoicePreviewModal)
      const imgWidth = 210; // A4 ширина в мм
      const pageHeight = 297; // A4 висота в мм
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      console.log('📏 Розраховані розміри зображення:', imgWidth, 'x', imgHeight, 'мм');
      
      // Додаємо зображення до PDF (same as in InvoicePreviewModal)
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      
      console.log('✅ Зображення додано до PDF!');
      
      // Зберігаємо PDF (same as in InvoicePreviewModal)
      const filename = `faktura_${invoiceData.invoiceNumber}.pdf`;
      pdf.save(filename);
      
      console.log('✅ PDF успішно збережено як:', filename);
      console.log('=== КІНЕЦЬ ГЕНЕРАЦІЇ PDF ===');
      alert('PDF файл успішно згенеровано та завантажено!');
      
    } catch (error) {
      console.error('❌ Помилка при генерації PDF:', error);
      alert('Помилка при генерації PDF: ' + (error instanceof Error ? error.message : 'Невідома помилка'));
    } finally {
      // Відновлюємо оригінальні стилі
      invoiceElement.setAttribute('style', originalStyles);
    }
  };

  const generateISDOC = () => {
    console.log('=== ПОЧАТОК ГЕНЕРАЦІЇ ISDOC ===');
    
    try {
      // Prepare data with fallbacks (same as in InvoicePreviewModal)
      const invoiceNumber = invoiceData.invoiceNumber || '2025-0001';
      const issueDate = invoiceData.issueDate || '2025-08-01';
      const dueDate = invoiceData.dueDate || '2025-08-15';
      const supplierName = invoiceData.ownerName || 'Roman Korol';
      const supplierAddress = invoiceData.supplierAddress || 'Technologická 377/8';
      const supplierCity = invoiceData.supplierCity || 'Ostrava - Poruba';
      const supplierICO = invoiceData.supplierICO || '10754466';
      const customerName = invoiceData.customer || 'LIVEN s.r.o.';
      const customerAddress = invoiceData.customerAddress || 'Lihovarská 689/40a';
      const customerCity = invoiceData.customerCity || 'Ostrava - Kunčičky';
      const customerICO = invoiceData.customerICO || '10754466';
      const totalAmount = invoiceData.totalAmount || '244950.00';
      const bankAccount = invoiceData.bankAccount || '4914919003/5500';
      const iban = invoiceData.iban || 'CZ33 5500 0000 0049 1491 9003';
      const swift = invoiceData.swift || 'RZBCCZPP';
      const variableSymbol = invoiceData.variableSymbol || invoiceData.invoiceNumber || '20250001';
      const constantSymbol = invoiceData.constantSymbol || '0308';
      const paymentMethod = invoiceData.paymentMethod || 'Převodem';
      const currency = invoiceData.currency || 'CZK';

      console.log('📊 Дані для ISDOC:', {
        invoiceNumber,
        supplierName,
        customerName,
        totalAmount,
        bankAccount
      });

      // Create valid ISDOC XML content according to Czech standard (same as in InvoicePreviewModal)
      const isdocContent = `<?xml version="1.0" encoding="UTF-8"?>
<isdoc:Invoice xmlns:isdoc="http://isdoc.cz/namespace/2013" version="6.0.1">
  <isdoc:ID>${invoiceNumber}</isdoc:ID>
  <isdoc:IssueDate>${issueDate}</isdoc:IssueDate>
  <isdoc:DueDate>${dueDate}</isdoc:DueDate>
  <isdoc:DocumentCurrencyCode>${currency}</isdoc:DocumentCurrencyCode>
  <isdoc:TaxCurrencyCode>${currency}</isdoc:TaxCurrencyCode>
  
  <isdoc:AccountingSupplierParty>
    <isdoc:Party>
      <isdoc:PartyName>
        <isdoc:Name>${supplierName}</isdoc:Name>
      </isdoc:PartyName>
      <isdoc:PostalAddress>
        <isdoc:StreetName>${supplierAddress}</isdoc:StreetName>
        <isdoc:CityName>${supplierCity}</isdoc:CityName>
        <isdoc:PostalZone>708 00</isdoc:PostalZone>
        <isdoc:Country>
          <isdoc:IdentificationCode>CZ</isdoc:IdentificationCode>
        </isdoc:Country>
      </isdoc:PostalAddress>
      <isdoc:PartyTaxScheme>
        <isdoc:CompanyID>${supplierICO}</isdoc:CompanyID>
        <isdoc:TaxScheme>
          <isdoc:ID>VAT</isdoc:ID>
        </isdoc:TaxScheme>
      </isdoc:PartyTaxScheme>
    </isdoc:Party>
  </isdoc:AccountingSupplierParty>
  
  <isdoc:AccountingCustomerParty>
    <isdoc:Party>
      <isdoc:PartyName>
        <isdoc:Name>${customerName}</isdoc:Name>
      </isdoc:PartyName>
      <isdoc:PostalAddress>
        <isdoc:StreetName>${customerAddress}</isdoc:StreetName>
        <isdoc:CityName>${customerCity}</isdoc:CityName>
        <isdoc:PostalZone>718 00</isdoc:PostalZone>
        <isdoc:Country>
          <isdoc:IdentificationCode>CZ</isdoc:IdentificationCode>
        </isdoc:Country>
      </isdoc:PostalAddress>
      <isdoc:PartyTaxScheme>
        <isdoc:CompanyID>${customerICO}</isdoc:CompanyID>
        <isdoc:TaxScheme>
          <isdoc:ID>VAT</isdoc:ID>
        </isdoc:TaxScheme>
      </isdoc:PartyTaxScheme>
    </isdoc:Party>
  </isdoc:AccountingCustomerParty>
  
  <isdoc:InvoiceLines>
    ${invoiceData.items && invoiceData.items.length > 0 ? 
      invoiceData.items.map((item, index) => `
    <isdoc:InvoiceLine>
      <isdoc:ID>${index + 1}</isdoc:ID>
      <isdoc:InvoicedQuantity>${item.quantity || '1'}</isdoc:InvoicedQuantity>
      <isdoc:LineExtensionAmount>${item.total || totalAmount}</isdoc:LineExtensionAmount>
      <isdoc:Item>
        <isdoc:Name>${item.description || 'Služby'}</isdoc:Name>
      </isdoc:Item>
      <isdoc:Price>
        <isdoc:PriceAmount>${item.price || totalAmount}</isdoc:PriceAmount>
      </isdoc:Price>
    </isdoc:InvoiceLine>`).join('') : 
    `<isdoc:InvoiceLine>
      <isdoc:ID>1</isdoc:ID>
      <isdoc:InvoicedQuantity>1</isdoc:InvoicedQuantity>
      <isdoc:LineExtensionAmount>${totalAmount}</isdoc:LineExtensionAmount>
      <isdoc:Item>
        <isdoc:Name>Služby</isdoc:Name>
      </isdoc:Item>
      <isdoc:Price>
        <isdoc:PriceAmount>${totalAmount}</isdoc:PriceAmount>
      </isdoc:Price>
    </isdoc:InvoiceLine>`
    }
  </isdoc:InvoiceLines>
  
  <isdoc:LegalMonetaryTotal>
    <isdoc:LineExtensionAmount>${totalAmount}</isdoc:LineExtensionAmount>
    <isdoc:TaxExclusiveAmount>${totalAmount}</isdoc:TaxExclusiveAmount>
    <isdoc:TaxInclusiveAmount>${totalAmount}</isdoc:TaxInclusiveAmount>
    <isdoc:PayableAmount>${totalAmount}</isdoc:PayableAmount>
  </isdoc:LegalMonetaryTotal>
  
  <isdoc:PaymentMeans>
    <isdoc:ID>1</isdoc:ID>
    <isdoc:PaymentMeansCode>1</isdoc:PaymentMeansCode>
    <isdoc:PayeeFinancialAccount>
      <isdoc:ID>${bankAccount}</isdoc:ID>
      <isdoc:FinancialInstitutionBranch>
        <isdoc:ID>${swift}</isdoc:ID>
      </isdoc:FinancialInstitutionBranch>
    </isdoc:PayeeFinancialAccount>
  </isdoc:PaymentMeans>
  
  <isdoc:PaymentTerms>
    <isdoc:Note>Datum splatnosti: ${dueDate}</isdoc:Note>
    <isdoc:Note>Variabilní symbol: ${variableSymbol}</isdoc:Note>
    <isdoc:Note>Konstantní symbol: ${constantSymbol}</isdoc:Note>
  </isdoc:PaymentTerms>
  
  <isdoc:AdditionalDocumentReference>
    <isdoc:ID>${invoiceNumber}</isdoc:ID>
    <isdoc:DocumentTypeCode>130</isdoc:DocumentTypeCode>
  </isdoc:AdditionalDocumentReference>
</isdoc:Invoice>`;

      console.log('✅ ISDOC XML контент створено!');
      console.log('📄 Розмір контенту:', isdocContent.length, 'символів');
      console.log('📄 Перші 200 символів:', isdocContent.substring(0, 200));

      // Create and download ISDOC file (same as in InvoicePreviewModal)
      const blob = new Blob([isdocContent], { type: 'application/xml; charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `faktura_${invoiceNumber}.isdoc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('✅ ISDOC файл успішно збережено як:', `faktura_${invoiceNumber}.isdoc`);
      console.log('📦 Розмір blob:', blob.size, 'байт');
      console.log('=== КІНЕЦЬ ГЕНЕРАЦІЇ ISDOC ===');
      alert('ISDOC файл успішно згенеровано та завантажено!');
      
    } catch (error) {
      console.error('❌ Помилка при генерації ISDOC:', error);
      alert('Помилка при генерації ISDOC: ' + (error instanceof Error ? error.message : 'Невідома помилка'));
    }
  };

  const handleDownloadPDF = () => {
    generatePDF();
  };

  const handleSend = async () => {
    // Змінити статус фактури на "sent" (відправлено)
    if (!invoice?.id) return;
    
    try {
      const result = await updateInvoiceStatus(invoice.id, 'sent');
      if (result.success) {
        alert('Фактура успішно відмічена як відправлена!');
      } else {
        alert('Помилка при оновленні статусу фактури');
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('Помилка при оновленні статусу фактури');
    }
  };

  const handleRecordPayment = () => {
    // Відкрити модальне вікно для запису платежу
    setShowPaymentModal(true);
  };

  const handleEdit = () => {
    // Відкрити модальне вікно редагування фактури
    setShowEditModal(true);
  };

  const handlePrint = () => {
    generateISDOC();
  };

  const handleAddNote = () => {
    console.log('Adding private note...');
  };

  const handleDuplicate = async () => {
    // Дублювати фактуру
    if (!invoice) return;
    
    if (!confirm('Chcete vytvořit kopii této faktury?')) {
      setIsMoreMenuOpen(false);
      return;
    }
    
    try {
      // Створюємо нову фактуру з тими самими даними
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const day = String(new Date().getDate()).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const newInvoiceNumber = `INV-${year}${month}${day}-${random}`;
      
      const duplicatedInvoice = {
        invoiceNumber: newInvoiceNumber,
        date: new Date().toISOString(),
        dueDate: (() => {
          const date = new Date();
          date.setDate(date.getDate() + 14);
          return date.toISOString();
        })(),
        customer: invoice.customer,
        items: invoice.items.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        })),
        total: invoice.total,
        status: 'draft' as const
      };
      
      const result = await addInvoice(duplicatedInvoice);
      
      if (result.success) {
        alert('Faktura byla úspěšně zkopírována!');
        router.push(`/faktury/${newInvoiceNumber}`);
      } else {
        alert('Chyba při kopírování faktury');
      }
    } catch (error) {
      console.error('Error duplicating invoice:', error);
      alert('Chyba při kopírování faktury');
    }
    
    setIsMoreMenuOpen(false);
  };

  const handleCancel = async () => {
    // Скасувати фактуру (змінити статус на overdue/cancelled)
    if (!invoice?.id) return;
    
    if (confirm('Opravdu chcete stornovat tuto fakturu? Bude označena jako stornovaná.')) {
      try {
        // Змінюємо статус на overdue (можна використати як "stornováno")
        const result = await updateInvoice(invoice.id, { 
          status: 'overdue' as const,
          // Можна додати поле notes для позначення
        });
        
        if (result.success) {
          alert('Faktura byla úspěšně stornována!');
        } else {
          alert('Chyba při stornování faktury');
        }
      } catch (error) {
        console.error('Error cancelling invoice:', error);
        alert('Chyba při stornování faktury');
      }
    }
    
    setIsMoreMenuOpen(false);
  };

  const handleCreateTemplate = async () => {
    // Створити шаблон з цієї фактури
    if (!invoice) return;
    
    if (!confirm('Chcete vytvořit šablonu z této faktury?')) {
      setIsMoreMenuOpen(false);
      return;
    }
    
    try {
      // Зберігаємо шаблон у localStorage
      const template = {
        id: `template-${Date.now()}`,
        name: `Šablona - ${invoice.customer}`,
        customer: invoice.customer,
        items: invoice.items,
        createdAt: new Date().toISOString()
      };
      
      // Отримуємо існуючі шаблони
      const existingTemplates = localStorage.getItem('invoice-templates');
      const templates = existingTemplates ? JSON.parse(existingTemplates) : [];
      
      // Додаємо новий шаблон
      templates.push(template);
      localStorage.setItem('invoice-templates', JSON.stringify(templates));
      
      alert('Šablona byla úspěšně vytvořena!');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Chyba při vytváření šablony');
    }
    
    setIsMoreMenuOpen(false);
  };

  const handleCreateRecurring = async () => {
    // Створити повторювану фактуру
    if (!invoice) return;
    
    // Відкриваємо prompt для введення періодичності
    const period = prompt('Každých kolik dní vytvářet novou fakturu? (např. 30 pro měsíční)', '30');
    
    if (!period || isNaN(Number(period))) {
      setIsMoreMenuOpen(false);
      return;
    }
    
    try {
      // Зберігаємо правило повторення у localStorage
      const recurringRule = {
        id: `recurring-${Date.now()}`,
        invoiceId: invoice.id,
        customer: invoice.customer,
        items: invoice.items,
        total: invoice.total,
        periodDays: Number(period),
        nextDate: (() => {
          const date = new Date();
          date.setDate(date.getDate() + Number(period));
          return date.toISOString();
        })(),
        active: true,
        createdAt: new Date().toISOString()
      };
      
      // Отримуємо існуючі правила
      const existingRules = localStorage.getItem('recurring-invoices');
      const rules = existingRules ? JSON.parse(existingRules) : [];
      
      // Додаємо нове правило
      rules.push(recurringRule);
      localStorage.setItem('recurring-invoices', JSON.stringify(rules));
      
      alert(`Pravidelná faktura byla vytvořena! Nová faktura bude automaticky vytvořena každých ${period} dní.`);
    } catch (error) {
      console.error('Error creating recurring invoice:', error);
      alert('Chyba při vytváření pravidelné faktury');
    }
    
    setIsMoreMenuOpen(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
    setIsMoreMenuOpen(false);
  };

  const confirmDelete = async () => {
    if (!invoice?.id) return;
    
    try {
      const result = await deleteInvoiceFromContext(invoice.id);
      if (result.success) {
        console.log('✅ Invoice deleted successfully');
        setShowDeleteConfirm(false);
        router.push('/faktury');
      } else {
        console.error('❌ Failed to delete invoice:', result.error);
        alert('Помилка при видаленні фактури');
      }
    } catch (error) {
      console.error('❌ Error deleting invoice:', error);
      alert('Помилка при видаленні фактури');
    }
  };
  
  const confirmPayment = async () => {
    if (!invoice?.id) return;
    
    try {
      const result = await updateInvoiceStatus(invoice.id, 'paid');
      if (result.success) {
        alert('Платіж успішно записано!');
        setShowPaymentModal(false);
      } else {
        alert('Помилка при записі платежу');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Помилка при записі платежу');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Sidebar />

      {/* Main Content */}
      <div className="ml-16 min-h-screen flex flex-col">
        {/* Top Bar */}
        <div className="bg-gray-800/50 border-b border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <h1 className="text-xl font-semibold">Faktura {invoiceData.invoiceNumber}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="flex-1 p-6 bg-black">
          <div className="w-full">
            {/* Main Content */}
            <div>
                {/* All Action Buttons - Single Row - Responsive */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-6 lg:space-x-8">
                      <div 
                        onClick={handleWebfaktura}
                        className="flex flex-col items-center space-y-1 md:space-y-2 cursor-pointer hover:text-money transition-colors group"
                      >
                        <FileTextIcon className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-300 group-hover:text-money transition-colors" />
                        <span className="text-xs md:text-sm text-gray-400 group-hover:text-money transition-colors hidden sm:block">Webfaktura</span>
                      </div>
                      
                      <div 
                        onClick={handleDownloadPDF}
                        className="flex flex-col items-center space-y-1 md:space-y-2 cursor-pointer hover:text-money transition-colors group"
                      >
                        <Download className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-300 group-hover:text-money transition-colors" />
                        <span className="text-xs md:text-sm text-gray-400 group-hover:text-money transition-colors">PDF</span>
                      </div>
                      
                      <div 
                        onClick={handlePrint}
                        className="flex flex-col items-center space-y-1 md:space-y-2 cursor-pointer hover:text-money transition-colors group"
                      >
                        <Download className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-300 group-hover:text-money transition-colors" />
                        <span className="text-xs md:text-sm text-gray-400 group-hover:text-money transition-colors hidden sm:block">ISDOC</span>
                      </div>
                      
                      <div 
                        onClick={() => setShowSendModal(true)}
                        className="flex flex-col items-center space-y-1 md:space-y-2 cursor-pointer hover:text-money transition-colors group"
                      >
                        <Send className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-300 group-hover:text-money transition-colors" />
                        <span className="text-xs md:text-sm text-gray-400 group-hover:text-money transition-colors">Poslat</span>
                      </div>
                      
                      <div 
                        onClick={handleRecordPayment}
                        className="flex flex-col items-center space-y-1 md:space-y-2 cursor-pointer hover:text-money transition-colors group md:pt-5"
                      >
                        <CheckCircle className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-300 group-hover:text-money transition-colors" />
                        <div className="text-xs md:text-sm text-gray-400 group-hover:text-money transition-colors text-center">
                          <div className="hidden sm:block">Zaznamenat</div>
                          <div className="hidden sm:block">platbu</div>
                          <div className="sm:hidden">Platba</div>
                        </div>
                      </div>
                      
                      <div 
                        onClick={handleEdit}
                        className="flex flex-col items-center space-y-1 md:space-y-2 cursor-pointer hover:text-money transition-colors group"
                      >
                        <Edit className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-300 group-hover:text-money transition-colors" />
                        <span className="text-xs md:text-sm text-gray-400 group-hover:text-money transition-colors">Upravit</span>
                      </div>
                      
                      <div className="relative" ref={moreMenuRef}>
                        <div 
                          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                          className="flex flex-col items-center space-y-1 md:space-y-2 cursor-pointer hover:text-money transition-colors group"
                        >
                          <MoreHorizontal className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-300 group-hover:text-money transition-colors" />
                          <span className="text-xs md:text-sm text-gray-400 group-hover:text-money transition-colors">Více</span>
                        </div>
                        
                        {/* Dropdown Menu */}
                        {isMoreMenuOpen && (
                          <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 rounded-lg shadow-lg border border-gray-700 z-50">
                            <div className="py-2">
                              <button 
                                onClick={handleDuplicate}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-money transition-colors"
                              >
                                <Layers className="w-4 h-4 text-money" />
                                <span>Duplikovat</span>
                              </button>
                              
                              <button 
                                onClick={handleCancel}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-money transition-colors"
                              >
                                <FileX className="w-4 h-4 text-money" />
                                <span>Stornovat</span>
                              </button>
                              
                              <button 
                                onClick={handleCreateTemplate}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-money transition-colors"
                              >
                                <FileTextIcon className="w-4 h-4 text-money" />
                                <span>Vytvořit šablonu</span>
                              </button>
                              
                              <button 
                                onClick={handleCreateRecurring}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-money transition-colors"
                              >
                                <Repeat className="w-4 h-4 text-money" />
                                <span>Vytvořit pravidelnou fakturu</span>
                              </button>
                              
                              <div className="border-t border-gray-700 my-1"></div>
                              
                              <button 
                                onClick={handleDelete}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-left text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                                <span>Smazat</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    

                  </div>
                </div>

                {/* Invoice Preview - Dark theme for screen */}
                <div id="invoice-screen-preview" className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                  {/* Invoice Header */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h2 className="text-3xl font-bold text-white">
                            Faktura {invoiceData.invoiceNumber}
                          </h2>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-gray-700 text-white text-sm font-medium rounded border border-gray-600">
                              Vystavená {invoiceData.issueDate}
                            </span>
                          </div>
                          <span className="px-3 py-1 bg-gray-700 text-white text-sm font-medium rounded border border-gray-600">
                            Splatná za 14 dní
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-8 mb-6">
                      {/* Customer Info */}
                      <div>
                        <h3 className="font-semibold text-white mb-3">Odběratel</h3>
                        <div className="space-y-1 text-gray-300">
                          <div className="font-medium underline cursor-pointer text-blue-400 hover:text-blue-300">{invoiceData.customer}</div>
                          <div>{invoiceData.customerAddress}</div>
                          <div>{invoiceData.customerCity}</div>
                          <div className="text-sm text-gray-400">IČO {invoiceData.customerICO}</div>
                          <div className="text-sm text-gray-400">DIČ CZ{invoiceData.customerICO}</div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div>
                        <h3 className="font-semibold text-white mb-3">Důležité termíny</h3>
                        <div className="space-y-2 text-gray-300">
                          <div>
                            <span className="font-medium">Vystavení:</span> <span className="font-bold">{invoiceData.issueDate}</span>
                          </div>
                          <div>
                            <span className="font-medium">Splatnost:</span> <span className="font-bold">{invoiceData.dueDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Symbols and Creator */}
                      <div>
                        <h3 className="font-semibold text-white mb-3">Detaily</h3>
                        <div className="space-y-2 text-gray-300">
                          <div>
                            <span className="font-medium">Variabilní symbol:</span> <span className="font-bold">{invoiceData.variableSymbol}</span>
                          </div>
                          <div>
                            <span className="font-medium">Vystavil:</span> <span className="underline cursor-pointer text-green-400 font-semibold">{invoiceData.ownerName}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="font-semibold text-white mb-4">Položky faktury</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="text-gray-300">{invoiceData.items[0].description}</div>
                          <div className="text-right">
                            <div className="font-semibold text-white">CENA</div>
                            <div className="text-lg font-bold text-money">{invoiceData.totalAmount} {invoiceData.currency}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t-2 border-gray-700 mt-6 pt-4">
                      <div className="flex justify-end">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-money">
                            {invoiceData.totalAmount} {invoiceData.currency}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hidden Invoice for PDF generation - Light theme */}
                <div className="absolute -left-[9999px]">
                  <div id="invoice-content" className="bg-white shadow-lg mx-auto print-page relative" style={{ 
                    width: '210mm', 
                    minHeight: '297mm', 
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    padding: '12mm 5mm',
                    lineHeight: '1.2',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    
                    {/* Main content wrapper - flex-grow to push footer down */}
                    <div style={{ flexGrow: 1 }}>
                    
                    {/* Top section - Header - Unified layout */}
                    <div className="mb-6" style={{ marginLeft: '0mm', marginTop: '4mm' }}>
                      {/* Invoice title and supplier info in one row */}
                      <div className="flex justify-between items-start mb-3">
                        {/* Left - Supplier info (DODAVATEL) */}
                        <div style={{ width: '48%', marginLeft: '0mm', marginTop: '-5mm' }}>
                          {/* Invoice title - Moved to left side */}
                          <div className="mb-1" style={{ marginTop: '-25px' }}>
                            <h1 className="font-bold text-black" style={{ fontSize: '16pt' }}>Faktura <span className="text-gray-600" style={{ fontSize: '14pt' }}>{invoiceData.invoiceNumber}</span></h1>
                          </div>
                          <div className="border-t border-black mb-2" style={{ marginTop: '10px' }}></div>
                          <div className="font-bold text-black mb-2" style={{ fontSize: '12pt' }}>DODAVATEL</div>
                          <div className="font-bold text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData.ownerName}</div>
                          <div className="text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData.supplierAddress}</div>
                          <div className="text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData.supplierCity}</div>
                          <div className="text-black mb-1" style={{ fontSize: '11pt' }}>Česká republika</div>
                          <div className="text-black mb-1" style={{ fontSize: '11pt' }}>IČO: {invoiceData.supplierICO}</div>
                          
                          {/* Dates - Moved lower with 2 line spacing and bold */}
                          <div className="text-black mb-1 mt-4" style={{ fontSize: '11pt' }}><strong>Datum vystavení: {invoiceData.issueDate}</strong></div>
                          <div className="text-black" style={{ fontSize: '11pt' }}><strong>Datum splatnosti: {invoiceData.dueDate}</strong></div>
                        </div>
                        
                        {/* Right - Customer info (ODBĚRATEL) */}
                        <div style={{ width: '48%', marginLeft: '25mm' }}>
                          {/* ISDOC Logo - Moved to right side */}
                          <div className="text-right mb-1" style={{ marginTop: '-35px' }}>
                            <div className="flex items-center gap-1 justify-end">
                              <div className="w-3 h-3 rounded-sm flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
                                <div className="flex items-center justify-center gap-0.5">
                                  <div className="w-0.5 h-0.5 rounded-sm" style={{ backgroundColor: '#ffffff' }}></div>
                                  <div className="w-0.5 h-0.5 rounded-sm" style={{ backgroundColor: '#ffffff' }}></div>
                                  <div className="w-0.5 h-0.5 rounded-sm" style={{ backgroundColor: '#ffffff' }}></div>
                                </div>
                              </div>
                              <span className="font-bold text-xs" style={{ color: '#000000' }}>ISDOC</span>
                            </div>
                          </div>
                          
                          {/* Customer info */}
                          <div className="border-t border-black mb-2" style={{ marginTop: '10px' }}></div>
                          <div className="font-bold text-black mb-2" style={{ fontSize: '12pt' }}>ODBĚRATEL</div>
                          <div className="font-bold text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData.customer}</div>
                          <div className="text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData.customerAddress}</div>
                          <div className="text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData.customerCity}</div>
                          <div className="text-black mb-1" style={{ fontSize: '11pt' }}>Česká republika</div>
                          <div className="text-black mb-1" style={{ fontSize: '11pt' }}>IČO: {invoiceData.customerICO}</div>
                          <div className="text-black mb-1" style={{ fontSize: '11pt' }}>DIČ: CZ{invoiceData.customerICO}</div>
                        </div>
                      </div>
                    </div>

                    {/* Payment section - Light green background */}
                    <div className="mb-6 relative" style={{ marginLeft: '0mm' }}>
                      <div style={{ backgroundColor: '#90EE90', padding: '6mm', minHeight: '24mm', maxWidth: '85%' }}>
                        <div className="grid grid-cols-3 gap-8 text-black" style={{ alignItems: 'start' }}>
                          {/* Bank details - More space */}
                          <div style={{ width: '35%' }}>
                            <div style={{ fontSize: '11.4pt', whiteSpace: 'nowrap' }}>Bankovní účet</div>
                            <div className="font-bold mb-1" style={{ fontSize: '9.9pt', marginTop: '8px' }}>{invoiceData.bankAccount}</div>
                            <div className="font-bold mb-1" style={{ fontSize: '9.9pt', whiteSpace: 'nowrap' }}>IBAN: {invoiceData.iban}</div>
                            <div className="font-bold" style={{ fontSize: '9.9pt', whiteSpace: 'nowrap' }}>SWIFT: {invoiceData.swift}</div>
                          </div>
                          
                          {/* Symbols - Moved to the right */}
                          <div style={{ width: '30%', marginLeft: '60px' }}>
                            <div style={{ fontSize: '11pt' }}>Symbol</div>
                            <div style={{ fontSize: '11pt', whiteSpace: 'nowrap', marginTop: '6px' }}>variabilní: <span className="font-bold">{invoiceData.variableSymbol}</span></div>
                            <div style={{ fontSize: '11pt', whiteSpace: 'nowrap', marginTop: '6px' }}>konstantní: <span className="font-bold">{invoiceData.constantSymbol}</span></div>
                          </div>
                          
                          {/* Payment method and amount */}
                          <div style={{ width: '35%', marginLeft: '20px' }}>
                            <div style={{ fontSize: '9.9pt', whiteSpace: 'nowrap' }}>Způsob platby: {invoiceData.paymentMethod}</div>
                            <div style={{ fontSize: '9.9pt', whiteSpace: 'nowrap', marginTop: '24px' }}>K úhradě:</div>
                            <div className="font-bold" style={{ fontSize: '13.2pt', whiteSpace: 'nowrap', marginTop: '4px' }}>{invoiceData.totalAmount} {invoiceData.currency}</div>
                          </div>
                        </div>
                      </div>

                      {/* QR Code - Positioned to align with top of green block */}
                      <div className="absolute top-0 right-0" style={{ transform: 'translateX(10px)' }}>
                        <div className="text-center">
                          <div className="w-30 h-30 bg-white border border-gray-400 mx-auto flex items-center justify-center">
                            {qrCodeDataUrl ? (
                              <img 
                                src={qrCodeDataUrl} 
                                alt="QR Platba" 
                                className="w-full h-full object-contain"
                                style={{ maxWidth: '112px', maxHeight: '112px' }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                Loading...
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-black font-bold mt-1">QR Platba+F</div>
                        </div>
                      </div>
                    </div>

                    {/* Services section header */}
                    <div className="mb-4" style={{ marginLeft: '0mm' }}>
                      <div className="font-bold text-black" style={{ fontSize: '12pt' }}>Fakturujeme Vám za dodané zboží či služby:</div>
                    </div>

                    {/* Services table */}
                    <div className="mb-4" style={{ marginLeft: '0mm' }}>
                      <table className="w-full border-collapse" style={{ border: '0.5pt solid #666666' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#F5F5F5', height: '8mm' }}>
                            <th className="text-left py-2 px-3 font-bold text-black border-r border-gray-400 border-b border-gray-400" style={{ fontSize: '11pt' }}>Označení dodávky</th>
                            <th className="text-center py-2 px-3 font-bold text-black border-r border-gray-400 border-b border-gray-400" style={{ width: '15%', fontSize: '11pt' }}>Počet</th>
                            <th className="text-center py-2 px-3 font-bold text-black border-r border-gray-400 border-b border-gray-400" style={{ width: '10%', fontSize: '11pt' }}>m. j.</th>
                            <th className="text-right py-2 px-3 font-bold text-black border-r border-gray-400 border-b border-gray-400" style={{ width: '20%', fontSize: '11pt' }}>Cena za m.j.</th>
                            <th className="text-right py-2 px-3 font-bold text-black border-b border-gray-400" style={{ width: '20%', fontSize: '11pt' }}>Celkem</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceData.items.map((item, index) => (
                            <tr key={index} style={{ minHeight: '20mm' }}>
                              <td className="py-3 px-3 text-black border-r border-gray-400 border-b border-gray-400 align-top" style={{ lineHeight: '1.2', fontSize: '10pt', whiteSpace: 'pre-wrap' }}>
                                {item.description}
                              </td>
                              <td className="text-center py-3 px-3 text-black border-r border-gray-400 border-b border-gray-400 align-top" style={{ fontSize: '10pt' }}>{item.quantity}</td>
                              <td className="text-center py-3 px-3 text-black border-r border-gray-400 border-b border-gray-400 align-top" style={{ fontSize: '10pt' }}>{item.unit}</td>
                              <td className="text-right py-3 px-3 text-black border-r border-gray-400 border-b border-gray-400 align-top" style={{ fontSize: '10pt' }}>{item.price}</td>
                              <td className="text-right py-3 px-3 text-black align-top font-bold border-b border-gray-400" style={{ fontSize: '10pt' }}>{item.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Note */}
                    <div className="mb-8" style={{ marginLeft: '0mm' }}>
                      <div className="text-black" style={{ lineHeight: '1.2', fontSize: '9pt' }}>
                        Dovolujeme si Vás upozornit, že v případě nedodržení data splatnosti uvedeného na faktuře Vám můžeme účtovat zákonný úrok z prodlení.
                      </div>
                    </div>

                    {/* Final total section */}
                    <div className="mb-8" style={{ backgroundColor: '#90EE90', padding: '6mm', minHeight: '12mm', maxWidth: '85%', marginLeft: '0mm' }}>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-black" style={{ fontSize: '14pt' }}>Celkem k úhradě:</div>
                        <div className="font-bold text-black" style={{ fontSize: '16pt' }}>{invoiceData.totalAmount} {invoiceData.currency}</div>
                      </div>
                    </div>
                    
                    </div>
                    {/* End of main content wrapper */}

                    {/* Footer - pushed to bottom with marginTop: auto */}
                    <div className="text-center border-t border-gray-400 pt-3" style={{ marginTop: 'auto', marginLeft: '0mm' }}>
                      <div className="flex justify-between items-center text-gray-600 px-4" style={{ fontSize: '9pt', width: '100%' }}>
                        <div>Vytiskl(a): {invoiceData.ownerName}, {new Date().toLocaleDateString('cs-CZ')}</div>
                        <div>Vystaveno v online fakturační službě faktix www.faktix.cz</div>
                        <div>Strana 1/1</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End of hidden PDF element */}


              </div>
            </div>
          </div>
      </div>



      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-900/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Smazat fakturu</h3>
                <p className="text-gray-400 text-sm">Tato akce je nevratná</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Opravdu chcete smazat fakturu <span className="font-semibold text-white">{invoiceData.invoiceNumber}</span>? 
              Tato akce se nedá vrátit zpět.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Smazat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Zaznamenat platbu</h3>
                <p className="text-gray-400 text-sm">Faktura bude označena jako zaplacená</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Opravdu chcete zaznamenat platbu pro fakturu <span className="font-semibold text-white">{invoiceData.invoiceNumber}</span>?
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={confirmPayment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Zaznamenat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal 
        isOpen={showWebfakturaModal}
        onClose={() => setShowWebfakturaModal(false)}
        invoiceData={{
          invoiceNumber: invoiceData.invoiceNumber,
          issueDate: invoiceData.issueDate,
          dueDate: invoiceData.dueDate,
          customer: invoiceData.customer,
          customerAddress: invoiceData.customerAddress,
          customerCity: invoiceData.customerCity,
          customerICO: invoiceData.customerICO,
          ownerName: invoiceData.ownerName,
          supplierAddress: invoiceData.supplierAddress,
          supplierCity: invoiceData.supplierCity,
          supplierICO: invoiceData.supplierICO,
          totalAmount: invoiceData.totalAmount,
          currency: invoiceData.currency,
          variableSymbol: invoiceData.variableSymbol,
          constantSymbol: invoiceData.constantSymbol,
          bankAccount: invoiceData.bankAccount,
          iban: invoiceData.iban,
          swift: invoiceData.swift,
          paymentMethod: invoiceData.paymentMethod,
          items: invoiceData.items
        }}
      />

      {/* Edit Invoice Modal */}
      <NewInvoiceModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        editInvoiceId={invoice?.id || invoiceId}
      />

      {/* Send Invoice Modal */}
      {invoice && (
        <SendInvoiceModal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          invoice={invoice}
          onSuccess={() => {
            updateInvoiceStatus(invoice.id, 'sent');
          }}
        />
      )}
    </div>
  );
} 