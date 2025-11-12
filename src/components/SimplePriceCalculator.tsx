"use client";

import { useState, useEffect } from 'react';
import { Calculator, Save, FileText, Plus, Trash2, Send } from 'lucide-react';
import { SimpleCalculatorTemplate, CalculatorItem } from '@/lib/calculator-templates';
import { getCalculatorIcon } from '@/components/CalculatorIcons';
import SendTemplateModal from '@/components/SendTemplateModal';

// Custom CSS for minimalist inputs
const inputStyles = `
  /* Hide default number input spinners */
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
  
  /* Custom select arrow */
  select.custom-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    padding-right: 2rem;
  }
`;

// European/Czech measurement units
const UNITS = [
  { value: 'm', label: 'm (metr)' },
  { value: 'm²', label: 'm² (metr čtvereční)' },
  { value: 'm³', label: 'm³ (metr krychlový)' },
  { value: 'bm', label: 'bm (běžný metr)' },
  { value: 'ks', label: 'ks (kus)' },
  { value: 'kg', label: 'kg (kilogram)' },
  { value: 'l', label: 'l (litr)' },
  { value: 't', label: 't (tuna)' },
  { value: 'bal', label: 'bal (balení)' },
  { value: 'role', label: 'role' },
  { value: 'hod', label: 'hod (hodina práce)' },
  { value: 'den', label: 'den (den práce)' },
];

interface CalculationItem extends CalculatorItem {
  quantity: number;
  price: number;
  total: number;
}

interface SimplePriceCalculatorProps {
  template: SimpleCalculatorTemplate;
  onSave?: (items: CalculationItem[], total: number, templateName: string) => void;
  onCreateInvoice?: (items: CalculationItem[], total: number) => void;
  onSend?: (items: CalculationItem[], total: number) => void;
  mode?: 'kalkulace' | 'cenove-nabidky';
}

export default function SimplePriceCalculator({ 
  template, 
  onSave, 
  onCreateInvoice,
  onSend,
  mode = 'kalkulace'
}: SimplePriceCalculatorProps) {
  const [items, setItems] = useState<CalculationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', unit: 'm²', price: 0 });
  const [showSendModal, setShowSendModal] = useState(false);

  // Initialize items from template
  useEffect(() => {
    const initialItems: CalculationItem[] = template.items.map(item => ({
      ...item,
      quantity: item.defaultQuantity,
      price: item.defaultPrice,
      total: item.defaultQuantity * item.defaultPrice,
    }));
    setItems(initialItems);
  }, [template]);

  // Calculate total whenever items change
  useEffect(() => {
    const sum = items.reduce((acc, item) => acc + item.total, 0);
    setTotal(sum);
  }, [items]);

  const updateItem = (id: string, field: 'quantity' | 'price' | 'unit', value: number | string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updated.total = updated.quantity * updated.price;
        }
        return updated;
      }
      return item;
    }));
  };

  const addCustomItem = () => {
    if (!newItem.name.trim()) return;
    
    const customItem: CalculationItem = {
      id: `custom-${Date.now()}`,
      name: newItem.name,
      unit: newItem.unit,
      defaultPrice: newItem.price,
      defaultQuantity: 0,
      quantity: 0,
      price: newItem.price,
      total: 0,
    };
    
    setItems(prev => [...prev, customItem]);
    setNewItem({ name: '', unit: 'm²', price: 0 });
    setShowAddItem(false);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const IconComponent = getCalculatorIcon(template.name);
  
  // Funkce handleSendEmail byla přesunuta do SendTemplateModal
  // Modal nyní sám generuje PDF a odesílá email s přílohou
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: inputStyles }} />
      <SendTemplateModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        templateName={template.name}
        items={items}
        total={total}
        onSend={() => {}} // Modal handles sending internally
        mode={mode}
      />
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden max-w-5xl">
        {/* Header */}
        <div className="bg-gray-800/50 px-3 sm:px-4 py-3 border-b border-gray-700">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 sm:gap-3">
            <div className="opacity-80 flex-shrink-0">
              <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="truncate">{template.name}</span>
          </h2>
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{template.description}</p>
        </div>

        {/* Total - STICKY AT TOP - Видима завжди при скролі */}
        {mode === 'kalkulace' && (
          <div className="sticky top-0 z-10 px-3 sm:px-4 py-2 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center justify-end gap-2 px-2 py-2 bg-money/10 rounded-lg">
              <span className="text-gray-300 text-sm font-medium">Celková cena:</span>
              <span className="text-xl font-bold text-money">{total.toLocaleString()} Kč</span>
            </div>
          </div>
        )}

        {/* Items Table - Mobile Optimized */}
        <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead className="bg-gray-800/30">
            <tr className="text-left text-xs text-gray-400">
              <th className="px-2 sm:px-3 py-2 min-w-[100px]">Položka</th>
              <th className="px-1 sm:px-2 py-2 w-16 text-center">Jedn.</th>
              {mode === 'kalkulace' && <th className="px-1 sm:px-2 py-2 text-right w-20">Množ.</th>}
              <th className="px-1 sm:px-2 py-2 text-right w-20">Cena</th>
              {mode === 'kalkulace' && <th className="px-2 sm:px-3 py-2 text-right w-24">Celkem</th>}
              <th className="px-1 sm:px-2 py-2 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                <td className="px-2 sm:px-3 py-2">
                  <div className="text-white text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">{item.name}</div>
                </td>
                <td className="px-1 sm:px-2 py-2">
                  <select
                    value={item.unit}
                    onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                    className="custom-select w-full px-1 py-1 bg-gray-800/50 border border-gray-700/50 rounded text-white text-xs focus:outline-none focus:border-money appearance-none cursor-pointer hover:bg-gray-800"
                  >
                    {UNITS.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.value}
                      </option>
                    ))}
                  </select>
                </td>
                {mode === 'kalkulace' && (
                  <td className="px-1 sm:px-2 py-2">
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-1 py-1 bg-gray-800/50 border border-gray-700/50 rounded text-white text-xs text-right focus:outline-none focus:border-money hover:bg-gray-800"
                      step="0.01"
                      min="0"
                    />
                  </td>
                )}
                <td className="px-1 sm:px-2 py-2">
                  <input
                    type="number"
                    value={item.price || ''}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full px-1 py-1 bg-gray-800/50 border border-gray-700/50 rounded text-white text-xs text-right focus:outline-none focus:border-money hover:bg-gray-800"
                    step="0.01"
                    min="0"
                  />
                </td>
                {mode === 'kalkulace' && (
                  <td className="px-2 sm:px-3 py-2 text-right">
                    <span className="text-money text-xs sm:text-sm font-bold whitespace-nowrap">{item.total.toLocaleString()} Kč</span>
                  </td>
                )}
                <td className="px-1 sm:px-2 py-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-0.5"
                    title="Odstranit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Add Item Button - Right after table */}
        <div className="px-3 sm:px-4 py-3 bg-gray-800/30 border-t border-gray-700">
        {!showAddItem ? (
          <button
            onClick={() => setShowAddItem(true)}
            className="px-3 py-1.5 bg-money hover:bg-money-dark text-black text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-start"
          >
            <Plus className="w-3.5 h-3.5" />
            Přidat novou položku
          </button>
        ) : (
          <div>
            <h3 className="text-white text-sm font-medium mb-2">Přidat novou položku</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Název položky"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                className="px-2 py-2 bg-gray-800/50 border border-gray-700/50 rounded text-white text-xs focus:outline-none focus:border-money hover:bg-gray-800"
              />
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                className="custom-select px-2 py-2 bg-gray-800/50 border border-gray-700/50 rounded text-white text-xs focus:outline-none focus:border-money appearance-none cursor-pointer hover:bg-gray-800"
              >
                {UNITS.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Cena za jednotku"
                value={newItem.price || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className="px-2 py-2 bg-gray-800/50 border border-gray-700/50 rounded text-white text-xs focus:outline-none focus:border-money hover:bg-gray-800"
                step="0.01"
                min="0"
              />
              <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
                <button
                  onClick={addCustomItem}
                  className="flex-1 px-3 py-2 text-xs bg-money hover:bg-money-dark text-black rounded font-medium transition-colors"
                >
                  Přidat
                </button>
                <button
                  onClick={() => setShowAddItem(false)}
                  className="px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Zrušit
                </button>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Actions - Buttons at bottom */}
        <div className="px-3 sm:px-4 py-3 bg-gray-800/30 border-t border-gray-700">
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          {onSave && (
            <button
              onClick={() => onSave(items, total, template.name)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Uložit šablonu</span>
            </button>
          )}
          
          <button
            onClick={() => setShowSendModal(true)}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Odeslat rozpočet</span>
          </button>
          
          {onCreateInvoice && (
            <button
              onClick={() => onCreateInvoice(items, total)}
              className="px-3 py-2 bg-money hover:bg-money-dark text-black text-xs sm:text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Vytvořit fakturu</span>
            </button>
          )}
        </div>
        </div>
      </div>
    </>
  );
}

