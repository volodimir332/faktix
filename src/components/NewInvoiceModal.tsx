"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Trash2, Calendar, ChevronDown, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { NewClientModal } from './NewClientModal';
import { InvoicePreviewModal } from './InvoicePreviewModal';
import { useClients } from '@/contexts/ClientContext';
import { ClientData } from '@/types';
import { useInvoices } from '@/contexts/InvoiceContext';
import { formatDate, calculateDueDate } from '@/lib/invoice-utils';
import { checkProfileFromStorage, loadProfileFromStorage } from '@/lib/profile-validator';
import ProfileWarningModal from './ProfileWarningModal';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editInvoiceId?: string; // ID фактури для редагування
}

interface InvoiceItem {
  id: string;
  quantity: number;
  unit: string;
  description: string;
  pricePerUnit: number;
}

export function NewInvoiceModal({ isOpen, onClose, editInvoiceId }: NewInvoiceModalProps) {
  const router = useRouter();
  const { clients, addClient } = useClients();
  const { addInvoice, updateInvoice, getInvoiceById, invoices } = useInvoices();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('Faktura');
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const dueDate = (() => {
      const date = new Date(today);
      date.setDate(date.getDate() + 14);
      return date.toISOString().split('T')[0];
    })();
    
    // Генеруємо номер фактури
    const generateInvoiceNumber = () => {
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const day = String(new Date().getDate()).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `INV-${year}${month}${day}-${random}`;
    };
    
    return {
      customer: '',
      invoiceNumber: generateInvoiceNumber(),
      issueDate: today,
      paymentMethod: 'Převodem',
      dueDate: dueDate,
      dueDateType: '14',
      currency: 'Kč',
      language: 'Čeština',
      bankAccount: '4914919003/5500',
      iban: 'CZ33 5500 0000 0049 1491 9003',
      swift: 'RZBCCZPP',
      showIban: 'Automaticky',
      orderNumber: '',
      variableSymbol: '20250001',
      constantSymbol: '0308',
      showPaymentInfo: true,
      // Supplier info
      ownerName: '',
      supplierEmail: 'xperementus@gmail.com',
      supplierAddress: 'Cihelní 2674/91',
      supplierCity: '700 30 Ostrava',
      supplierCountry: 'Česká republika',
      supplierICO: '21311048',
      supplierTaxStatus: 'Nejsme plátci DPH',
      supplierPhone: '737540605',
      // Customer details hydrated from chosen client
      customerAddress: '',
      customerCity: '',
      customerCountry: '',
      customerICO: '',
      customerDIC: '',
      // Advance payment fields
      advancePaymentType: 'Fakturu zaplacenou',
      advanceAmount: '',
      advancePercentage: '',
      advanceNote: '',
      // Additional text fields
      preItemsText: '',
      footerText: 'Fyzická osoba zapsaná v živnostenském rejstříku.',
      // Tab info
      activeTab: 'Faktura'
    };
  });
  
  const [isAdditionalOptionsOpen, setIsAdditionalOptionsOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isProfileWarningOpen, setIsProfileWarningOpen] = useState(false);
  const [profileWarningData, setProfileWarningData] = useState({ message: '', missingFields: [] as string[] });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', quantity: 1, unit: 'ks', description: '', pricePerUnit: 0 }
  ]);

  // Prefill supplier info from saved profile once
  useEffect(() => {
    try {
      const profile = loadProfileFromStorage();
      if (profile) {
        const supplierName = profile.company?.name?.trim()
          ? profile.company.name
          : `${profile.personal.firstName} ${profile.personal.lastName}`.trim();
        const supplierAddress = (profile.company?.address || profile.personal.address || '').toString();
        const supplierCity = `${(profile.company?.postalCode || profile.personal.postalCode || '').toString()} ${(profile.company?.city || profile.personal.city || '').toString()}`.trim();
        const supplierCountry = (profile.company?.country || profile.personal.country || 'Česká republika').toString();
        const supplierICO = (profile.company?.ico || profile.company?.registrationNumber || '').toString();
        const supplierEmail = (profile.personal?.email || '').toString();
        const supplierPhone = (profile.personal?.phone || '').toString();

        setFormData((prev) => ({
          ...prev,
          ownerName: supplierName,
          supplierAddress: supplierAddress || prev.supplierAddress,
          supplierCity: supplierCity || prev.supplierCity,
          supplierCountry: supplierCountry || prev.supplierCountry,
          supplierICO: supplierICO || prev.supplierICO,
          supplierEmail: supplierEmail || prev.supplierEmail,
          supplierPhone: supplierPhone || prev.supplierPhone,
        }));
      }
    } catch (_) {
      // ignore
    }
  }, []);

  // Завантажуємо дані фактури для редагування
  useEffect(() => {
    if (editInvoiceId && isOpen) {
      setIsEditMode(true);
      // Шукаємо фактуру в списку
      const invoiceToEdit = invoices.find(inv => inv.id === editInvoiceId || inv.invoiceNumber === editInvoiceId);
      
      if (invoiceToEdit) {
        console.log('📝 Loading invoice for editing:', invoiceToEdit);
        
        // Заповнюємо форму даними фактури
        setFormData({
          customer: invoiceToEdit.customer,
          invoiceNumber: invoiceToEdit.invoiceNumber,
          issueDate: new Date(invoiceToEdit.date).toISOString().split('T')[0],
          paymentMethod: 'Převodem',
          dueDate: new Date(invoiceToEdit.dueDate).toISOString().split('T')[0],
          dueDateType: '14',
          currency: 'Kč',
          language: 'Čeština',
          bankAccount: '4914919003/5500',
          iban: 'CZ33 5500 0000 0049 1491 9003',
          swift: 'RZBCCZPP',
          showIban: 'Automaticky',
          orderNumber: '',
          variableSymbol: invoiceToEdit.invoiceNumber.replace(/-/g, ''),
          constantSymbol: '0308',
          showPaymentInfo: true,
          ownerName: (invoiceToEdit as unknown as Record<string, unknown>).ownerName as string || '',
          supplierEmail: (invoiceToEdit as unknown as Record<string, unknown>).supplierEmail as string || 'xperementus@gmail.com',
          supplierAddress: (invoiceToEdit as unknown as Record<string, unknown>).supplierAddress as string || 'Cihelní 2674/91',
          supplierCity: (invoiceToEdit as unknown as Record<string, unknown>).supplierCity as string || '700 30 Ostrava',
          supplierCountry: (invoiceToEdit as unknown as Record<string, unknown>).supplierCountry as string || 'Česká republika',
          supplierICO: (invoiceToEdit as unknown as Record<string, unknown>).supplierICO as string || '21311048',
          supplierTaxStatus: 'Nejsme plátci DPH',
          supplierPhone: (invoiceToEdit as unknown as Record<string, unknown>).supplierPhone as string || '737540605',
          customerAddress: (invoiceToEdit as unknown as Record<string, unknown>).customerAddress as string || '',
          customerCity: (invoiceToEdit as unknown as Record<string, unknown>).customerCity as string || '',
          customerCountry: (invoiceToEdit as unknown as Record<string, unknown>).customerCountry as string || '',
          customerICO: (invoiceToEdit as unknown as Record<string, unknown>).customerICO as string || '',
          customerDIC: (invoiceToEdit as unknown as Record<string, unknown>).customerDIC as string || '',
          advancePaymentType: 'Fakturu zaplacenou',
          advanceAmount: '',
          advancePercentage: '',
          advanceNote: '',
          preItemsText: '',
          footerText: 'Fyzická osoba zapsaná v živnostenském rejstříku.',
          activeTab: 'Faktura'
        });
        
        // Заповнюємо items
        if (invoiceToEdit.items && invoiceToEdit.items.length > 0) {
          setItems(invoiceToEdit.items.map((item, index) => ({
            id: (index + 1).toString(),
            quantity: item.quantity,
            unit: 'ks',
            description: item.description,
            pricePerUnit: item.unitPrice
          })));
        }
      }
    } else {
      setIsEditMode(false);
    }
  }, [editInvoiceId, isOpen, invoices]);

  const calculateDueDateLocal = (issueDate: string, days: number = 14) => {
    return calculateDueDate(issueDate, days);
  };

  // Функція для перевірки профілю перед створенням фактури
  const checkProfileBeforeInvoice = () => {
    const validation = checkProfileFromStorage();
    if (!validation.isValid) {
      setProfileWarningData({
        message: validation.message,
        missingFields: validation.missingFields
      });
      setIsProfileWarningOpen(true);
      return false;
    }
    return true;
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      quantity: 1,
      unit: 'ks',
      description: '',
      pricePerUnit: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.pricePerUnit), 0);
  };

  // Валідація форми
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Обов'язкові поля
    if (!formData.customer.trim()) {
      newErrors.customer = 'Vyberte odběratele';
    }

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Číslo faktury je povinné';
    }

    if (!formData.issueDate) {
      newErrors.issueDate = 'Datum vystavení je povinné';
    }

    // Перевірка товарів
    const hasValidItems = items.some(item => 
      item.description.trim() && item.quantity > 0 && item.pricePerUnit > 0
    );
    
    if (!hasValidItems) {
      newErrors.items = 'Přidejte alespoň jeden položku s popisem, množstvím a cenou';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Перевіряємо профіль перед створенням фактури
    if (!checkProfileBeforeInvoice()) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    // Дані фактури
    const invoiceData = {
      invoiceNumber: formData.invoiceNumber,
      date: formData.issueDate,
      dueDate: formData.dueDate,
      customer: formData.customer,
      items: items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.pricePerUnit,
        total: item.quantity * item.pricePerUnit
      })),
      total: calculateTotal(),
      status: 'sent' as const
    };

    if (isEditMode && editInvoiceId) {
      // Оновлюємо існуючу фактуру
      console.log('🔄 Updating invoice:', editInvoiceId);
      const result = await updateInvoice(editInvoiceId, invoiceData);
      
      if (result.success) {
        console.log('✅ Invoice updated successfully');
        // Закриваємо модальне вікно
        onClose();
        // Залишаємось на поточній сторінці (або оновлюємо)
        router.push(`/faktury/${formData.invoiceNumber}`);
      } else {
        console.error('❌ Failed to update invoice:', result.error);
        alert('Помилка при оновленні фактури');
      }
    } else {
      // Створюємо нову фактуру
      console.log('➕ Creating new invoice');
      const result = await addInvoice(invoiceData);
      
      if (result.success) {
        console.log('✅ Invoice created successfully');
        // Закриваємо модальне вікно
        onClose();
        // Перенаправляємо на сторінку деталей фактури
        router.push(`/faktury/${formData.invoiceNumber}`);
      } else {
        console.error('❌ Failed to create invoice:', result.error);
        alert('Помилка при створенні фактури');
      }
    }
  };

  const handleNewClientSave = async (clientData: Omit<ClientData, 'id'>) => {
    console.log('💾 Saving new client:', clientData);
    
    // Зберігаємо клієнта в Firebase
    const result = await addClient(clientData);
    
    if (result.success) {
      console.log('✅ Client saved successfully with ID:', result.id);
      // Оновлюємо dropdown з новим клієнтом
      setFormData({...formData, customer: clientData.name});
    } else {
      console.error('❌ Failed to save client:', result.error);
      alert('Помилка збереження клієнта. Спробуйте ще раз.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header with Tabs */}
        <div className="bg-gray-800 text-white border-b border-gray-700">
          {/* Close button */}
          <div className="flex justify-end p-2">
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="px-4 pb-2">
            <div className="flex gap-2">
              {['Faktura', 'Zálohovka'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded border font-medium transition-colors text-sm ${
                    activeTab === tab
                      ? 'bg-money/20 border-money text-money'
                      : 'bg-transparent border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
              
              {/* Back button */}
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded border border-gray-600 text-gray-300 hover:border-gray-500 font-medium transition-colors flex items-center gap-2 ml-auto text-sm"
              >
                <ArrowLeft className="w-3 h-3" />
                Zpět
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer and Invoice Details */}
            <div className="space-y-4">
              {/* Customer */}
              <div>
                <label className="block text-sm font-medium text-money-dark mb-1">
                  Odběratel <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3">
                  <div className="relative w-80">
                    <select 
                      className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-3 py-2 pr-8 text-white focus:outline-none focus:border-money/50 transition-colors appearance-none text-sm"
                      value={formData.customer}
                      onChange={(e) => {
                        const name = e.target.value;
                        const selected = clients.find((c) => c.name === name);
                        setFormData({
                          ...formData,
                          customer: name,
                          customerAddress: selected ? selected.street : '',
                          customerCity: selected ? `${selected.postalCode} ${selected.city}` : '',
                          customerCountry: selected ? selected.country : '',
                          customerICO: selected ? selected.ico : '',
                          customerDIC: selected ? selected.dic : '',
                        });
                      }}
                    >
                      <option value="">Vyberte odběratele...</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.name}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsNewClientModalOpen(true)}
                    className="bg-money/10 border border-money/50 text-money px-3 py-2 rounded-lg hover:bg-money/20 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Nový odběratel
                  </button>
                </div>
                {errors.customer && (
                  <div className="text-red-400 text-xs mt-1">{errors.customer}</div>
                )}
              </div>

              {/* Invoice Number */}
              <div>
                <label className="block text-sm font-medium text-money-dark mb-1">
                  {activeTab === 'Zálohovka' ? 'Číslo zálohové faktury' : 'Číslo faktury'} <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="w-80 bg-gray-800/60 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-money/50 transition-colors text-sm"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                  />
                  <button 
                    type="button"
                    className="bg-gray-800/60 border border-gray-600 text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-700/60 transition-colors text-sm whitespace-nowrap"
                  >
                    Změnit
                  </button>
                </div>
                {errors.invoiceNumber && (
                  <div className="text-red-400 text-xs mt-1">{errors.invoiceNumber}</div>
                )}
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-money-dark mb-1">
                  Datum vystavení <span className="text-red-400">*</span>
                </label>
                <div className="relative w-80">
                  <input
                    type="date"
                    className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-money/50 transition-colors text-sm"
                    value={formData.issueDate}
                    onChange={(e) => {
                      setFormData({
                        ...formData, 
                        issueDate: e.target.value,
                        dueDate: calculateDueDateLocal(e.target.value)
                      });
                    }}
                  />
                  <Calendar className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.issueDate && (
                  <div className="text-red-400 text-xs mt-1">{errors.issueDate}</div>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-money-dark mb-1">
                  Splatnost
                </label>
                <div className="flex gap-3">
                  <div className="relative w-48">
                    <select 
                      className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-3 py-2 pr-8 text-white focus:outline-none focus:border-money/50 transition-colors appearance-none text-sm"
                      value={formData.dueDateType || "14"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "custom") {
                          setFormData({
                            ...formData,
                            dueDateType: value,
                            dueDate: formData.issueDate
                          });
                        } else {
                          const days = parseInt(value);
                          setFormData({
                            ...formData,
                            dueDateType: value,
                            dueDate: calculateDueDateLocal(formData.issueDate, days)
                          });
                        }
                      }}
                    >
                      <option value="1">1 den</option>
                      <option value="3">3 dny</option>
                      <option value="7">1 týden</option>
                      <option value="14">14 dní</option>
                      <option value="30">30 dní</option>
                      <option value="60">60 dní</option>
                      <option value="90">90 dní</option>
                      <option value="custom">Vlastní datum</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  
                  {formData.dueDateType === "custom" && (
                    <div className="relative w-32">
                      <input
                        type="date"
                        className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-money/50 transition-colors text-sm"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      />
                      <Calendar className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  )}
                </div>
                
                {formData.dueDateType !== "custom" && (
                  <p className="text-xs text-gray-400 mt-1">
                    (vyčází na {formData.dueDate || calculateDueDateLocal(formData.issueDate)})
                  </p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-money-dark mb-3">
                Platební metoda
              </label>
              <div className="flex flex-wrap gap-2">
                {['Banka', 'Kartou', 'Hotově', 'Dobírka', 'Jiná'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.paymentMethod === method
                        ? 'bg-money/20 border-money text-money'
                        : 'bg-gray-800/60 border-gray-600 text-gray-300 hover:bg-gray-700/60'
                    }`}
                    onClick={() => setFormData({...formData, paymentMethod: method})}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-money-dark mb-1">
                Měna
              </label>
              <div className="relative w-32">
                <select 
                  className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-3 py-2 pr-8 text-white focus:outline-none focus:border-money/50 transition-colors appearance-none text-sm"
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                >
                  <option value="CZK">CZK</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Advance Payment Specific Fields */}
            {activeTab === 'Zálohovka' && (
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 space-y-4">
                <h3 className="text-blue-300 font-medium text-sm mb-3">Nastavení zálohové faktury</h3>
                
                {/* Payment Type */}
                <div>
                  <label className="block text-sm font-medium text-money-dark mb-1">
                    <span className="bg-money text-black rounded-full w-5 h-5 inline-flex items-center justify-center text-xs font-bold mr-2">1</span>
                    S platbou vystavit
                  </label>
                  <div className="flex gap-2">
                    {['Fakturu zaplacenou', 'Fakturu s doplněním', 'Nic'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          formData.advancePaymentType === option
                            ? 'bg-money/20 border-money text-money'
                            : 'bg-gray-800/60 border-gray-600 text-gray-300 hover:border-gray-500'
                        }`}
                        onClick={() => setFormData({...formData, advancePaymentType: option})}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advance Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-money-dark mb-1">
                      <span className="bg-money text-black rounded-full w-5 h-5 inline-flex items-center justify-center text-xs font-bold mr-2">2</span>
                      Výše zálohy
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-money/50 transition-colors text-sm"
                      value={formData.advanceAmount || ''}
                      onChange={(e) => setFormData({...formData, advanceAmount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-money-dark mb-1">
                      <span className="bg-money text-black rounded-full w-5 h-5 inline-flex items-center justify-center text-xs font-bold mr-2">3</span>
                      Procento zálohy
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        className="flex-1 bg-gray-800/60 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-money/50 transition-colors text-sm"
                        value={formData.advancePercentage || ''}
                        onChange={(e) => setFormData({...formData, advancePercentage: e.target.value})}
                        placeholder="0"
                        max="100"
                      />
                      <span className="flex items-center text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                </div>

                {/* Final Invoice Info */}
                <div>
                  <label className="block text-sm font-medium text-money-dark mb-1">
                    <span className="bg-money text-black rounded-full w-5 h-5 inline-flex items-center justify-center text-xs font-bold mr-2">4</span>
                    Poznámka k zálohové faktuře
                  </label>
                  <textarea
                    className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-money/50 transition-colors text-sm"
                    rows={2}
                    value={formData.advanceNote || ''}
                    onChange={(e) => setFormData({...formData, advanceNote: e.target.value})}
                    placeholder="Dodatečné informace o zálohové faktuře..."
                  />
                </div>
              </div>
            )}

            {/* Additional Options */}
            <div className="bg-gray-800/30 rounded-lg p-4">
              <button
                type="button"
                onClick={() => setIsAdditionalOptionsOpen(!isAdditionalOptionsOpen)}
                className="text-money hover:text-money-light text-sm font-medium flex items-center gap-2 w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Další možnosti
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isAdditionalOptionsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isAdditionalOptionsOpen && (
                <div className="mt-4 space-y-4 border-t border-gray-700 pt-4">
                  {/* Language */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-money-dark mb-2">
                        Jazyk faktury
                      </label>
                      <div className="relative">
                        <select 
                          className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-money/50 transition-colors appearance-none"
                          value={formData.language}
                          onChange={(e) => setFormData({...formData, language: e.target.value})}
                        >
                          <option value="Čeština">Čeština</option>
                          <option value="English">English</option>
                          <option value="Slovenčina">Slovenčina</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Bank Account */}
                    <div>
                      <label className="block text-sm font-medium text-money-dark mb-2">
                        Bankovní účet
                      </label>
                      <div className="relative">
                        <select 
                          className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-money/50 transition-colors appearance-none"
                          value={formData.bankAccount}
                          onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                        >
                          <option value="Použít výchozí bankovní účet">Použít výchozí bankovní účet</option>
                          <option value="KB - 123456789/0100">KB - 123456789/0100</option>
                          <option value="ČSOB - 987654321/0300">ČSOB - 987654321/0300</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Show IBAN and Order Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-money-dark mb-2">
                        Zobrazit IBAN
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                            formData.showIban === 'Automaticky'
                              ? 'bg-money/20 border-money text-money'
                              : 'bg-gray-800/60 border-gray-600 text-gray-300 hover:bg-gray-700/60'
                          }`}
                          onClick={() => setFormData({...formData, showIban: 'Automaticky'})}
                        >
                          Automaticky
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                            formData.showIban === 'Vždy'
                              ? 'bg-money/20 border-money text-money'
                              : 'bg-gray-800/60 border-gray-600 text-gray-300 hover:bg-gray-700/60'
                          }`}
                          onClick={() => setFormData({...formData, showIban: 'Vždy'})}
                        >
                          Vždy
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-money-dark mb-2">
                        Číslo objednávky
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-money/50 transition-colors"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                        placeholder="Volitelné"
                      />
                    </div>
                  </div>

                  {/* Variable Symbol and Payment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                    <label className="block text-sm font-medium text-money-dark mb-2">
                      Variabilní symbol
                    </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-money/50 transition-colors"
                          value={formData.variableSymbol}
                          onChange={(e) => setFormData({...formData, variableSymbol: e.target.value})}
                        />
                        <button
                          type="button"
                          className="bg-gray-800/60 border border-gray-600 text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-700/60 transition-colors text-sm"
                        >
                          Změnit
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-money-dark mb-2">
                        Přílohy pro klienta
                      </label>
                      <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-3">
                        <p className="text-yellow-300 text-xs">
                          <span className="text-blue-400 underline cursor-pointer">Přejděte na placený tarif</span> a budete moci přiložit k faktuře soubor.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Text Areas */}
                  <div>
                    <label className="block text-sm font-medium text-money-dark mb-2">
                      Věta před položkami faktury
                    </label>
                    <textarea
                      className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-money/50 transition-colors resize-none"
                      rows={3}
                      value={formData.preItemsText}
                      onChange={(e) => setFormData({...formData, preItemsText: e.target.value})}
                      placeholder="Volitelné"
                    />
                  </div>

                                      <div>
                      <label className="block text-sm font-medium text-money-dark mb-2">
                        Patička faktury
                      </label>
                    <textarea
                      className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-money/50 transition-colors resize-none"
                      rows={3}
                      value={formData.footerText}
                      onChange={(e) => setFormData({...formData, footerText: e.target.value})}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Výchozí text můžete změnit v <span className="text-gray-300">Nastavení → Výchozí hodnoty</span>. Naše reklamní věta zmizí v jakémkoli placeném tarifu.
                    </p>
                  </div>

                  {/* Payment Info Checkbox */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showPaymentInfo"
                      checked={formData.showPaymentInfo}
                      onChange={(e) => setFormData({...formData, showPaymentInfo: e.target.checked})}
                      className="w-4 h-4 text-money bg-gray-800 border-gray-600 rounded focus:ring-money focus:ring-2"
                    />
                    <label htmlFor="showPaymentInfo" className="text-sm text-gray-300">
                      Zobrazit &bdquo;Neplatíte, již uhrazeno&ldquo;
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Položky faktury <span className="text-red-400">*</span></h3>
              <div className="bg-gray-800/30 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800/50 border-b border-gray-700 text-sm font-medium text-gray-300">
                  <div className="col-span-1">POČET</div>
                  <div className="col-span-1">MJ</div>
                  <div className="col-span-6">POPIS</div>
                  <div className="col-span-3">CENA ZA MJ</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Table Rows */}
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700/50 items-center">
                    <div className="col-span-1">
                      <input
                        type="number"
                        min="1"
                        className="w-full bg-gray-800/60 border border-gray-600 rounded px-3 py-2 text-white text-center focus:outline-none focus:border-money/50"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="col-span-1">
                      <div className="relative">
                        <select
                          className="w-full bg-gray-800/60 border border-gray-600 rounded px-3 py-2 pr-8 text-white text-center focus:outline-none focus:border-money/50 appearance-none"
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                        >
                          <option value="ks">ks</option>
                          <option value="hod">hod</option>
                          <option value="den">den</option>
                          <option value="m">m</option>
                          <option value="m²">m²</option>
                          <option value="kg">kg</option>
                          <option value="l">l</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="col-span-6">
                      <textarea
                        className="w-full bg-gray-800/60 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-money/50 resize-none"
                        rows={2}
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Popis položky..."
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full bg-gray-800/60 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-money/50"
                        value={item.pricePerUnit}
                        onChange={(e) => updateItem(item.id, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        disabled={items.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Item Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-gray-800/60 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Přidat položku
                </button>
              </div>

              {/* Discount Button */}
              <div className="mt-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-300 text-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Sleva z faktury
                </button>
              </div>
              
              {errors.items && (
                <div className="text-red-400 text-xs mt-2">{errors.items}</div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-end">
              <div className="bg-gray-800/50 rounded-lg p-6 min-w-[300px]">
                <div className="text-right">
                  <div className="text-3xl font-bold text-white mb-2">
                    {calculateTotal().toFixed(2)} {formData.currency}
                  </div>
                  <div className="text-sm text-gray-400">Celková částka</div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-4 p-6 border-t border-gray-700 bg-gray-800">
          <div className="flex gap-4">
            <button
              type="button"
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-600 hover:border-gray-500"
            >
              Uložit jako koncept
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-600 hover:border-gray-500"
            >
              Zobrazit náhled
            </button>
            
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-3 bg-money hover:bg-money-light text-black rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg"
            >
              {isEditMode ? 'Uložit změny' : (activeTab === 'Zálohovka' ? 'Vytvořit zálohovku' : 'Vytvořit fakturu')}
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* New Client Modal */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onSave={handleNewClientSave}
      />

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        invoiceData={{
          ...formData,
          items: items.map(item => ({
            description: item.description,
            quantity: item.quantity.toString(),
            unit: item.unit,
            price: item.pricePerUnit.toFixed(2).replace('.', ','),
            total: (item.quantity * item.pricePerUnit).toFixed(2).replace('.', ',')
          })),
          totalAmount: items.reduce((sum, item) => {
            const total = item.quantity * item.pricePerUnit;
            return sum + total;
          }, 0).toFixed(2).replace('.', ','),
          activeTab: activeTab
        }}
      />

      {/* Profile Warning Modal */}
      <ProfileWarningModal
        isOpen={isProfileWarningOpen}
        onClose={() => setIsProfileWarningOpen(false)}
        message={profileWarningData.message}
        missingFields={profileWarningData.missingFields}
      />
    </div>
  );
} 