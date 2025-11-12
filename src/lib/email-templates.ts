// Email templates for Faktix
// Професійні шаблони email листів з логотипом

export interface EmailTemplateData {
  userName: string;
  userCompany?: string;
  userEmail?: string;
  recipientName?: string;
  invoiceNumber?: string;
  amount?: string;
  dueDate?: string;
  items?: Array<{
    name: string;
    quantity?: number;
    unit?: string;
    price: number;
    total?: number;
  }>;
  message?: string;
  templateName?: string;
  total?: string;
}

// Логотип Faktix SVG (зелений)
const FAKTIX_LOGO = `
<svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="8" width="32" height="24" rx="4" fill="#10b981"/>
  <path d="M 8 12 L 20 12 M 8 16 L 24 16 M 8 20 L 16 20 M 8 24 L 20 24" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <text x="40" y="28" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#1f2937">faktix</text>
</svg>
`;

// Спільний CSS для всіх шаблонів
const COMMON_STYLES = `
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
    line-height: 1.6; 
    color: #333; 
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
  .email-wrapper {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  .logo-container {
    text-align: center;
    padding: 30px 0;
    background: #ffffff;
    border-radius: 12px 12px 0 0;
  }
  .container { 
    background: #ffffff;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  .content { 
    padding: 40px 30px;
    background: #ffffff;
  }
  .greeting {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 20px;
  }
  .message {
    color: #4b5563;
    margin-bottom: 25px;
    line-height: 1.8;
  }
  .footer { 
    text-align: center; 
    color: #6b7280; 
    padding: 30px;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
  }
  .footer p {
    margin: 8px 0;
    font-size: 14px;
  }
  .footer .brand {
    font-weight: 700;
    color: #10b981;
    font-size: 18px;
    margin-top: 20px;
  }
  .footer .tagline {
    font-size: 12px; 
    color: #9ca3af; 
    margin-top: 8px;
    font-style: italic;
  }
`;

// 🧾 Шаблон для фактури (Invoice)
export function getInvoiceEmailTemplate(data: EmailTemplateData): { subject: string; html: string } {
  const {
    userName,
    userCompany,
    recipientName,
    invoiceNumber,
    amount,
    dueDate,
    message
  } = data;

  const greeting = recipientName ? `Dobrý den, ${recipientName}` : 'Dobrý den';
  const fromName = userCompany || userName;

  return {
    subject: `Faktura č. ${invoiceNumber} od ${fromName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${COMMON_STYLES}
    .info-card {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border-left: 4px solid #10b981;
      padding: 25px;
      margin: 30px 0;
      border-radius: 8px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      align-items: center;
    }
    .info-row:last-child {
      margin-bottom: 0;
    }
    .label {
      font-size: 13px;
      color: #059669;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .value {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
    }
    .amount {
      font-size: 28px !important;
      color: #10b981 !important;
    }
    .attachment-box {
      background: #ffffff;
      border: 2px dashed #10b981;
      padding: 20px;
      margin: 30px 0;
      border-radius: 8px;
      text-align: center;
    }
    .attachment-box strong {
      color: #10b981;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Logo -->
    <div class="logo-container">
      ${FAKTIX_LOGO}
      <div style="margin-top: 15px; color: #6b7280; font-size: 14px;">Rychlá fakturace pro moderní podnikatele</div>
    </div>
    
    <div class="container">
      <div class="content">
        <div class="greeting">${greeting},</div>
        
        <div class="message">
          ${message || `zasíláme Vám fakturu za poskytnuté služby. Děkujeme za Vaši důvěru a těšíme se na další spolupráci.`}
        </div>
        
        <div class="info-card">
          <div class="info-row">
            <div>
              <div class="label">Číslo faktury</div>
              <div class="value">${invoiceNumber}</div>
            </div>
          </div>
          <div class="info-row" style="border-top: 1px solid #a7f3d0; padding-top: 15px; margin-top: 15px;">
            <div class="label">Částka k úhradě:</div>
            <div class="value amount">${amount}</div>
          </div>
          ${dueDate ? `
          <div class="info-row" style="margin-top: 15px;">
            <div class="label">Splatnost:</div>
            <div class="value" style="font-size: 16px;">${dueDate}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="attachment-box">
          <strong>📎 Příloha:</strong> Faktura ve formátu PDF
        </div>
        
        <div class="message">
          Pro jakékoliv dotazy nás neváhejte kontaktovat. Rádi Vám pomůžeme.
        </div>
      </div>
      
      <div class="footer">
        <p><strong>S pozdravem,</strong></p>
        <p style="font-size: 16px; font-weight: 600; color: #1f2937;">${fromName}</p>
        ${data.userEmail ? `<p style="color: #10b981; font-weight: 500;">${data.userEmail}</p>` : ''}
        <div class="brand">faktix</div>
        <div class="tagline">Moderní fakturace, jednoduchá správa</div>
      </div>
    </div>
  </div>
</body>
</html>
    `
  };
}

// 💰 Шаблон для цінової пропозиції (Price Offer)
export function getPriceOfferEmailTemplate(data: EmailTemplateData): { subject: string; html: string } {
  const {
    userName,
    userCompany,
    recipientName,
    templateName,
    items,
    message
  } = data;

  const greeting = recipientName ? `Dobrý den, ${recipientName}` : 'Dobrý den';
  const fromName = userCompany || userName;

  const itemsHtml = items?.filter(item => item.price > 0).map(item => `
    <tr>
      <td style="padding: 15px 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${item.name}</td>
      <td style="padding: 15px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">${item.unit || 'ks'}</td>
      <td style="padding: 15px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 700; color: #10b981;">${item.price.toLocaleString('cs-CZ')} Kč</td>
    </tr>
  `).join('') || '';

  return {
    subject: `Cenová nabídka: ${templateName} od ${fromName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${COMMON_STYLES}
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 30px 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }
    th { 
      background: #f9fafb;
      padding: 15px 12px;
      text-align: left; 
      border-bottom: 2px solid #10b981;
      font-weight: 600;
      color: #1f2937;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .title-box {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      padding: 25px;
      margin: 30px 0;
      border-radius: 8px;
      text-align: center;
      border: 2px solid #10b981;
    }
    .title-box h2 {
      margin: 0;
      font-size: 24px;
      color: #059669;
    }
    .attachment-box {
      background: #ffffff;
      border: 2px dashed #10b981;
      padding: 20px;
      margin: 30px 0;
      border-radius: 8px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Logo -->
    <div class="logo-container">
      ${FAKTIX_LOGO}
      <div style="margin-top: 15px; color: #6b7280; font-size: 14px;">Rychlá fakturace pro moderní podnikatele</div>
    </div>
    
    <div class="container">
      <div class="content">
        <div class="greeting">${greeting},</div>
        
        <div class="message">
          ${message || `děkujeme za Váš zájem o naše služby. S radostí Vám zasíláme cenovou nabídku, která obsahuje všechny požadované položky.`}
        </div>
        
        <div class="title-box">
          <h2>💰 ${templateName}</h2>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Položka</th>
              <th style="text-align: center;">Jednotka</th>
              <th style="text-align: right;">Cena/jedn.</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div class="attachment-box">
          <strong>📎 Příloha:</strong> Detailní cenová nabídka ve formátu PDF
        </div>
        
        <div class="message">
          Tato nabídka je platná <strong>30 dní</strong> od data vystavení. Pro objednávku nebo dotazy nás prosím kontaktujte.
        </div>
      </div>
      
      <div class="footer">
        <p><strong>S pozdravem,</strong></p>
        <p style="font-size: 16px; font-weight: 600; color: #1f2937;">${fromName}</p>
        ${data.userEmail ? `<p style="color: #10b981; font-weight: 500;">${data.userEmail}</p>` : ''}
        <div class="brand">faktix</div>
        <div class="tagline">Moderní fakturace, jednoduchá správa</div>
      </div>
    </div>
  </div>
</body>
</html>
    `
  };
}

// 🧮 Шаблон для калькуляції (Calculation)
export function getCalculationEmailTemplate(data: EmailTemplateData): { subject: string; html: string } {
  const {
    userName,
    userCompany,
    recipientName,
    templateName,
    items,
    total,
    message
  } = data;

  const greeting = recipientName ? `Dobrý den, ${recipientName}` : 'Dobrý den';
  const fromName = userCompany || userName;

  const itemsHtml = items?.filter(item => (item.quantity || 0) > 0).map(item => `
    <tr>
      <td style="padding: 15px 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${item.name}</td>
      <td style="padding: 15px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">${item.quantity || 0}</td>
      <td style="padding: 15px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">${item.unit || 'ks'}</td>
      <td style="padding: 15px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">${item.price.toLocaleString('cs-CZ')} Kč</td>
      <td style="padding: 15px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 700; color: #10b981;">${(item.total || 0).toLocaleString('cs-CZ')} Kč</td>
    </tr>
  `).join('') || '';

  return {
    subject: `Kalkulace: ${templateName} od ${fromName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${COMMON_STYLES}
    .email-wrapper {
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 30px 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }
    th { 
      background: #f9fafb;
      padding: 15px 12px;
      text-align: left; 
      border-bottom: 2px solid #10b981;
      font-weight: 600;
      color: #1f2937;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .title-box {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      padding: 25px;
      margin: 30px 0;
      border-radius: 8px;
      text-align: center;
      border: 2px solid #10b981;
    }
    .title-box h2 {
      margin: 0;
      font-size: 24px;
      color: #059669;
    }
    .total-box {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 30px;
      margin: 30px 0;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    .total-box .label {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      opacity: 0.9;
    }
    .total-box .value {
      font-size: 42px;
      font-weight: 700;
    }
    .attachment-box {
      background: #ffffff;
      border: 2px dashed #10b981;
      padding: 20px;
      margin: 30px 0;
      border-radius: 8px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Logo -->
    <div class="logo-container">
      ${FAKTIX_LOGO}
      <div style="margin-top: 15px; color: #6b7280; font-size: 14px;">Rychlá fakturace pro moderní podnikatele</div>
    </div>
    
    <div class="container">
      <div class="content">
        <div class="greeting">${greeting},</div>
        
        <div class="message">
          ${message || `připravili jsme pro Vás podrobnou kalkulaci včetně všech položek a cen. Kalkulace obsahuje kompletní přehled nákladů.`}
        </div>
        
        <div class="title-box">
          <h2>🧮 ${templateName}</h2>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Položka</th>
              <th style="text-align: center;">Množství</th>
              <th style="text-align: center;">Jedn.</th>
              <th style="text-align: right;">Cena/jedn.</th>
              <th style="text-align: right;">Celkem</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        ${total ? `
        <div class="total-box">
          <div class="label">Celková částka</div>
          <div class="value">${total}</div>
        </div>
        ` : ''}
        
        <div class="attachment-box">
          <strong>📎 Příloha:</strong> Detailní kalkulace ve formátu PDF
        </div>
        
        <div class="message">
          Kalkulace je orientační. Rádi Vám odpovíme na jakékoliv dotazy a pomůžeme s realizací Vašeho projektu.
        </div>
      </div>
      
      <div class="footer">
        <p><strong>S pozdravem,</strong></p>
        <p style="font-size: 16px; font-weight: 600; color: #1f2937;">${fromName}</p>
        ${data.userEmail ? `<p style="color: #10b981; font-weight: 500;">${data.userEmail}</p>` : ''}
        <div class="brand">faktix</div>
        <div class="tagline">Moderní fakturace, jednoduchá správa</div>
      </div>
    </div>
  </div>
</body>
</html>
    `
  };
}
