"use client";

import { Calculation } from '@/contexts/CalculationContext';
import { Calculator, Trash2, FileText, Calendar } from 'lucide-react';

interface CalculationCardProps {
  calculation: Calculation;
  onDelete?: (id: string) => void;
  onCreateInvoice?: (calculation: Calculation) => void;
  onClick?: (calculation: Calculation) => void;
}

export default function CalculationCard({ 
  calculation, 
  onDelete, 
  onCreateInvoice,
  onClick 
}: CalculationCardProps) {
  const date = new Date(calculation.date);

  return (
    <div 
      className="bg-gray-900/50 border border-gray-700 rounded-xl p-5 hover:border-money/50 transition-all cursor-pointer"
      onClick={() => onClick?.(calculation)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-money/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5 text-money" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{calculation.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {date.toLocaleDateString('cs-CZ', { 
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="space-y-2 mb-4">
        {calculation.results.slice(0, 3).map((result, index) => (
          <div 
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-gray-400">{result.material}</span>
            <span className="text-money font-medium">
              {result.quantity.toLocaleString('cs-CZ')} {result.unit}
            </span>
          </div>
        ))}
        {calculation.results.length > 3 && (
          <div className="text-xs text-gray-500 text-center">
            +{calculation.results.length - 3} dalších materiálů
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-700">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateInvoice?.(calculation);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-money/10 hover:bg-money/20 text-money rounded-lg text-sm transition-colors"
        >
          <FileText className="w-4 h-4" />
          Faktura
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Opravdu chcete smazat tento výpočet?')) {
              onDelete?.(calculation.id);
            }
          }}
          className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

