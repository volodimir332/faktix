"use client";

import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SimplePriceCalculator from '@/components/SimplePriceCalculator';
import AIConversation, { ConversationMessage } from '@/components/AIConversation';
import { getCalculatorIcon } from '@/components/CalculatorIcons';
import { getCzechConstructionKnowledge } from '@/lib/czech-construction-data';
import { Sparkles, Loader2, Send, Calculator, Tag } from 'lucide-react';
import { SimpleCalculatorTemplate } from '@/lib/calculator-templates';
import { useInvoices } from '@/contexts/InvoiceContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

interface SavedTemplate {
  id: string;
  name: string;
  baseTemplateId: string;
  items: {
    id: string;
    name: string;
    unit: string;
    price: number;
    quantity: number;
    total: number;
  }[];
  total: number;
  createdAt: string;
}

type TabType = 'kalkulace' | 'cenove-nabidky';

export default function RozpocetPage() {
  const [activeTab, setActiveTab] = useState<TabType>('kalkulace');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<SimpleCalculatorTemplate | null>(null);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isInConversation, setIsInConversation] = useState(false);
  
  const { addInvoice } = useInvoices();
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { showToast, ToastContainer } = useToast();

  // Load saved templates from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saved-rozpocet-templates');
      if (saved) {
        try {
          setSavedTemplates(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load saved templates:', e);
        }
      }
    }
  }, []);

  const askAIQuestion = async (userMessage: string, conversationHistory: ConversationMessage[]) => {
    setIsLoading(true);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || 'sk-88afcb2330714e84a2d319156c27e406';
      
      // Build conversation context for AI
      const messages = [
        {
          role: 'system' as const,
          content: `Jsi expertní asistent pro stavební kalkulace. Tvůj úkol:

1. Pokud je to první zpráva uživatele, položíš JEDNU jednoduchou otázku pro upřesnění typu kalkulátoru
2. Odpověď zformuluj jako JSON s tímto formátem:
   {"question": "text otázky", "options": ["Varianta 1", "Varianta 2", "Varianta 3"]}
3. NEPTEJ se na rozměry, množství, ceny - pouze na TYP kalkulátoru!
4. Po JEDNÉ odpovědi uživatele IHNED vrať: {"generate": true}
5. Otázka musí být jednoduchá - jen upřesnění typu práce

Příklady správných otázek:
- Uživatel: "kalkulátor pro dlažbu" 
  → {"question": "Jaký typ dlažby vás zajímá?", "options": ["Koupelna a WC", "Podlaha v celém bytě", "Obklady a dlažba komplet"]}
  
- Uživatel: "fasáda"
  → {"question": "Jaký typ fasádních prací?", "options": ["Zateplení a nová omítka", "Pouze nátěr fasády", "Kompletní renovace fasády"]}

- Uživatel: "střecha"
  → {"question": "O jaké střešní práce máte zájem?", "options": ["Nová krytina", "Oprava stávající střechy", "Kompletní přestavba střechy"]}

PO ODPOVĚDI UŽIVATELE VŽDY vrať {"generate": true} a IHNED vytvoř kalkulátor!`
        },
        ...conversationHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user' as const, content: userMessage }
      ];

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Try to parse as JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        if (parsed.generate) {
          // Hide conversation, show loading on main screen
          setIsInConversation(false);
          setConversation([]);
          
          // Time to generate calculator
          await generateCalculatorFromAI(conversationHistory);
        } else if (parsed.question && parsed.options) {
          // Add AI question to conversation
          setConversation(prev => [...prev, {
            role: 'assistant',
            content: parsed.question,
            options: parsed.options
          }]);
        }
      }
    } catch (error) {
      console.error('AI error:', error);
      showToast('Chyba při komunikaci s AI. Zkuste to znovu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalculatorFromAI = async (conversationHistory: ConversationMessage[]) => {
    setIsLoading(true);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || 'sk-88afcb2330714e84a2d319156c27e406';
      
      // Extract user's requirements from conversation
      const userRequirements = conversationHistory
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join('. ');
      
      const czechKnowledge = getCzechConstructionKnowledge();
      
      const prompt = `Jsi expert na české stavebnictví. Vytvoř profesionální stavební rozpočet pro: ${userRequirements}

${czechKnowledge}

DŮLEŽITÉ POŽADAVKY:
1. Použij POUZE správné české stavební termíny (ne obecné názvy)
2. Ceny musí odpovídat reálným tržním cenám v České republice (2025)
3. Zahrň VŠECHNY potřebné položky pro danou práci (materiály, práce, doplňky)
4. Dodržuj české normy a běžné postupy ve stavebnictví
5. Rozpočet musí být komplexní a profesionální, s jasnými položkami a finální cenou

CENOVÉ ORIENTACE (České Kč, 2025):
- Dlažba keramická: 200-600 Kč/m² (materiál), pokládka: 300-500 Kč/m²
- Lepidlo na dlažbu: 150-250 Kč/25kg
- Spárovací hmota: 200-350 Kč/5kg
- Fasádní omítka: 400-800 Kč/m² (vč. práce)
- Zateplení fasády: 1200-2000 Kč/m² (vč. práce)
- Střešní krytina (pálená taška): 300-600 Kč/m²
- Pokrývačské práce: 400-700 Kč/m²
- Malířské práce: 150-300 Kč/m²
- Barva interiérová: 200-400 Kč/l
- Sádrokarton deska: 120-200 Kč/m²
- Montáž sádrokartonu: 200-350 Kč/m²
- Podlahová laminát: 300-800 Kč/m²
- Pokládka podlahy: 150-300 Kč/m²

ČESKÉ STAVEBNÍ TERMÍNY (používej přesně tyto):
- Dlažba keramická, Obklady, Lepidlo flexibilní, Spárovací hmota
- Fasádní omítka tenkovrstvá, Kontaktní zateplovací systém (ETICS)
- Střešní krytina (taška, plech), Latě, Kontralatě, Parozábrana
- Malířská barva disperzní, Penetrace, Štuk
- Sádrokartonové desky (SDK), CD profily, UD profily
- Laminátová podlaha, Podložka pod laminát

Vrať POUZE čistý JSON:
{
  "id": "rozpocet-${Date.now()}",
  "name": "Přesný český název rozpočtu",
  "description": "Stručný popis prací",
  "icon": "📊",
  "category": "construction",
  "items": [
    {
      "id": "item-1",
      "name": "Přesný český termín",
      "unit": "m²",
      "defaultPrice": 450,
      "defaultQuantity": 0
    }
  ]
}

Jednotky: m, m², m³, bm (běžný metr), ks, kg, l, t, bal, role, hod, den.
Zahrň minimálně 8-12 položek pro komplexní rozpočet.`;

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { 
              role: 'system', 
              content: `Jsi expert na české stavebnictví s dokonalou znalostí:
- Českých stavebních termínů a názvosloví
- Aktuálních tržních cen materiálů a prací v ČR (2025)
- Českých stavebních norem a postupů
- Komplexního rozsahu prací pro každý typ zakázky

Vždy odpovídáš pouze validním JSON s přesnými českými termíny a realistickými cenami.` 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate calculator');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const calculatorData = JSON.parse(jsonMatch[0]);
        setGeneratedTemplate(calculatorData);
        setIsInConversation(false);
        setConversation([]); // Clear conversation history
        showToast('Rozpočet byl úspěšně vytvořen! ✨', 'success');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      showToast('Nepodařilo se vygenerovat kalkulátor. Zkuste to prosím znovu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      const userMsg = inputValue.trim();
      
      // Add user message to conversation
      const newConversation = [...conversation, { role: 'user' as const, content: userMsg }];
      setConversation(newConversation);
      setInputValue('');
      setIsInConversation(true);
      
      // Ask AI for clarifying questions or generate
      askAIQuestion(userMsg, newConversation);
    }
  };

  const handleOptionClick = (option: string) => {
    if (isLoading) return;
    
    // Add user's selected option to conversation
    const newConversation = [...conversation, { role: 'user' as const, content: option }];
    setConversation(newConversation);
    
    // Continue conversation
    askAIQuestion(option, newConversation);
  };

  const handleSaveTemplate = (
    items: { id: string; name: string; unit: string; price: number; quantity: number; total: number }[], 
    total: number, 
    templateName: string
  ) => {
    const newSavedTemplate: SavedTemplate = {
      id: `saved-${Date.now()}`,
      name: `${templateName} - ${new Date().toLocaleDateString()}`,
      baseTemplateId: generatedTemplate?.id || '',
      items,
      total,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedTemplates, newSavedTemplate];
    setSavedTemplates(updated);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('saved-rozpocet-templates', JSON.stringify(updated));
    }

    showToast('Rozpočet byl úspěšně uložen! 💾', 'success');
  };

  const handleCreateInvoice = async (
    items: { id: string; name: string; unit: string; price: number; quantity: number; total: number }[], 
    total: number
  ) => {
    try {
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const day = String(new Date().getDate()).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const invoiceNumber = `INV-${year}${month}${day}-${random}`;

      const invoiceItems = items
        .filter(item => item.quantity > 0)
        .map((item, index) => ({
          id: `item-${index}`,
          description: `${item.name} (${item.unit})`,
          quantity: item.quantity,
          unitPrice: item.price,
          total: item.total,
        }));

      if (invoiceItems.length === 0) {
        showToast('Nelze vytvořit fakturu bez položek. Zadejte množství.', 'error');
        return;
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      const invoiceData = {
        invoiceNumber,
        date: new Date().toISOString(),
        dueDate: dueDate.toISOString(),
        customer: 'Nový zákazník',
        items: invoiceItems,
        total,
        status: 'draft' as const,
      };

      const result = await addInvoice(invoiceData);
      
      if (result.success) {
        showToast('Faktura byla úspěšně vytvořena! 📄', 'success');
        router.push(`/faktury/${invoiceNumber}`);
      } else {
        showToast('Chyba při vytváření faktury', 'error');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      showToast('Chyba při vytváření faktury', 'error');
    }
  };

  const handleSendCalculation = (
    items: { id: string; name: string; unit: string; price: number; quantity: number; total: number }[], 
    total: number
  ) => {
    const summary = items
      .filter(item => item.quantity > 0)
      .map(item => `${item.name}: ${item.quantity} ${item.unit} × ${item.price} Kč = ${item.total.toLocaleString()} Kč`)
      .join('\n');

    const text = `Rozpočet: ${generatedTemplate?.name}\n\n${summary}\n\nCelkem: ${total.toLocaleString()} Kč`;

    navigator.clipboard.writeText(text).then(() => {
      showToast('Rozpočet byl zkopírován do schránky! 📋', 'success');
    }).catch(() => {
      showToast('Nepodařilo se zkopírovat rozpočet', 'error');
    });
  };

  const loadSavedTemplate = (saved: SavedTemplate) => {
    // Load the full saved calculation with all data
    const templateWithData: SimpleCalculatorTemplate = {
      id: saved.baseTemplateId || `saved-${saved.id}`,
      name: saved.name,
      description: 'Uložená kalkulace',
      icon: '📋',
      category: 'saved',
      items: saved.items.map(item => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        defaultPrice: item.price, // Load saved prices
        defaultQuantity: item.quantity, // Load saved quantities
      })),
    };
    
    setGeneratedTemplate(templateWithData);
    showToast('Rozpočet byl načten! 📋', 'success');
  };

  const deleteSavedTemplate = (id: string) => {
    if (!confirm('Opravdu chcete smazat tento uložený rozpočet?')) return;
    
    const updated = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updated);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('saved-rozpocet-templates', JSON.stringify(updated));
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-black text-white">
        <Sidebar />
      
      {/* Flex container для контенту та історії */}
      <div className="ml-16 flex min-h-screen overflow-hidden">
        
        {/* Main Content Area */}
        <div className="flex flex-col min-h-screen w-full">
          {/* Header - Tabs + Nový rozpočet */}
          <div className="flex-shrink-0 px-6 py-3 bg-black border-b border-gray-800">
            <div className="flex items-center gap-3">
              {/* Tabs - Left */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('kalkulace')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border-2 ${
                    activeTab === 'kalkulace'
                      ? 'border-money text-money bg-transparent'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white hover:border-gray-600'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Kalkulace</span>
                </button>
                <button
                  onClick={() => setActiveTab('cenove-nabidky')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border-2 ${
                    activeTab === 'cenove-nabidky'
                      ? 'border-money text-money bg-transparent'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white hover:border-gray-600'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Cenové nabídky</span>
                </button>
              </div>

              {/* Nový rozpočet Button */}
              {generatedTemplate && (
                <button
                  onClick={() => {
                    setGeneratedTemplate(null);
                    setConversation([]);
                    setIsInConversation(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border-2 border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white hover:border-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Nový rozpočet</span>
                </button>
              )}

              {/* Spacer */}
              <div className="flex-1"></div>

            </div>
          </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {!generatedTemplate ? (
              <>
                {/* AI Input Section - ChatGPT Style */}
                <div className="flex flex-col items-center justify-center min-h-[70vh]">
                  {!isInConversation ? (
                    <>
                      <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-4xl font-bold mb-3">Jak vám mohu pomoci?</h2>
                        <p className="text-gray-400">
                          Popište stavební práce a AI vytvoří profesionální rozpočet s cenami
                        </p>
                      </div>
                      
                      {/* Loading message during calculator generation */}
                      {isLoading && !isInConversation && (
                        <div className="mb-8 text-center animate-fade-in">
                          <div className="inline-flex items-center gap-3 px-6 py-4 bg-money/10 border border-money/30 rounded-xl">
                            <Loader2 className="w-5 h-5 text-money animate-spin" />
                            <span className="text-money font-medium">Vytvářím rozpočet...</span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* AI Conversation Display */}
                      <div className="w-full max-w-3xl mb-4 flex justify-end animate-fade-in">
                        <button
                          onClick={() => {
                            setConversation([]);
                            setIsInConversation(false);
                            setInputValue('');
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-all border-2 border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white hover:border-gray-600"
                        >
                          <X className="w-4 h-4" />
                          Začít znovu
                        </button>
                      </div>
                      <AIConversation 
                        messages={conversation} 
                        onOptionClick={handleOptionClick}
                        isLoading={isLoading}
                      />
                    </>
                  )}

                  <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                    <div className="relative flex items-end gap-2 bg-gray-800/50 border-2 border-gray-700 rounded-xl shadow-lg hover:border-gray-600 focus-within:!border-money focus-within:shadow-[0_0_20px_8px_rgba(0,255,136,0.25),0_0_40px_12px_rgba(0,255,136,0.15)] transition-all duration-200 p-2">
                      <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                        placeholder="Např: Rozpočet pro dlažbu v koupelně 15m², malování pokoje 20m²..."
                        className="flex-1 px-3 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-0 resize-none max-h-32"
                        rows={1}
                        disabled={isLoading}
                        style={{ minHeight: '40px', outline: 'none' }}
                      />
                      
                      <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="p-2 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Saved Templates (with prices, without quantities) */}
                  {savedTemplates.length > 0 ? (
                    <div className="mt-12 w-full max-w-5xl">
                      <h3 className="text-xl font-bold mb-4 text-center">Nebo vyberte šablonu:</h3>
                      <p className="text-gray-400 text-sm text-center mb-4">
                        Šablony s cenami za jednotku - stačí zadat množství
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {/* Get unique templates by baseTemplateId or name */}
                        {Array.from(new Map(savedTemplates.map(t => [t.baseTemplateId || t.name, t])).values()).map((savedTemplate) => {
                          // Create a clean template from saved data (with prices, without quantities)
                          const cleanTemplate: SimpleCalculatorTemplate = {
                            id: savedTemplate.baseTemplateId || `template-${savedTemplate.id}`,
                            name: savedTemplate.name.split(' - ')[0], // Remove date part
                            description: 'Váš uložený šablona',
                            icon: '📋',
                            category: 'saved',
                            items: savedTemplate.items.map(item => ({
                              id: item.id,
                              name: item.name,
                              unit: item.unit,
                              defaultPrice: item.price, // Save prices in template
                              defaultQuantity: 0, // No quantities in template
                            })),
                          };
                          
                          const IconComponent = getCalculatorIcon(cleanTemplate.name);
                          
                          return (
                            <button
                              key={savedTemplate.id}
                              onClick={() => setGeneratedTemplate(cleanTemplate)}
                              className="p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-money/50 rounded-xl text-left transition-all group"
                            >
                              <div className="mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                <IconComponent className="w-12 h-12" />
                              </div>
                              <div className="text-white text-sm font-medium group-hover:text-money transition-colors">
                                {cleanTemplate.name}
                              </div>
                              <div className="text-gray-500 text-xs mt-1">
                                {cleanTemplate.items.length} položek
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-12 w-full max-w-3xl text-center">
                      <div className="p-8 bg-gray-800/30 border border-gray-700 rounded-xl">
                        <div className="text-5xl mb-4">📊</div>
                        <h3 className="text-xl font-bold mb-2">Zatím nemáte žádné rozpočty</h3>
                        <p className="text-gray-400 text-sm">
                          Vytvořte rozpočet a uložte jej - poté se zde zobrazí jako šablona pro opakované použití
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="animate-fade-in">
                {/* Generated Calculator */}
                <SimplePriceCalculator
                  template={generatedTemplate}
                  onSave={handleSaveTemplate}
                  onCreateInvoice={handleCreateInvoice}
                  onSend={handleSendCalculation}
                  mode={activeTab}
                />
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
      </div>
    </>
  );
}
