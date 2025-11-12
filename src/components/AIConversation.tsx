"use client";

import { User, Bot } from 'lucide-react';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  options?: string[]; // Quick reply buttons
}

interface AIConversationProps {
  messages: ConversationMessage[];
  onOptionClick: (option: string) => void;
  isLoading?: boolean;
}

export default function AIConversation({ messages, onOptionClick, isLoading }: AIConversationProps) {
  if (messages.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 mb-6">
      {messages.map((message, index) => (
        <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {message.role === 'assistant' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-money/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-money" />
            </div>
          )}
          
          <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
            <div className={`px-4 py-3 rounded-2xl ${
              message.role === 'user' 
                ? 'bg-money text-black ml-auto' 
                : 'bg-gray-800/80 text-white'
            }`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            
            {/* Quick reply buttons */}
            {message.role === 'assistant' && message.options && message.options.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.options.map((option, optIndex) => (
                  <button
                    key={optIndex}
                    onClick={() => onOptionClick(option)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white text-sm rounded-xl transition-colors border border-gray-600 hover:border-money/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {message.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-money/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-money" />
          </div>
          <div className="bg-gray-800/80 text-white px-4 py-3 rounded-2xl">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


