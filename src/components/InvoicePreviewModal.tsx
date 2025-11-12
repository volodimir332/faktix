"use client";

import React, { useEffect, useState } from 'react';
import { X, Download, Printer, FileText } from 'lucide-react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { fixClonedDocument } from '@/lib/color-fix';

// Function to generate QR Platba code for Czech payments
function generateQRPlatbaCode(invoiceData: InvoicePreviewModalProps['invoiceData']) {
  const {
    iban = 'CZ33 5500 0000 0049 1491 9003',
    totalAmount = '244950.00',
    currency = 'CZK',
    variableSymbol = '20240009',
    constantSymbol = '0308',
    supplierEmail = 'xperementus@gmail.com'
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

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData?: {
    // Supplier info
    supplierEmail?: string;
    supplierAddress?: string;
    supplierCity?: string;
    supplierCountry?: string;
    supplierICO?: string;
    supplierTaxStatus?: string;
    supplierPhone?: string;
    
    // Invoice details
    invoiceNumber?: string;
    activeTab?: string;
    issueDate?: string;
    dueDate?: string;
    
    // Customer info
    customer?: string;
    customerAddress?: string;
    customerCity?: string;
    customerCountry?: string;
    customerICO?: string;
    customerDIC?: string;
    
    // Payment info
    paymentMethod?: string;
    currency?: string;
    totalAmount?: string;
    bankAccount?: string;
    iban?: string;
    swift?: string;
    variableSymbol?: string;
    constantSymbol?: string;
    
    // Items
    items?: Array<{
      description?: string;
      quantity?: string;
      unit?: string;
      price?: string;
      total?: string;
    }>;
    
    // Owner info
    ownerName?: string;
  };
}

export function InvoicePreviewModal({ isOpen, onClose, invoiceData }: InvoicePreviewModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

    // Function to generate PDF
  const generatePDF = async () => {
    console.log('=== ПОЧАТОК ГЕНЕРАЦІЇ PDF ===');
    
    // Get the invoice element from the preview
    const invoiceElement = document.querySelector('.print-page') as HTMLElement;
    
    if (!invoiceElement) {
      console.error('❌ Елемент .print-page не знайдено!');
      return;
    }
    
    console.log('✅ Елемент знайдено!');
    console.log('📏 Розміри:', invoiceElement.offsetWidth, 'x', invoiceElement.offsetHeight);
    console.log('📄 Вміст (символів):', invoiceElement.innerHTML.length);
    
    // Перевіряємо, чи елемент містить контент
    if (invoiceElement.innerHTML.length < 100) {
      console.error('❌ Елемент має занадто мало контенту!');
      return;
    }
    
    try {
      console.log('🔄 Починаємо конвертацію в canvas...');
      console.log('🎨 Використовуємо onclone callback для виправлення oklab...');
      
      // Конвертуємо HTML в canvas з onclone callback
      const canvas = await html2canvas(invoiceElement, {
        scale: 2, // Висока якість
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: invoiceElement.offsetWidth,
        height: invoiceElement.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        logging: true, // Включаємо логи для дебагу
        onclone: (clonedDoc) => {
          console.log('💉 Виправляємо oklab у клонованому документі...');
          fixClonedDocument(clonedDoc);
        }
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
      const filename = `faktura_${invoiceData?.invoiceNumber || '2025-0001'}.pdf`;
      pdf.save(filename);
      
      console.log('✅ PDF успішно збережено як:', filename);
      console.log('=== КІНЕЦЬ ГЕНЕРАЦІЇ PDF ===');
      
    } catch (error) {
      console.error('❌ Помилка при генерації PDF:', error);
    }
  };

  // Function to generate ISDOC
  const generateISDOC = () => {
    console.log('=== ПОЧАТОК ГЕНЕРАЦІЇ ISDOC ===');
    
    try {
      // Prepare data with fallbacks
      const invoiceNumber = invoiceData?.invoiceNumber || '2025-0001';
      const issueDate = invoiceData?.issueDate || '2025-08-01';
      const dueDate = invoiceData?.dueDate || '2025-08-15';
      const supplierName = invoiceData?.ownerName || 'Roman Korol';
      const supplierAddress = invoiceData?.supplierAddress || 'Technologická 377/8';
      const supplierCity = invoiceData?.supplierCity || 'Ostrava - Poruba';
      const supplierICO = invoiceData?.supplierICO || '10754466';
      const customerName = invoiceData?.customer || 'LIVEN s.r.o.';
      const customerAddress = invoiceData?.customerAddress || 'Lihovarská 689/40a';
      const customerCity = invoiceData?.customerCity || 'Ostrava - Kunčičky';
      const customerICO = invoiceData?.customerICO || '10754466';
      const totalAmount = invoiceData?.totalAmount || '244950.00';
      const bankAccount = invoiceData?.bankAccount || '4914919003/5500';
      const iban = invoiceData?.iban || 'CZ33 5500 0000 0049 1491 9003';
      const swift = invoiceData?.swift || 'RZBCCZPP';
      const variableSymbol = invoiceData?.variableSymbol || invoiceData?.invoiceNumber || '20250001';
      const constantSymbol = invoiceData?.constantSymbol || '0308';
      const paymentMethod = invoiceData?.paymentMethod || 'Převodem';
      const currency = invoiceData?.currency || 'CZK';

      console.log('📊 Дані для ISDOC:', {
        invoiceNumber,
        supplierName,
        customerName,
        totalAmount,
        bankAccount
      });

      // Create valid ISDOC XML content according to Czech standard
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
    ${invoiceData?.items && invoiceData.items.length > 0 ? 
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

      // Create and download ISDOC file
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
      
    } catch (error) {
      console.error('❌ Помилка при генерації ISDOC:', error);
    }
  };

  // Function to handle printing
  const handlePrint = () => {
    console.log('=== ПОЧАТОК ДРУКУВАННЯ ===');
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        console.error('❌ Не вдалося відкрити вікно для друкування!');
        return;
      }
      
      // Generate QR code for the invoice
      const qrData = generateQRPlatbaCode(invoiceData);
      
      // Create complete HTML document with the exact same content as PDF
      const printContent = `
        <!DOCTYPE html>
        <html lang="cs">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Faktura - ${invoiceData?.invoiceNumber || '2025-0001'}</title>
            <style>
                @media print {
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 10pt;
                        line-height: 1.2;
                        color: black;
                        background: white;
                    }
                    .print-page {
                        width: 210mm;
                        height: 297mm;
                        margin: 0;
                        padding: 10mm;
                        box-sizing: border-box;
                        background: white;
                        position: relative;
                    }
                    .print-page * {
                        box-sizing: border-box;
                    }
                    .print-page h1, .print-page h2, .print-page h3 {
                        margin: 0;
                        padding: 0;
                    }
                    .print-page .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 20mm;
                    }
                    .print-page .faktura-info {
                        font-size: 18pt;
                        font-weight: bold;
                        margin-top: -25px;
                    }
                    .print-page .isdoc-info {
                        font-size: 8pt;
                        margin-top: -25px;
                        text-align: right;
                    }
                    .print-page .line {
                        border-top: 1px solid black;
                        margin: 10px 0;
                    }
                    .print-page .supplier-customer {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20mm;
                    }
                    .print-page .supplier, .print-page .customer {
                        width: 45%;
                    }
                    .print-page .payment-block {
                        background-color: #28a745;
                        color: white;
                        padding: 8mm;
                        margin: 15mm 0;
                        border-radius: 5mm;
                    }
                    .print-page .payment-block h3 {
                        font-size: 11.4pt;
                        margin-bottom: 5mm;
                    }
                    .print-page .payment-block p {
                        font-size: 9.9pt;
                        margin: 2mm 0;
                        color: white;
                    }
                    .print-page .payment-block .amount {
                        font-size: 13.2pt;
                        font-weight: bold;
                        text-align: center;
                        margin-top: 5mm;
                        color: white;
                    }
                    .print-page .items {
                        margin: 15mm 0;
                    }
                    .print-page .item {
                        display: flex;
                        justify-content: space-between;
                        padding: 3mm 0;
                        border-bottom: 1px solid #ddd;
                    }
                    .print-page .footer {
                        margin-top: 20mm;
                        text-align: center;
                        font-size: 8pt;
                        color: #666;
                    }
                }
                
                /* Screen styles for preview */
                body {
                    font-family: Arial, Helvetica, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .print-page {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 0 auto;
                    padding: 10mm;
                    background: white;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    position: relative;
                }
                .print-page * {
                    box-sizing: border-box;
                }
                .print-page h1, .print-page h2, .print-page h3 {
                    margin: 0;
                    padding: 0;
                }
                .print-page .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 20mm;
                }
                .print-page .faktura-info {
                    font-size: 18pt;
                    font-weight: bold;
                    margin-top: -25px;
                }
                .print-page .isdoc-info {
                    font-size: 8pt;
                    margin-top: -25px;
                    text-align: right;
                }
                .print-page .line {
                    border-top: 1px solid black;
                    margin: 10px 0;
                }
                .print-page .supplier-customer {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20mm;
                }
                .print-page .supplier, .print-page .customer {
                    width: 45%;
                }
                .print-page .payment-block {
                    background-color: #28a745;
                    color: white;
                    padding: 8mm;
                    margin: 15mm 0;
                    border-radius: 5mm;
                }
                .print-page .payment-block h3 {
                    font-size: 11.4pt;
                    margin-bottom: 5mm;
                }
                .print-page .payment-block p {
                    font-size: 9.9pt;
                    margin: 2mm 0;
                    color: white;
                }
                .print-page .payment-block .amount {
                    font-size: 13.2pt;
                    font-weight: bold;
                    text-align: center;
                    margin-top: 5mm;
                    color: white;
                }
                .print-page .items {
                    margin: 15mm 0;
                }
                .print-page .item {
                    display: flex;
                    justify-content: space-between;
                    padding: 3mm 0;
                    border-bottom: 1px solid #ddd;
                }
                .print-page .footer {
                    margin-top: 20mm;
                    text-align: center;
                    font-size: 8pt;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="print-page" style="width: 210mm; min-height: 297mm; font-family: Arial, Helvetica, sans-serif; padding: 12mm 5mm; line-height: 1.2; background: white;">
                <!-- Top section - Header - Unified layout -->
                <div class="mb-6" style="margin-left: 0mm; margin-top: 4mm;">
                    <!-- Invoice title and supplier info in one row -->
                    <div class="flex justify-between items-start mb-3">
                        <!-- Left - Customer info - Moved to align with green section -->
                        <div style="width: 48%; margin-left: 0mm; margin-top: -5mm;">
                            <!-- Invoice title - Moved to left side -->
                            <div class="mb-1" style="margin-top: -25px;">
                                <h1 class="font-bold text-black" style="font-size: 16pt;">Faktura <span class="text-gray-600" style="font-size: 14pt;">${invoiceData?.invoiceNumber || '2025-0001'}</span></h1>
                            </div>
                            <div class="border-t border-black mb-2" style="margin-top: 10px;"></div>
                            <div class="font-bold text-black mb-2" style="font-size: 12pt;">ODBĚRATEL</div>
                            <div class="font-bold text-black mb-1" style="font-size: 11pt;">${invoiceData?.customer || 'LIVEN s.r.o.'}</div>
                            <div class="text-black mb-1" style="font-size: 11pt;">${invoiceData?.customerAddress || 'Lihovarská 689/40a'}</div>
                            <div class="text-black mb-1" style="font-size: 11pt;">${invoiceData?.customerCity || '718 00 Ostrava - Kunčičky'}</div>
                            <div class="text-black mb-1" style="font-size: 11pt;">IČO: ${invoiceData?.customerICO || '10754466'}</div>
                            <div class="text-black mb-1" style="font-size: 11pt;">DIČ: CZ${invoiceData?.customerICO || '10754466'}</div>
                            
                            <!-- Dates - Moved lower with 2 line spacing and bold -->
                            <div class="text-black mb-1 mt-4" style="font-size: 11pt;"><strong>Datum vystavení: ${invoiceData?.issueDate || '01. 08. 2025'}</strong></div>
                            <div class="text-black" style="font-size: 11pt;"><strong>Datum splatnosti: ${invoiceData?.dueDate || '15. 08. 2025'}</strong></div>
                        </div>
                        
                        <!-- Right - Invoice title and supplier info - Moved to align with green section -->
                        <div style="width: 48%; margin-left: 25mm;">
                            <!-- ISDOC Logo - Moved to right side -->
                            <div class="text-right mb-1" style="margin-top: -35px;">
                                <div class="flex items-center gap-1 justify-end">
                                    <div class="w-3 h-3 bg-green-500 rounded-sm flex items-center justify-center">
                                        <div class="flex items-center justify-center gap-0.5">
                                            <div class="w-0.5 h-0.5 bg-white rounded-sm"></div>
                                            <div class="w-0.5 h-0.5 bg-white rounded-sm"></div>
                                            <div class="w-0.5 h-0.5 bg-white rounded-sm"></div>
                                        </div>
                                    </div>
                                    <span class="font-bold text-black text-xs">ISDOC</span>
                                </div>
                            </div>
                            
                            <!-- Supplier info - Lowered by 2 pixels -->
                            <div class="border-t border-black mb-2" style="margin-top: 10px;"></div>
                            <div class="font-bold text-black mb-2" style="font-size: 12pt;">DODAVATEL</div>
                            <div class="font-bold text-black mb-1" style="font-size: 11pt;">${invoiceData?.ownerName || 'Roman Korol'}</div>
                            <div class="text-black mb-1" style="font-size: 11pt;">${invoiceData?.supplierAddress || 'Technologická 377/8'}</div>
                            <div class="text-black mb-1" style="font-size: 11pt;">${invoiceData?.supplierCity || '708 00 Ostrava - Poruba'}</div>
                            <div class="text-black mb-1" style="font-size: 11pt;">IČO: ${invoiceData?.supplierICO || '10754466'}</div>
                            <div class="text-black mb-1" style="font-size: 11pt;">DIČ: CZ${invoiceData?.supplierICO || '10754466'}</div>
                        </div>
                    </div>
                </div>

                <!-- Payment section - Light green background -->
                <div class="mb-6 relative" style="margin-left: 0mm;">
                    <div style="background-color: #90EE90; padding: 6mm; min-height: 24mm; max-width: 85%;">
                        <div class="grid grid-cols-3 gap-8 text-black" style="align-items: start;">
                            <!-- Bank details - More space -->
                            <div style="width: 35%;">
                                <div style="font-size: 11.4pt; white-space: nowrap;">Bankovní účet</div>
                                <div class="font-bold mb-1" style="font-size: 9.9pt; margin-top: 8px;">${invoiceData?.bankAccount || '4914919003/5500'}</div>
                                <div class="font-bold mb-1" style="font-size: 9.9pt; white-space: nowrap;">IBAN: ${invoiceData?.iban || 'CZ33 5500 0000 0049 1491 9003'}</div>
                                <div class="font-bold" style="font-size: 9.9pt; white-space: nowrap;">SWIFT: ${invoiceData?.swift || 'RZBCCZPP'}</div>
                            </div>
                            
                            <!-- Symbols - Moved to the right -->
                            <div style="width: 30%; margin-left: 60px;">
                                <div style="font-size: 11pt; margin-bottom: 8px;">Symbol</div>
                                <div class="font-bold mb-1" style="font-size: 11pt;">variabilní: ${invoiceData?.variableSymbol || invoiceData?.invoiceNumber || '20250001'}</div>
                                <div class="font-bold" style="font-size: 11pt;">konstantní: ${invoiceData?.constantSymbol || '0308'}</div>
                            </div>
                            
                            <!-- Payment method and amount -->
                            <div style="width: 35%; margin-left: 60px;">
                                <div style="font-size: 9.9pt; margin-bottom: 8px;">Způsob platby</div>
                                <div class="font-bold mb-1" style="font-size: 9.9pt;">${invoiceData?.paymentMethod || 'Převodem'}</div>
                                <div style="font-size: 9.9pt; margin-top: 8px;">K úhradě</div>
                                <div class="font-bold" style="font-size: 13.2pt; color: #28a745;">${invoiceData?.totalAmount || '244950'} ${invoiceData?.currency || 'Kč'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Items section -->
                <div class="mb-6" style="margin-left: 0mm;">
                    <div class="border-b-2 border-black mb-4">
                        <div class="flex justify-between items-center py-2">
                            <div class="font-bold text-black" style="font-size: 12pt;">Položky faktury</div>
                            <div class="font-bold text-black" style="font-size: 12pt;">Množství</div>
                            <div class="font-bold text-black" style="font-size: 12pt;">Cena za jednotku</div>
                            <div class="font-bold text-black" style="font-size: 12pt;">Celkem</div>
                        </div>
                    </div>
                    
                    ${invoiceData?.items && invoiceData.items.length > 0 ? 
                        invoiceData.items.map((item, index) => `
                            <div class="flex justify-between items-center py-2 border-b border-gray-300">
                                <div class="text-black" style="font-size: 11pt; width: 40%;">${item.description || 'Služby'}</div>
                                <div class="text-black" style="font-size: 11pt; text-align: center; width: 15%;">${item.quantity || '1'} ${item.unit || 'ks'}</div>
                                <div class="text-black" style="font-size: 11pt; text-align: right; width: 20%;">${item.price || '0'} Kč</div>
                                <div class="text-black font-bold" style="font-size: 11pt; text-align: right; width: 25%;">${item.total || '0'} Kč</div>
                            </div>
                        `).join('') : 
                        `<div class="flex justify-between items-center py-2 border-b border-gray-300">
                            <div class="text-black" style="font-size: 11pt; width: 40%;">Služby</div>
                            <div class="text-black" style="font-size: 11pt; text-align: center; width: 15%;">1 ks</div>
                            <div class="text-black" style="font-size: 11pt; text-align: right; width: 20%;">${invoiceData?.totalAmount || '244950'} Kč</div>
                            <div class="text-black font-bold" style="font-size: 11pt; text-align: right; width: 25%;">${invoiceData?.totalAmount || '244950'} Kč</div>
                        </div>`
                    }
                </div>

                <!-- QR Code section -->
                <div class="mb-6" style="margin-left: 0mm;">
                    <div class="flex justify-between items-start">
                        <div style="width: 60%;">
                            <div class="font-bold text-black mb-2" style="font-size: 12pt;">QR Platba</div>
                            <div class="text-black mb-1" style="font-size: 10pt;">Pro rychlou platbu naskenujte QR kód</div>
                            <div class="text-black" style="font-size: 10pt;">nebo použijte platbu QR Platba+F</div>
                        </div>
                        <div style="width: 35%; text-align: center;">
                            <div id="qr-code" style="width: 80px; height: 80px; margin: 0 auto; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 8pt; color: #666;">
                                QR Code
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="text-center text-gray-600" style="font-size: 8pt; margin-top: 20mm;">
                    <div>Děkujeme za vaši důvěru</div>
                    <div>Faktura byla vygenerována elektronicky</div>
                </div>
            </div>
            
            <script>
                // Generate QR code
                const qrData = '${qrData}';
                const qrCanvas = document.createElement('canvas');
                qrCanvas.width = 80;
                qrCanvas.height = 80;
                const ctx = qrCanvas.getContext('2d');
                
                // Simple QR code generation (you can use a QR library here)
                ctx.fillStyle = '#000';
                ctx.fillRect(10, 10, 60, 60);
                ctx.fillStyle = '#fff';
                ctx.fillRect(15, 15, 50, 50);
                ctx.fillStyle = '#000';
                ctx.fillRect(20, 20, 40, 40);
                
                const qrContainer = document.getElementById('qr-code');
                qrContainer.innerHTML = '';
                qrContainer.appendChild(qrCanvas);
            </script>
        </body>
        </html>
      `;
      
      // Write content to print window
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = () => {
        console.log('✅ Контент завантажено, починаємо друкування...');
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          console.log('✅ Друкування завершено!');
        }, 500);
      };
      
      console.log('✅ Вікно друкування створено!');
      
    } catch (error) {
      console.error('❌ Помилка при друкуванні:', error);
    }
  };

  useEffect(() => {
    if (isOpen && invoiceData) {
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
  }, [isOpen, invoiceData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative z-10 w-full max-w-4xl max-h-[95vh] bg-black border border-gray-700 rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 no-print">
          <h2 className="text-xl font-semibold text-white">Náhled faktury</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 bg-money text-black rounded-lg hover:bg-money-dark transition-colors"
            >
              <Download size={16} />
              Stáhnout PDF
            </button>
            <button 
              onClick={generateISDOC}
              className="flex items-center gap-2 px-4 py-2 bg-money text-black rounded-lg hover:bg-money-dark transition-colors"
            >
              <FileText size={16} />
              Stáhnout ISDOC
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Printer size={16} />
              Tisknout
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="p-4 overflow-y-auto max-h-[calc(95vh-100px)] bg-gray-50">
          <div className="bg-white shadow-lg mx-auto print-page relative" style={{ 
            width: '210mm', 
            minHeight: '297mm', 
            fontFamily: 'Arial, Helvetica, sans-serif',
            padding: '12mm 5mm',
            lineHeight: '1.2'
          }}>
            

            
                        {/* Left vertical labels - REMOVED */}
            
            {/* Top section - Header - Unified layout */}
            <div className="mb-6" style={{ marginLeft: '0mm', marginTop: '4mm' }}>
              {/* Invoice title and supplier info in one row */}
              <div className="flex justify-between items-start mb-3">
                {/* Left - Supplier info (DODAVATEL) */}
                <div style={{ width: '48%', marginLeft: '0mm', marginTop: '-5mm' }}>
                  {/* Invoice title - Moved to left side */}
                  <div className="mb-1" style={{ marginTop: '-25px' }}>
                    <h1 className="font-bold text-black" style={{ fontSize: '16pt' }}>Faktura <span className="text-gray-600" style={{ fontSize: '14pt' }}>{invoiceData?.invoiceNumber || '2025-0001'}</span></h1>
                  </div>
                  <div className="border-t border-black mb-2" style={{ marginTop: '10px' }}></div>
                  <div className="font-bold text-black mb-2" style={{ fontSize: '12pt' }}>DODAVATEL</div>
                  <div className="font-bold text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData?.ownerName || 'Jméno dodavatele'}</div>
                  <div className="text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData?.supplierAddress || 'Adresa'}</div>
                  <div className="text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData?.supplierCity || 'Město'}</div>
                  {invoiceData?.supplierCountry && <div className="text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData.supplierCountry}</div>}
                  {invoiceData?.supplierICO && <div className="text-black mb-1" style={{ fontSize: '11pt' }}>IČO: {invoiceData.supplierICO}</div>}
                  {invoiceData?.supplierTaxStatus && invoiceData.supplierTaxStatus !== 'Nejsme plátci DPH' && <div className="text-black mb-1" style={{ fontSize: '11pt' }}>DIČ: CZ{invoiceData.supplierICO}</div>}
                  
                  {/* Contact info */}
                  <div className="mt-4">
                    <div className="font-bold text-black mb-2" style={{ fontSize: '11pt' }}>Kontaktní údaje</div>
                    {invoiceData?.supplierEmail && <div className="text-black mb-1" style={{ fontSize: '11pt' }}>E-mail: {invoiceData.supplierEmail}</div>}
                    {invoiceData?.supplierPhone && <div className="text-black mb-1" style={{ fontSize: '11pt' }}>Telefon: {invoiceData.supplierPhone}</div>}
                  </div>
                  
                  {/* Dates - Moved lower with 2 line spacing and bold */}
                  <div className="text-black mb-1 mt-4" style={{ fontSize: '11pt' }}><strong>Datum vystavení: {invoiceData?.issueDate ? new Date(invoiceData.issueDate).toLocaleDateString('cs-CZ') : 'DD. MM. RRRR'}</strong></div>
                  <div className="text-black" style={{ fontSize: '11pt' }}><strong>Datum splatnosti: {invoiceData?.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString('cs-CZ') : 'DD. MM. RRRR'}</strong></div>
                </div>
                
                {/* Right - Customer info (ODBĚRATEL) */}
                <div style={{ width: '48%', marginLeft: '25mm' }}>
                  {/* ISDOC Logo - Moved to right side */}
                  <div className="text-right mb-1" style={{ marginTop: '-35px' }}>
                    <div className="flex items-center gap-1 justify-end">
                      <div className="w-3 h-3 bg-green-500 rounded-sm flex items-center justify-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <div className="w-0.5 h-0.5 bg-white rounded-sm"></div>
                          <div className="w-0.5 h-0.5 bg-white rounded-sm"></div>
                          <div className="w-0.5 h-0.5 bg-white rounded-sm"></div>
                        </div>
                      </div>
                      <span className="font-bold text-black text-xs">ISDOC</span>
                    </div>
                  </div>
                  
                  {/* Customer info */}
                  <div className="border-t border-black mb-2" style={{ marginTop: '10px' }}></div>
                  <div className="font-bold text-black mb-2" style={{ fontSize: '12pt' }}>ODBĚRATEL</div>
                  <div className="font-bold text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData?.customer || 'Název odběratele'}</div>
                  {invoiceData?.customerAddress && <div className="text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData.customerAddress}</div>}
                  {invoiceData?.customerCity && <div className="text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData.customerCity}</div>}
                  {invoiceData?.customerCountry && <div className="text-black mb-1" style={{ fontSize: '11pt' }}>{invoiceData.customerCountry}</div>}
                  {invoiceData?.customerICO && <div className="text-black mb-1" style={{ fontSize: '11pt' }}>IČO: {invoiceData.customerICO}</div>}
                  {invoiceData?.customerDIC && <div className="text-black mb-1" style={{ fontSize: '11pt' }}>DIČ: {invoiceData.customerDIC}</div>}
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
                    <div className="font-bold mb-1" style={{ fontSize: '9.9pt', marginTop: '8px' }}>{invoiceData?.bankAccount || '4914919003/5500'}</div>
                    <div className="font-bold mb-1" style={{ fontSize: '9.9pt', whiteSpace: 'nowrap' }}>IBAN: {invoiceData?.iban || 'CZ33 5500 0000 0049 1491 9003'}</div>
                    <div className="font-bold" style={{ fontSize: '9.9pt', whiteSpace: 'nowrap' }}>SWIFT: {invoiceData?.swift || 'RZBCCZPP'}</div>
                  </div>
                  
                  {/* Symbols - Moved to the right */}
                  <div style={{ width: '30%', marginLeft: '60px' }}>
                    <div style={{ fontSize: '11pt' }}>Symbol</div>
                    <div style={{ fontSize: '11pt', whiteSpace: 'nowrap', marginTop: '6px' }}>variabilní: <span className="font-bold">{invoiceData?.variableSymbol || invoiceData?.invoiceNumber || '20240009'}</span></div>
                    <div style={{ fontSize: '11pt', whiteSpace: 'nowrap', marginTop: '6px' }}>konstantní: <span className="font-bold">{invoiceData?.constantSymbol || '0308'}</span></div>
                  </div>
                  
                  {/* Payment method and amount */}
                  <div style={{ width: '35%', marginLeft: '20px' }}>
                    <div style={{ fontSize: '9.9pt', whiteSpace: 'nowrap' }}>Způsob platby: {invoiceData?.paymentMethod || 'Převodem'}</div>
                    <div style={{ fontSize: '9.9pt', whiteSpace: 'nowrap', marginTop: '24px' }}>K úhradě:</div>
                    <div className="font-bold" style={{ fontSize: '13.2pt', whiteSpace: 'nowrap', marginTop: '4px' }}>{invoiceData?.totalAmount || '244 950,00'} {invoiceData?.currency || 'Kč'}</div>
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
                  {invoiceData?.items && invoiceData.items.length > 0 ? (
                    invoiceData.items.map((item, index: number) => (
                      <tr key={index} style={{ minHeight: '20mm' }}>
                        <td className="py-3 px-3 text-black border-r border-gray-400 border-b border-gray-400 align-top" style={{ lineHeight: '1.2', fontSize: '10pt', whiteSpace: 'pre-wrap' }}>
                          {item.description || 'Popis položky'}
                        </td>
                        <td className="text-center py-3 px-3 text-black border-r border-gray-400 border-b border-gray-400 align-top" style={{ fontSize: '10pt' }}>{item.quantity || '1,00'}</td>
                        <td className="text-center py-3 px-3 text-black border-r border-gray-400 border-b border-gray-400 align-top" style={{ fontSize: '10pt' }}>{item.unit || 'ks'}</td>
                        <td className="text-right py-3 px-3 text-black border-r border-gray-400 border-b border-gray-400 align-top" style={{ fontSize: '10pt' }}>{item.price || '244 950,00'}</td>
                        <td className="text-right py-3 px-3 text-black align-top font-bold border-b border-gray-400" style={{ fontSize: '10pt' }}>{item.total || '244 950,00'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr style={{ height: '20mm' }}>
                      <td className="py-3 px-3 text-black border-r border-gray-400 border-b border-gray-400 align-top" style={{ lineHeight: '1.2', fontSize: '10pt', whiteSpace: 'pre-wrap' }}>
                        Fakturace za obj lads cake práce na Technologické 377/8: obklad 386,5m =212520, sokl 149,5 m =19435, penetrace 386,5 m =7345, vtáni der 55= 3850, hzs 6 hod = 1800.
                      </td>
                      <td className="text-center py-3 px-3 text-black border-r border-gray-400 border-b border-gray-400 align-top" style={{ fontSize: '10pt' }}>1,00</td>
                      <td className="text-center py-3 px-3 text-black border-r border-gray-400 border-b border-gray-400 align-top" style={{ fontSize: '10pt' }}>ks</td>
                      <td className="text-right py-3 px-3 text-black border-r border-gray-400 border-b border-gray-400 align-top" style={{ fontSize: '10pt' }}>244 950,00</td>
                      <td className="text-right py-3 px-3 text-black align-top font-bold border-b border-gray-400" style={{ fontSize: '10pt' }}>244 950,00</td>
                    </tr>
                  )}
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
                <div className="font-bold text-black" style={{ fontSize: '16pt' }}>{invoiceData?.totalAmount || '244 950,00'} {invoiceData?.currency || 'Kč'}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center border-t border-gray-400 pt-3" style={{ marginTop: '20mm', marginLeft: '0mm', position: 'absolute', bottom: '10mm', left: '0', right: '0', width: '100%' }}>
              <div className="flex justify-between items-center text-gray-600 px-4" style={{ fontSize: '9pt', width: '100%' }}>
                <div>Vytiskl(a): {invoiceData?.ownerName || 'Volodymyr Krytskyi'}, {new Date().toLocaleDateString('cs-CZ')}</div>
                <div>Vystaveno v online fakturační službě faktix www.faktix.cz</div>
                <div>Strana 1/1</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}