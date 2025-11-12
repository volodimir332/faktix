/**
 * HTML Email Template для відправки фактури клієнту
 * Використовується в /api/send-email/route.ts
 */

export interface ClientInvoiceEmailParams {
  senderName: string;        // Ім'я користувача (хто відправив)
  senderCompany: string;     // Назва компанії користувача
  senderEmail: string;       // Його email
  clientName?: string;       // Ім'я замовника (опціонально)
  logoUrl?: string;          // логотип користувача або Faktix
  companySite?: string;      // сайт компанії або Faktix
  invoiceNumber?: string;    // номер фактури
}

export const generateClientInvoiceEmail = ({
  senderName,
  senderCompany,
  senderEmail,
  clientName,
  logoUrl = 'https://faktix.cz/logo.png',
  companySite = 'https://faktix.cz',
  invoiceNumber,
}: ClientInvoiceEmailParams): string => `
<!DOCTYPE html>
<html lang="uk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Фактура від ${senderCompany}</title>
    <style>
      /* Reset styles */
      body, table, td, a {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table, td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      img {
        -ms-interpolation-mode: bicubic;
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
      }
      
      /* Mobile styles */
      @media only screen and (max-width: 600px) {
        .email-container {
          width: 100% !important;
          margin: 0 !important;
        }
        .content-padding {
          padding: 20px !important;
        }
        .button {
          padding: 10px 20px !important;
          font-size: 14px !important;
        }
        h2 {
          font-size: 20px !important;
        }
        p {
          font-size: 14px !important;
        }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; padding:40px 0;">
      <tr>
        <td align="center">
          <!-- Main container -->
          <table class="email-container" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.05); overflow:hidden; max-width:600px;">
            
            <!-- Header with logo -->
            <tr>
              <td align="center" style="padding:32px 24px 24px;">
                <img src="${logoUrl}" alt="${senderCompany}" style="width:80px; height:auto; margin-bottom:16px;" />
                <h2 style="color:#0d0d0d; font-size:24px; margin:0; font-weight:bold;">
                  ${senderCompany}
                </h2>
                ${invoiceNumber ? `<p style="color:#10b981; font-size:14px; margin:8px 0 0;">Faktura č. ${invoiceNumber}</p>` : ''}
              </td>
            </tr>

            <!-- Main content -->
            <tr>
              <td class="content-padding" style="padding:0 40px 20px;">
                <p style="font-size:16px; color:#333; margin:0 0 16px;">
                  ${clientName ? `Dobrý den, ${clientName}!` : 'Dobrý den!'}
                </p>
                <p style="font-size:16px; color:#333; line-height:1.6; margin:0 0 16px;">
                  Přijímáte fakturu od <strong>${senderCompany}</strong>.
                  V příloze najdete fakturu ve formátu PDF.
                </p>
                <p style="font-size:16px; color:#333; line-height:1.6; margin:0;">
                  Pokud máte jakékoli dotazy, neváhejte nás kontaktovat:
                  <br/>
                  <a href="mailto:${senderEmail}" style="color:#10b981; text-decoration:none; font-weight:500;">${senderEmail}</a>
                </p>
              </td>
            </tr>

            <!-- Button (optional) -->
            ${companySite !== 'https://faktix.cz' ? `
            <tr>
              <td align="center" style="padding:10px 40px 30px;">
                <a href="${companySite}" target="_blank" class="button"
                  style="display:inline-block; background-color:#10b981; color:#fff; padding:14px 32px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:16px;">
                  Navštívit ${senderCompany}
                </a>
              </td>
            </tr>
            ` : '<tr><td style="padding:20px;"></td></tr>'}

            <!-- Footer -->
            <tr>
              <td style="background-color:#f1f5f9; padding:24px; text-align:center; font-size:13px; color:#64748b; border-top:1px solid #e2e8f0;">
                <p style="margin:0 0 8px;">
                  Vytvořeno a odesláno přes 
                  <a href="https://faktix.cz" style="color:#10b981; text-decoration:none; font-weight:600;">Faktix</a>
                </p>
                <p style="margin:0; font-size:12px; color:#94a3b8;">
                  Profesionální fakturace pro moderní podnikání 💼
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

/**
 * Email template для калькуляцій та цінових пропозицій
 */
export interface ClientCalculationEmailParams {
  senderName: string;
  senderCompany: string;
  senderEmail: string;
  clientName?: string;
  logoUrl?: string;
  companySite?: string;
  calculationName: string;
  totalAmount?: string;
}

export const generateClientCalculationEmail = ({
  senderName,
  senderCompany,
  senderEmail,
  clientName,
  logoUrl = 'https://faktix.cz/logo.png',
  companySite = 'https://faktix.cz',
  calculationName,
  totalAmount,
}: ClientCalculationEmailParams): string => `
<!DOCTYPE html>
<html lang="cs">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cenová nabídka od ${senderCompany}</title>
    <style>
      @media only screen and (max-width: 600px) {
        .email-container { width: 100% !important; }
        .content-padding { padding: 20px !important; }
        .button { padding: 10px 20px !important; font-size: 14px !important; }
        h2 { font-size: 20px !important; }
        p { font-size: 14px !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; padding:40px 0;">
      <tr>
        <td align="center">
          <table class="email-container" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.05); max-width:600px;">
            
            <tr>
              <td align="center" style="padding:32px 24px 24px;">
                <img src="${logoUrl}" alt="${senderCompany}" style="width:80px; height:auto; margin-bottom:16px;" />
                <h2 style="color:#0d0d0d; font-size:24px; margin:0; font-weight:bold;">
                  ${senderCompany}
                </h2>
                <p style="color:#6366f1; font-size:14px; margin:8px 0 0;">Cenová nabídka</p>
              </td>
            </tr>

            <tr>
              <td class="content-padding" style="padding:0 40px 20px;">
                <p style="font-size:16px; color:#333; margin:0 0 16px;">
                  ${clientName ? `Dobrý den, ${clientName}!` : 'Dobrý den!'}
                </p>
                <p style="font-size:16px; color:#333; line-height:1.6; margin:0 0 16px;">
                  Posíláme vám cenovou nabídku <strong>${calculationName}</strong>.
                  V příloze najdete detailní kalkulaci ve formátu PDF.
                </p>
                ${totalAmount ? `
                <div style="background-color:#f0f9ff; border-left:4px solid #6366f1; padding:16px; margin:16px 0; border-radius:4px;">
                  <p style="margin:0; font-size:14px; color:#64748b;">Celková částka</p>
                  <p style="margin:4px 0 0; font-size:24px; font-weight:bold; color:#6366f1;">${totalAmount}</p>
                </div>
                ` : ''}
                <p style="font-size:16px; color:#333; line-height:1.6; margin:0;">
                  V případě dotazů nás kontaktujte:
                  <br/>
                  <a href="mailto:${senderEmail}" style="color:#6366f1; text-decoration:none; font-weight:500;">${senderEmail}</a>
                </p>
              </td>
            </tr>

            <tr>
              <td style="background-color:#f1f5f9; padding:24px; text-align:center; font-size:13px; color:#64748b; border-top:1px solid #e2e8f0;">
                <p style="margin:0 0 8px;">
                  Vytvořeno přes 
                  <a href="https://faktix.cz" style="color:#6366f1; text-decoration:none; font-weight:600;">Faktix</a>
                </p>
                <p style="margin:0; font-size:12px; color:#94a3b8;">
                  Profesionální kalkulace a cenové nabídky 📊
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

