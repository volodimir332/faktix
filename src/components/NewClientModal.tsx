'use client';

import React, { useState } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { searchByICO as searchCompanyByICO, searchByName as searchCompanyByName, getZivnostType, determineZivnostType, AresCompanyData } from '@/lib/ares-api';
import { useClients } from '@/contexts/ClientContext';
import { ClientData } from '@/types';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<ClientData, 'id'>) => void;
}

export function NewClientModal({ isOpen, onClose, onSave }: NewClientModalProps) {
  const { addClient } = useClients();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Česká republika',
    ico: '',
    dic: '',
    typZivnosti: 'Nedefinováno'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<AresCompanyData[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearchByICO = async () => {
    if (!searchQuery.trim()) {
      return;
    }
    
    setIsSearching(true);
    
    try {
      console.log('🔄 Starting two-step search process for IČO:', searchQuery.trim());
      
      // Крок 1: Отримуємо основні дані з ARES
      console.log('📡 Step 1: Fetching data from ARES...');
      const response = await searchCompanyByICO(searchQuery.trim());
      
      if (response.success && response.data) {
        console.log('✅ ARES data received:', response.data.obchodniJmeno);
        
        // Крок 2: Отримуємо тип живності з Živnostenský rejstřík
        console.log('📡 Step 2: Fetching živnost data from RZP...');
        let typZivnosti = "Nedefinováno";
        
        try {
          const zivnostResult = await getZivnostType(response.data.ico);
          console.log('📊 Živnost API response:', zivnostResult);
          
          if (zivnostResult.success && zivnostResult.data) {
            console.log('📋 Raw živnost data:', zivnostResult.data);
            typZivnosti = determineZivnostType(zivnostResult.data);
            console.log('🎯 Determined živnost type:', typZivnosti);
          } else {
            console.warn('⚠️ Živnost data not found or error:', zivnostResult.error);
          }
        } catch (error) {
          console.error('❌ Error fetching živnost data:', error);
          // Продовжуємо без типу живності
        }

        // Автоматично заповнюємо всі поля включаючи тип живності
        const newFormData = {
          ...formData,
          name: response.data.obchodniJmeno,
          street: response.data.adresa.ulice,
          city: response.data.adresa.mesto,
          postalCode: response.data.adresa.psc,
          country: 'Česká republika',
          ico: response.data.ico,
          dic: response.data.dic || '',
          typZivnosti: typZivnosti // Додаємо тип живності
        };
        
        console.log('✅ Form data updated with živnost type:', typZivnosti);
        setFormData(newFormData);
        setSearchResults([]);
        setShowSearchResults(false);
      } else {
        // Якщо не знайдено по IČO, спробуємо пошук по назві
        const nameResponse = await searchCompanyByName(searchQuery.trim());
        if (nameResponse.success && nameResponse.data) {
          setSearchResults([nameResponse.data]);
        } else {
          setSearchResults([]);
        }
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Тихо обробляємо помилку без показу користувачу
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchByName = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await searchCompanyByName(searchQuery.trim());
      if (response.success && response.data) {
        setSearchResults([response.data]);
      } else {
        setSearchResults([]);
      }
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
      // Тихо обробляємо помилку без показу користувачу
    } finally {
      setIsSearching(false);
    }
  };

  // Автоматичний пошук при введенні IČO (8 цифр)
  const handleAutoSearch = async (value: string) => {
    // Перевіряємо чи це IČO (8 цифр)
    if (value.length === 8 && /^\d{8}$/.test(value)) {
      setIsSearching(true);
      try {
        console.log('🔄 Auto-search triggered for IČO:', value);
        
        // Крок 1: Отримуємо основні дані з ARES
        const response = await searchCompanyByICO(value);
        if (response.success && response.data) {
          console.log('✅ ARES data received for auto-search:', response.data.obchodniJmeno);
          
          // Крок 2: Отримуємо тип живності з Živnostenský rejstřík
          let typZivnosti = "Nedefinováno";
          
          try {
            const zivnostResult = await getZivnostType(response.data.ico);
            console.log('📊 Auto-search živnost API response:', zivnostResult);
            
            if (zivnostResult.success && zivnostResult.data) {
              console.log('📋 Auto-search raw živnost data:', zivnostResult.data);
              typZivnosti = determineZivnostType(zivnostResult.data);
              console.log('🎯 Auto-search determined živnost type:', typZivnosti);
            } else {
              console.warn('⚠️ Auto-search: Živnost data not found or error:', zivnostResult.error);
            }
          } catch (error) {
            console.error('❌ Auto-search: Error fetching živnost data:', error);
            // Продовжуємо без типу живності
          }

          // Автоматично заповнюємо всі поля включаючи тип живності
          const newFormData = {
            ...formData,
            name: response.data.obchodniJmeno,
            street: response.data.adresa.ulice,
            city: response.data.adresa.mesto,
            postalCode: response.data.adresa.psc,
            country: 'Česká republika',
            ico: response.data.ico,
            dic: response.data.dic || '',
            typZivnosti: typZivnosti // Додаємо тип живності
          };
          
          console.log('✅ Auto-search form data updated with živnost type:', typZivnosti);
          setFormData(newFormData);
          setSearchResults([]);
          setShowSearchResults(false);
        }
      } catch (error) {
        console.error('Auto search error:', error);
        // Тихо обробляємо помилку без показу користувачу
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSelectCompany = async (company: AresCompanyData) => {
    console.log('🔄 Company selected from search results:', company.obchodniJmeno);
    
    // Крок 2: Отримуємо тип живності з Živnostenský rejstřík
    let typZivnosti = "Nedefinováno";
    
    try {
      const zivnostResult = await getZivnostType(company.ico);
      console.log('📊 Select company živnost API response:', zivnostResult);
      
      if (zivnostResult.success && zivnostResult.data) {
        console.log('📋 Select company raw živnost data:', zivnostResult.data);
        typZivnosti = determineZivnostType(zivnostResult.data);
        console.log('🎯 Select company determined živnost type:', typZivnosti);
      } else {
        console.warn('⚠️ Select company: Živnost data not found or error:', zivnostResult.error);
      }
    } catch (error) {
      console.error('❌ Select company: Error fetching živnost data:', error);
      // Продовжуємо без типу живності
    }

    setFormData({
      ...formData,
      name: company.obchodniJmeno,
      street: company.adresa.ulice,
      city: company.adresa.mesto,
      postalCode: company.adresa.psc,
      country: 'Česká republika',
      ico: company.ico,
      dic: company.dic || '',
      typZivnosti: typZivnosti // Додаємо тип живності
    });
    
    console.log('✅ Company selection form data updated with živnost type:', typZivnosti);
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Додаємо клієнта до контексту
    addClient(formData);
    
    // Викликаємо оригінальну функцію onSave
    onSave(formData);
    
    setFormData({
      name: '',
      email: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'Česká republika',
      ico: '',
      dic: '',
      typZivnosti: 'Nedefinováno'
    });
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 text-white border-b border-gray-700 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Zadejte název odběratele/dodavatele nebo IČO</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Search Field */}
          <div className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 bg-gray-800/60 border border-green-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400 transition-colors"
                placeholder="Zadejte IČO nebo název firmy..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  // Автоматичний пошук при введенні IČO
                  handleAutoSearch(value);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchByICO();
                  }
                }}
              />
              <button 
                onClick={handleSearchByICO}
                disabled={isSearching}
                className="bg-money/20 border border-money text-money px-4 py-3 rounded-lg hover:bg-money/30 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                IČO
              </button>
              <button 
                onClick={handleSearchByName}
                disabled={isSearching}
                className="bg-blue-600/20 border border-blue-600 text-blue-400 px-4 py-3 rounded-lg hover:bg-blue-600/30 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Název
              </button>
            </div>
            
            {/* Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="mt-4 bg-gray-800/60 border border-gray-600 rounded-lg max-h-60 overflow-y-auto">
                {searchResults.map((company, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectCompany(company)}
                    className="p-3 border-b border-gray-600 last:border-b-0 hover:bg-gray-700/60 cursor-pointer transition-colors"
                  >
                    <div className="font-medium text-white">{company.obchodniJmeno}</div>
                    <div className="text-sm text-gray-400">
                      IČO: {company.ico} • {company.adresa.ulice}, {company.adresa.mesto} {company.adresa.psc}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-gray-400 text-sm mt-2 text-center">
              {isSearching ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Hledám...</span>
                </div>
              ) : (
                <p>Subjekty bez IČO a zahraniční firmy vyplňte ručně ↓</p>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name / Company */}
            <div>
              <label className="block text-sm font-medium text-money-dark mb-2">
                Název / Jméno a příjmení <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-money/50 transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-money-dark mb-2">
                Hlavní email
              </label>
              <input
                type="email"
                className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-money/50 transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-medium text-money-dark mb-2">
                Ulice
              </label>
              <input
                type="text"
                className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-money/50 transition-colors"
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-money-dark mb-2">
                Město
              </label>
              <input
                type="text"
                className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-money/50 transition-colors"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>

            {/* Postal Code and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-money-dark mb-2">
                  PSČ
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-money/50 transition-colors"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-money-dark mb-2">
                  Země <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-money/50 transition-colors"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                />
              </div>
            </div>

            {/* IČO and DIČ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-money-dark mb-2">
                  IČO
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-money/50 transition-colors"
                  value={formData.ico}
                  onChange={(e) => setFormData({...formData, ico: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-money-dark mb-2">
                  DIČ
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-money/50 transition-colors"
                  value={formData.dic}
                  onChange={(e) => setFormData({...formData, dic: e.target.value})}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors border border-gray-600 hover:border-gray-500"
              >
                Zrušit
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-money hover:bg-money-light text-black rounded-lg font-semibold transition-colors shadow-lg"
              >
                Uložit odběratele
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 