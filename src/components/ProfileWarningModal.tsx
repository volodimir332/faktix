"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  AlertTriangle, 
  User, 
  X, 
  ArrowRight 
} from "lucide-react";

interface ProfileWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  missingFields: string[];
}

export default function ProfileWarningModal({ 
  isOpen, 
  onClose, 
  message, 
  missingFields 
}: ProfileWarningModalProps) {
  const router = useRouter();

  const handleGoToProfile = () => {
    router.push('/profil');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Neúplný profil
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            {message}
          </p>
          
          {missingFields.length > 0 && (
            <div className="bg-gray-700/50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-white mb-2">
                Chybějící údaje:
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                {missingFields.slice(0, 5).map((field, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    {field}
                  </li>
                ))}
                {missingFields.length > 5 && (
                  <li className="text-gray-400 text-xs">
                    ... a dalších {missingFields.length - 5} údajů
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Zavřít
          </button>
          <button
            onClick={handleGoToProfile}
            className="flex-1 px-4 py-2 bg-money text-black rounded-lg hover:bg-money-light transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            Vyplnit profil
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 