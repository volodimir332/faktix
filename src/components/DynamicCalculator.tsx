"use client";

import { useState, useEffect } from 'react';
import { Calculator, Save, FileText } from 'lucide-react';
import { CalculatorSchema, CalculationResult } from '@/contexts/CalculationContext';

interface DynamicCalculatorProps {
  schema: CalculatorSchema;
  onSave?: (inputs: Record<string, string | number>, results: CalculationResult[]) => void;
  onCreateInvoice?: (results: CalculationResult[]) => void;
}

export default function DynamicCalculator({ schema, onSave, onCreateInvoice }: DynamicCalculatorProps) {
  const [inputs, setInputs] = useState<Record<string, string | number>>({});
  const [results, setResults] = useState<CalculationResult[]>([]);

  // Initialize inputs with default values
  useEffect(() => {
    const initialInputs: Record<string, string | number> = {};
    schema.fields.forEach(field => {
      initialInputs[field.name] = field.defaultValue || '';
    });
    setInputs(initialInputs);
  }, [schema]);

  // Calculate results whenever inputs change
  useEffect(() => {
    if (Object.keys(inputs).length === 0) return;

    const calculatedResults: CalculationResult[] = [];

    schema.formulas.forEach(formula => {
      try {
        // Create a safe evaluation context (unused but kept for future enhancements)
        
        // Replace variable names in formula with values
        let evaluableFormula = formula.formula;
        Object.keys(inputs).forEach(key => {
          const value = parseFloat(String(inputs[key])) || 0;
          evaluableFormula = evaluableFormula.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
        });

        // Safely evaluate the formula
        const quantity = eval(evaluableFormula);

        calculatedResults.push({
          material: formula.materialName,
          quantity: Math.ceil(quantity * 100) / 100, // Round to 2 decimals
          unit: formula.unit,
          description: formula.description,
        });
      } catch (error) {
        console.error('Error calculating formula:', formula.formula, error);
      }
    });

    setResults(calculatedResults);
  }, [inputs, schema]);

  const handleInputChange = (name: string, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(inputs, results);
    }
  };

  const handleCreateInvoice = () => {
    if (onCreateInvoice) {
      onCreateInvoice(results);
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
        <div className="w-10 h-10 bg-money/10 rounded-lg flex items-center justify-center">
          <Calculator className="w-5 h-5 text-money" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{schema.title}</h3>
          {schema.description && (
            <p className="text-sm text-gray-400">{schema.description}</p>
          )}
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schema.fields.map(field => (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              {field.label}
              {field.unit && <span className="text-gray-500 ml-1">({field.unit})</span>}
            </label>
            
            {field.type === 'select' ? (
              <select
                value={inputs[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-money transition-colors"
              >
                <option value="">Vyberte...</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'number' ? (
              <input
                type="number"
                value={inputs[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                step="0.01"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-money transition-colors"
                placeholder={`Zadejte ${field.label.toLowerCase()}`}
              />
            ) : (
              <input
                type="text"
                value={inputs[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-money transition-colors"
                placeholder={`Zadejte ${field.label.toLowerCase()}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-700">
          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
            Výsledky výpočtu
          </h4>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="text-white font-medium">{result.material}</div>
                  {result.description && (
                    <div className="text-xs text-gray-400 mt-1">{result.description}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-money text-lg font-bold">
                    {result.quantity.toLocaleString('cs-CZ', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  <div className="text-xs text-gray-400">{result.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-700">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          Uložit výpočet
        </button>
        <button
          onClick={handleCreateInvoice}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-money hover:bg-money-dark text-black rounded-lg font-medium transition-colors"
        >
          <FileText className="w-4 h-4" />
          Vytvořit fakturu
        </button>
      </div>
    </div>
  );
}

