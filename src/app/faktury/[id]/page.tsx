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

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params?.id as string;
  const { getInvoiceByNumber } = useInvoices();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  
  // Отримуємо дані фактури з контексту
  const invoice = getInvoiceByNumber(invoiceId);
  
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
    customerAddress: '',
    customerCity: '',
    customerICO: '',
    ownerName: '',
    supplierAddress: 'Technologická 377/8',
    supplierCity: '708 00 Ostrava - Poruba',
    supplierICO: '10754466',
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
    // Open webfaktura
    console.log('Opening webfaktura...');
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
    const originalColors: string[] = [];
    
    try {
      console.log('🔄 Починаємо конвертацію в canvas...');
      
      // Тимчасово замінюємо проблемні кольори
      const allElements = invoiceElement.querySelectorAll('*');
      
      allElements.forEach((el, index) => {
        const style = window.getComputedStyle(el);
        if (style.color.includes('oklch') || style.backgroundColor.includes('oklch')) {
          originalColors[index] = (el as HTMLElement).style.cssText;
          (el as HTMLElement).style.setProperty('color', '#000000', 'important');
          (el as HTMLElement).style.setProperty('background-color', '#ffffff', 'important');
        }
      });
      
      // Конвертуємо HTML в canvas (same as in InvoicePreviewModal)
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
        ignoreElements: (el) => {
          // Ігноруємо елементи з проблемними стилями
          const style = window.getComputedStyle(el);
          return style.color.includes('oklch') || style.backgroundColor.includes('oklch');
        }
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
      
      // Відновлюємо оригінальні кольори елементів
      const allElements = invoiceElement.querySelectorAll('*');
      allElements.forEach((el, index) => {
        if (originalColors[index]) {
          (el as HTMLElement).style.cssText = originalColors[index];
        }
      });
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

  const handleSend = () => {
    // Перенаправлення на сторінку відправки фактури
    router.push(`/faktury/${invoiceId}/odeslat`);
  };

  const handleRecordPayment = () => {
    console.log('Recording payment...');
  };

  const handleEdit = () => {
    console.log('Editing invoice...');
  };

  const handlePrint = () => {
    generateISDOC();
  };

  const handleAddNote = () => {
    console.log('Adding private note...');
  };

  const handleDuplicate = () => {
    console.log('Duplicating invoice...');
    setIsMoreMenuOpen(false);
  };

  const handleCancel = () => {
    console.log('Cancelling invoice...');
    setIsMoreMenuOpen(false);
  };

  const handleCreateTemplate = () => {
    console.log('Creating template...');
    setIsMoreMenuOpen(false);
  };

  const handleCreateRecurring = () => {
    console.log('Creating recurring invoice...');
    setIsMoreMenuOpen(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
    setIsMoreMenuOpen(false);
  };

  const confirmDelete = () => {
    console.log('Deleting invoice...');
    setShowDeleteConfirm(false);
    // Тут можна додати логіку видалення
    router.push('/faktury');
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const getFlagIcon = (language: string) => {
    switch (language) {
      case 'cs':
        return '🇨🇿'; // Czech flag
      case 'sk':
        return '🇸🇰'; // Slovak flag
      case 'en':
        return '🇺🇸'; // US flag
      case 'uk':
        return '🇺🇦'; // Ukrainian flag
      default:
        return '🇨🇿'; // Default to Czech
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex">
              <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 ml-0">
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
                {/* All Action Buttons - Single Row */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <div 
                        onClick={handleWebfaktura}
                        className="flex flex-col items-center space-y-2 cursor-pointer hover:text-money transition-colors group"
                      >
                        <FileTextIcon className="w-8 h-8 text-gray-300 group-hover:text-money transition-colors" />
                        <span className="text-sm text-gray-400 group-hover:text-money transition-colors">Webfaktura</span>
                      </div>
                      
                      <div 
                        onClick={handleDownloadPDF}
                        className="flex flex-col items-center space-y-2 cursor-pointer hover:text-money transition-colors group"
                      >
                        <Download className="w-8 h-8 text-gray-300 group-hover:text-money transition-colors" />
                        <span className="text-sm text-gray-400 group-hover:text-money transition-colors">PDF</span>
                      </div>
                      
                      <div 
                        onClick={handlePrint}
                        className="flex flex-col items-center space-y-2 cursor-pointer hover:text-money transition-colors group"
                      >
                        <Download className="w-8 h-8 text-gray-300 group-hover:text-money transition-colors" />
                        <span className="text-sm text-gray-400 group-hover:text-money transition-colors">ISDOC</span>
                      </div>
                      
                      <div 
                        onClick={handleSend}
                        className="flex flex-col items-center space-y-2 cursor-pointer hover:text-money transition-colors group"
                      >
                        <Send className="w-8 h-8 text-gray-300 group-hover:text-money transition-colors" />
                        <span className="text-sm text-gray-400 group-hover:text-money transition-colors">Poslat</span>
                      </div>
                      
                      <div 
                        onClick={handleRecordPayment}
                        className="flex flex-col items-center space-y-2 cursor-pointer hover:text-money transition-colors group pt-5"
                      >
                        <CheckCircle className="w-8 h-8 text-gray-300 group-hover:text-money transition-colors" />
                        <div className="text-sm text-gray-400 group-hover:text-money transition-colors text-center">
                          <div>Zaznamenat</div>
                          <div>platbu</div>
                        </div>
                      </div>
                      
                      <div 
                        onClick={handleEdit}
                        className="flex flex-col items-center space-y-2 cursor-pointer hover:text-money transition-colors group"
                      >
                        <Edit className="w-8 h-8 text-gray-300 group-hover:text-money transition-colors" />
                        <span className="text-sm text-gray-400 group-hover:text-money transition-colors">Upravit</span>
                      </div>
                      
                      <div className="relative" ref={moreMenuRef}>
                        <div 
                          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                          className="flex flex-col items-center space-y-2 cursor-pointer hover:text-money transition-colors group"
                        >
                          <MoreHorizontal className="w-8 h-8 text-gray-300 group-hover:text-money transition-colors" />
                          <span className="text-sm text-gray-400 group-hover:text-money transition-colors">Více</span>
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

                {/* Invoice Preview */}
                <div id="invoice-content" className="print-page bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-white">
                  {/* Invoice Header */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h2 className="text-3xl font-bold text-white">
                            Faktura {invoiceData.invoiceNumber}
                          </h2>
                          <span className="text-2xl">{getFlagIcon(invoiceData.language)}</span>
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
    </div>
  );
} 