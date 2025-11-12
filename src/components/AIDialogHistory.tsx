"use client";

import { useEffect, useRef } from 'react';
import { Bot, User, Loader2 } from 'lucide-react';

export interface DialogMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AIDialogHistoryProps {
  messages: DialogMessage[];
  isLoading?: boolean;
}

export default function AIDialogHistory({ messages, isLoading = false }: AIDialogHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return null; // Return null to show welcome screen in parent
  }

  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0 w-8 h-8 bg-money/10 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-money" />
            </div>
          )}
          
          <div
            className={`max-w-[80%] p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-money text-black'
                : 'bg-gray-800 text-white border border-gray-700'
            }`}
          >
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-black/60' : 'text-gray-500'}`}>
              {message.timestamp.toLocaleTimeString('cs-CZ', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>

          {message.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-300" />
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="flex-shrink-0 w-8 h-8 bg-money/10 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-money" />
          </div>
          <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg">
            <Loader2 className="w-5 h-5 text-money animate-spin" />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

