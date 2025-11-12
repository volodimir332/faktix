import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateClientInvoiceEmail, generateClientCalculationEmail } from "@/lib/emailTemplate";

export async function POST(req: Request) {
  try {
    const { 
      to, 
      subject, 
      text, 
      html, 
      attachments,
      userName,
      userEmail,
      pdfBuffer,
      // Нові параметри для template
      useTemplate,
      emailType,
      clientName,
      invoiceNumber,
      calculationName,
      totalAmount,
      companyName,
      logoUrl,
      companySite
    } = await req.json();

    console.log('📧 Sending email to:', to);
    console.log('📧 Subject:', subject);
    console.log('👤 User:', userName, userEmail);

    // Перевірка environment variables
    console.log('🔍 Environment check:', {
      hasSystemEmail: !!process.env.SYSTEM_EMAIL,
      hasSystemAppPassword: !!process.env.SYSTEM_APP_PASSWORD,
      systemEmail: process.env.SYSTEM_EMAIL ? `${process.env.SYSTEM_EMAIL.substring(0, 5)}...` : 'NOT SET',
    });

    if (!process.env.SYSTEM_EMAIL || !process.env.SYSTEM_APP_PASSWORD) {
      throw new Error('SYSTEM_EMAIL або SYSTEM_APP_PASSWORD не налаштовані в .env.local');
    }

    // Налаштування SMTP транспорту для Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SYSTEM_EMAIL,
        pass: process.env.SYSTEM_APP_PASSWORD,
      },
    });

    console.log('🔧 SMTP transporter created');

    // Перевірка з'єднання
    console.log('🔌 Attempting SMTP connection...');
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully!');
    } catch (verifyError: unknown) {
      const error = verifyError as Error & { code?: string; command?: string };
      console.error('❌ SMTP verification failed:', {
        message: error.message,
        code: error.code,
        command: error.command,
      });
      throw verifyError;
    }

    // Підготовка вкладень
    const emailAttachments = attachments || [];
    
    // Якщо передано PDF як base64
    if (pdfBuffer) {
      emailAttachments.push({
        filename: "invoice.pdf",
        content: Buffer.from(pdfBuffer, "base64"),
        contentType: "application/pdf",
      });
    }

    // Налаштування "From" та "Reply-To"
    const fromName = userName || "Faktix";
    const fromEmail = userEmail || process.env.SYSTEM_EMAIL;
    const senderCompany = companyName || fromName;
    
    // 🎯 Генерація HTML з template (якщо useTemplate = true)
    let emailHtml = html;
    
    if (useTemplate) {
      console.log('📧 Використовую професійний email template...');
      
      if (emailType === 'invoice') {
        emailHtml = generateClientInvoiceEmail({
          senderName: fromName,
          senderCompany,
          senderEmail: fromEmail,
          clientName,
          logoUrl,
          companySite,
          invoiceNumber
        });
      } else if (emailType === 'calculation' || emailType === 'offer') {
        emailHtml = generateClientCalculationEmail({
          senderName: fromName,
          senderCompany,
          senderEmail: fromEmail,
          clientName,
          logoUrl,
          companySite,
          calculationName: calculationName || 'Cenová nabídka',
          totalAmount
        });
      }
      
      console.log('✅ HTML template згенеровано');
    }
    
    // 🎯 Важливо: Gmail вимагає, щоб в From був системний email для аутентифікації
    // Але ми можемо додати email користувача в Reply-To, щоб клієнт відповідав йому
    
    // Відправка email
    const info = await transporter.sendMail({
      from: `"${fromName}" <${process.env.SYSTEM_EMAIL}>`,
      replyTo: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text: text || `Dobrý den, v příloze najdete dokument od ${senderCompany}.`,
      html: emailHtml,
      attachments: emailAttachments,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    console.log('📨 From (displayed):', `"${fromName}" <${process.env.SYSTEM_EMAIL}>`);
    console.log('📬 Reply-To:', `"${fromName}" <${fromEmail}>`);
    console.log('🎯 Client will see:', fromName);
    console.log('💬 Reply will go to:', fromEmail);

    return NextResponse.json({
      success: true,
      message: "Email sent!",
      messageId: info.messageId
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Email error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Email failed",
        error: err.message
      },
      { status: 500 }
    );
  }
}
