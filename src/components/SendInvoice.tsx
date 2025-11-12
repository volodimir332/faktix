"use client";

import { useState } from "react";
import { Mail, Check, AlertCircle, Loader2 } from "lucide-react";

interface SendInvoiceProps {
  user?: {
    name: string;
    email: string;
  };
  invoiceHtml?: string;
  pdfBase64?: string;
  subject?: string;
  defaultEmail?: string;
  onSuccess?: () => void;
}

export default function SendInvoice({ 
  user, 
  invoiceHtml, 
  pdfBase64,
  subject,
  defaultEmail = "",
  onSuccess
}: SendInvoiceProps) {
  const [to, setTo] = useState(defaultEmail);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSend = async () => {
    if (!to || !to.includes("@")) {
      setStatus("error");
      setErrorMessage("Введіть правильну email адресу");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject: subject || `Фактура від ${user?.name || "Faktix"}`,
          html: invoiceHtml || `<h1>Фактура</h1><p>Дякуємо за співпрацю!</p>`,
          pdfBuffer: pdfBase64,
          userName: user?.name || "Faktix",
          userEmail: user?.email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        if (onSuccess) {
          setTimeout(() => onSuccess(), 2000);
        }
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Невідома помилка");
      }
    } catch (error: unknown) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Помилка відправки");
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-money/20 flex items-center justify-center">
          <Mail className="w-5 h-5 text-money" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Відправити фактуру</h3>
          <p className="text-sm text-gray-400">Email замовника отримає PDF фактуру</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email отримувача
          </label>
          <input
            type="email"
            placeholder="client@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-money transition-colors"
            disabled={status === "sending"}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={status === "sending" || !to}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-money hover:bg-money-light text-black rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Відправляється...</span>
            </>
          ) : status === "success" ? (
            <>
              <Check className="w-5 h-5" />
              <span>Відправлено!</span>
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              <span>Відправити фактуру</span>
            </>
          )}
        </button>

        {status === "success" && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-400">
              ✅ Лист успішно відправлено на {to}
            </p>
          </div>
        )}

        {status === "error" && errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">
              ❌ {errorMessage}
            </p>
          </div>
        )}
      </div>

      {user && (
        <div className="pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Лист буде відправлено від імені: <span className="text-gray-300 font-medium">{user.name}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Reply-To: <span className="text-gray-300 font-medium">{user.email}</span>
          </p>
        </div>
      )}
    </div>
  );
}

