"use client";

import { useState } from 'react';
import { X, FileText, AlertCircle, Check } from 'lucide-react';
import { Calculation } from '@/contexts/CalculationContext';

interface CalculationToInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculation: Calculation;
  onConfirm: (calculation: Calculation, customPrices: Record<string, number>) => void;
}

export default function CalculationToInvoiceModal({
  isOpen,
  onClose,
  calculation,
  onConfirm,
}: CalculationToInvoiceModalProps) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handlePriceChange = (materialName: string, price: number) => {
    setPrices(prev => ({
      ...prev,
      [materialName]: price
    }));
  };

  const handleConfirm = () => {
    onConfirm(calculation, prices);
    onClose();
  };

  const totalEstimate = calculation.results.reduce((sum, result) => {
    const price = prices[result.material] || 0;
    return sum + (result.quantity * price);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-money/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-money" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Vytvořit fakturu z výpočtu</h2>
              <p className="text-sm text-gray-400">{calculation.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Info Banner */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Nastavte ceny za jednotku</p>
              <p className="text-blue-400/80">
                Zadejte cenu za jednotku pro každý materiál. Systém automaticky vypočítá celkovou částku.
              </p>
            </div>
          </div>

          {/* Materials List */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Materiály a ceny
            </h3>
            {calculation.results.map((result, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1">{result.material}</div>
                    {result.description && (
                      <div className="text-xs text-gray-400 mb-2">{result.description}</div>
                    )}
                    <div className="text-sm text-gray-300">
                      Množství: <span className="text-money font-semibold">
                        {result.quantity.toLocaleString('cs-CZ')} {result.unit}
                      </span>
                    </div>
                  </div>
                  <div className="w-40">
                    <label className="block text-xs text-gray-400 mb-1">
                      Cena za {result.unit}
                    </label>
                    <input
                      type="number"
                      value={prices[result.material] || ''}
                      onChange={(e) => handlePriceChange(result.material, parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-money transition-colors"
                    />
                    {prices[result.material] > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Celkem: {(result.quantity * prices[result.material]).toLocaleString('cs-CZ', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} Kč
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Poznámky k faktuře (volitelné)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Například: Materiál včetně dopravy a montáže..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-money resize-none"
            />
          </div>

          {/* Total */}
          {totalEstimate > 0 && (
            <div className="bg-money/10 border border-money/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Odhadovaná celková částka:</span>
                <span className="text-2xl font-bold text-money">
                  {totalEstimate.toLocaleString('cs-CZ', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} Kč
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Zrušit
          </button>
          <button
            onClick={handleConfirm}
            disabled={Object.keys(prices).length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-money hover:bg-money-dark text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5" />
            Pokračovat k faktuře
          </button>
        </div>
      </div>
    </div>
  );
}

