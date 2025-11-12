"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, BookOpen, X } from "lucide-react";
import { QUICK_QUERIES_UK, QUICK_QUERIES_CS } from "@/lib/kb/constants";
import { useInvoices } from "@/contexts/InvoiceContext";
import { getUserProfileFromStorage } from "@/lib/user-profile-analyzer";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    url: string;
  }>;
  confidence?: number;
}

interface AIAccountantChatProps {
  language?: 'cs' | 'uk';
  onClose?: () => void;
}

export default function AIAccountantChat({ language = 'uk', onClose }: AIAccountantChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQueries, setShowQuickQueries] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { invoices } = useInvoices();

  const quickQueries = language === 'uk' ? QUICK_QUERIES_UK : QUICK_QUERIES_CS;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: language === 'uk'
          ? '👋 Вітаю! Я AI-бухгалтер для чеської податкової системи. Можу відповісти на питання про податки, відрахування, терміни та розрахунки. Задайте мені питання або оберіть одне з готових нижче.'
          : '👋 Dobrý den! Jsem AI účetní pro český daňový systém. Mohu odpovědět na otázky o daních, odvodech, termínech a výpočtech. Položte mi otázku nebo vyberte jednu z připravených níže.',
        timestamp: new Date(),
      }]);
    }
  }, [language]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowQuickQueries(false);

    try {
      // Get user context
      const profile = getUserProfileFromStorage();
      
      // Рахуємо загальний дохід з ОПЛАЧЕНИХ фактур
      const totalIncome = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.total, 0);
      
      // Рахуємо дохід за поточний рік
      const currentYear = new Date().getFullYear();
      const yearIncome = invoices
        .filter(inv => {
          const invYear = new Date(inv.date).getFullYear();
          return inv.status === 'paid' && invYear === currentYear;
        })
        .reduce((sum, inv) => sum + inv.total, 0);
      
      // Статистика по фактурах
      const invoiceStats = {
        total: invoices.length,
        paid: invoices.filter(inv => inv.status === 'paid').length,
        pending: invoices.filter(inv => inv.status === 'sent').length,
        totalAmount: totalIncome,
        yearAmount: yearIncome,
      };

        const userContext = profile ? {
          businessType: profile.userType === 'OSVC' ? 'osvc' as const : 'sro' as const,
          ico: profile.ico,
          dic: profile.dic,
          companyName: profile.companyName,
          annualIncome: yearIncome, // Дохід за поточний рік!
          totalIncome: totalIncome, // Загальний дохід
          isPausalni: 'isPausalni' in profile ? profile.isPausalni : false,
          isVatPayer: !!profile.dic,
          invoiceStats, // Додаємо статистику фактур
        } : undefined;

      // Call AI API
      const response = await fetch('/api/ai-accountant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          language,
          userContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const result = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.answer,
        timestamp: new Date(),
        sources: result.sources,
        confidence: result.confidence,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'uk'
          ? '❌ Вибачте, виникла помилка. Спробуйте ще раз або зверніться до підтримки.'
          : '❌ Omlouváme se, došlo k chybě. Zkuste to znovu nebo kontaktujte podporu.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuery = (query: string) => {
    sendMessage(query);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-money/20 to-money/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-money/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-money" />
          </div>
          <div>
            <h3 className="font-bold text-white">
              {language === 'uk' ? 'AI-Бухгалтер' : 'AI Účetní'}
            </h3>
            <p className="text-xs text-gray-400">
              {language === 'uk' ? 'Податкова система ЧР' : 'Daňový systém ČR'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-money/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-money" />
                </div>
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-xl p-3 ${
                message.role === 'user'
                  ? 'bg-money text-black'
                  : 'bg-gray-800 text-white'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-money" />
                    <span className="text-xs font-semibold text-gray-400">
                      {language === 'uk' ? 'Джерела:' : 'Zdroje:'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {message.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-money hover:underline block"
                      >
                        • {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {message.confidence && message.confidence > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {language === 'uk' ? 'Впевненість' : 'Důvěra'}: {Math.round(message.confidence * 100)}%
                </div>
              )}
            </div>
            
            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-money/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-money" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <Loader2 className="w-5 h-5 text-money animate-spin" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Queries */}
      {showQuickQueries && messages.length <= 1 && (
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <p className="text-xs text-gray-400 mb-2">
            {language === 'uk' ? '💡 Популярні питання:' : '💡 Často kladené otázky:'}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {quickQueries.slice(0, 4).map((query, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuery(query)}
                className="text-left text-xs p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder={
              language === 'uk'
                ? 'Задайте питання про податки...'
                : 'Položte otázku o daních...'
            }
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-money"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-money hover:bg-money/90 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}

