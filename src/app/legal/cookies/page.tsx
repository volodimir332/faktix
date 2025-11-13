"use client";

import { Cookie, Shield, Eye, BarChart3, Target, Settings, Trash2 } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Cookie className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Zásady používání cookies
              </h1>
              <p className="text-slate-600 mt-1">
                Platné od 1. ledna 2025
              </p>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-slate-700 leading-relaxed">
              Tento dokument vysvětluje, jak platforma <strong>Faktix</strong> používá cookies 
              a podobné technologie. Vaše soukromí je pro nás důležité, proto vám poskytujeme 
              plnou kontrolu nad tím, které cookies můžeme používat.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          
          {/* 1. Co jsou cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                1. Co jsou cookies?
              </h2>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <p className="text-slate-700">
                <strong>Cookies</strong> jsou malé textové soubory, které se ukládají do vašeho 
                prohlížeče při návštěvě webových stránek. Pomáhají webům:
              </p>
              
              <ul className="space-y-2 text-slate-700 ml-6">
                <li>• Zapamatovat si vaše přihlášení</li>
                <li>• Ukládat vaše preference</li>
                <li>• Analyzovat návštěvnost</li>
                <li>• Zlepšovat uživatelskou zkušenost</li>
                <li>• Poskytovat relevantní obsah</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                <p className="text-slate-700 text-sm">
                  💡 <strong>Důležité:</strong> Cookies neobsahují viry a nemohou přistupovat 
                  k datům na vašem počítači. Můžete je kdykoli smazat nebo blokovat v nastavení prohlížeče.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Jaké cookies používáme */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                2. Jaké cookies používáme
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Nutné cookies */}
              <div className="border-l-4 border-emerald-500 bg-emerald-50 p-5 rounded-r-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-lg text-slate-800">
                    ✅ Nezbytné cookies (nelze odmítnout)
                  </h3>
                </div>
                
                <p className="text-slate-700 mb-3">
                  Tyto cookies jsou nezbytné pro fungování platformy a nelze je vypnout:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-slate-800">Název</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-800">Účel</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-800">Platnost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-200">
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">auth_token</td>
                        <td className="px-3 py-2 text-slate-700">Autentifikace uživatele</td>
                        <td className="px-3 py-2 text-slate-700">30 dní</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">session_id</td>
                        <td className="px-3 py-2 text-slate-700">Identifikace relace</td>
                        <td className="px-3 py-2 text-slate-700">Do zavření prohlížeče</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">csrf_token</td>
                        <td className="px-3 py-2 text-slate-700">Ochrana proti CSRF útokům</td>
                        <td className="px-3 py-2 text-slate-700">24 hodin</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">cookie_consent</td>
                        <td className="px-3 py-2 text-slate-700">Ukládání vašich cookie preferencí</td>
                        <td className="px-3 py-2 text-slate-700">1 rok</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">language</td>
                        <td className="px-3 py-2 text-slate-700">Jazyková preference</td>
                        <td className="px-3 py-2 text-slate-700">1 rok</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytické cookies */}
              <div className="border-l-4 border-blue-500 bg-blue-50 p-5 rounded-r-xl">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-lg text-slate-800">
                    📊 Analytické cookies (volitelné)
                  </h3>
                </div>
                
                <p className="text-slate-700 mb-3">
                  Pomáhají nám pochopit, jak používáte platformu, abychom ji mohli vylepšovat:
                </p>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Google Analytics</h4>
                    <p className="text-sm text-slate-700 mb-2">
                      Měří návštěvnost, chování uživatelů a výkon stránek.
                    </p>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>• <code className="bg-slate-100 px-1 rounded">_ga</code> - Identifikace uživatele (2 roky)</p>
                      <p>• <code className="bg-slate-100 px-1 rounded">_ga_*</code> - Stav relace (2 roky)</p>
                      <p>• <code className="bg-slate-100 px-1 rounded">_gid</code> - Identifikace relace (24 hodin)</p>
                      <p>• <code className="bg-slate-100 px-1 rounded">_gat</code> - Omezení četnosti požadavků (1 minuta)</p>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      🔗 <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">
                        Zásady ochrany soukromí Google
                      </a>
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Firebase Analytics</h4>
                    <p className="text-sm text-slate-700 mb-2">
                      Sleduje události a interakce v aplikaci.
                    </p>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>• <code className="bg-slate-100 px-1 rounded">_firebase_*</code> - Analytická data (2 roky)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white rounded-lg p-3">
                  <p className="text-sm text-slate-700">
                    🎯 <strong>Co měříme:</strong> Počet návštěv, délka návštěvy, nejpoužívanější 
                    funkce, míra konverze, zdroje návštěvnosti
                  </p>
                  <p className="text-sm text-slate-700 mt-2">
                    🚫 <strong>Co NEMĚŘÍME:</strong> Osobní údaje, obsah faktur, citlivá data
                  </p>
                </div>
              </div>

              {/* Funkční cookies */}
              <div className="border-l-4 border-purple-500 bg-purple-50 p-5 rounded-r-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-lg text-slate-800">
                    🔧 Funkční cookies (volitelné)
                  </h3>
                </div>
                
                <p className="text-slate-700 mb-3">
                  Zlepšují uživatelský zážitek zapamatováním vašich preferencí:
                </p>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="space-y-2 text-sm text-slate-700">
                    <p>• <code className="bg-slate-100 px-2 py-1 rounded">theme</code> - Světlý/tmavý režim (1 rok)</p>
                    <p>• <code className="bg-slate-100 px-2 py-1 rounded">sidebar_collapsed</code> - Stav bočního menu (30 dní)</p>
                    <p>• <code className="bg-slate-100 px-2 py-1 rounded">currency</code> - Preferovaná měna (1 rok)</p>
                    <p>• <code className="bg-slate-100 px-2 py-1 rounded">date_format</code> - Formát data (1 rok)</p>
                    <p>• <code className="bg-slate-100 px-2 py-1 rounded">recent_clients</code> - Nedávno zobrazení klienti (7 dní)</p>
                  </div>
                </div>
              </div>

              {/* Marketingové cookies */}
              <div className="border-l-4 border-orange-500 bg-orange-50 p-5 rounded-r-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-lg text-slate-800">
                    🎯 Marketingové cookies (volitelné)
                  </h3>
                </div>
                
                <p className="text-slate-700 mb-3">
                  Používají se pro cílenou reklamu a remarketing:
                </p>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Google Ads</h4>
                    <p className="text-sm text-slate-700 mb-2">
                      Sledování konverzí a remarketing kampaní.
                    </p>
                    <div className="text-xs text-slate-600">
                      <p>• <code className="bg-slate-100 px-1 rounded">_gcl_*</code> - Sledování kliknutí (90 dní)</p>
                      <p>• <code className="bg-slate-100 px-1 rounded">IDE</code> - Reklamy Google (13 měsíců)</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Meta Pixel (Facebook/Instagram)</h4>
                    <p className="text-sm text-slate-700 mb-2">
                      Měření efektivity reklam a vytváření cílových skupin.
                    </p>
                    <div className="text-xs text-slate-600">
                      <p>• <code className="bg-slate-100 px-1 rounded">_fbp</code> - Facebook Pixel (90 dní)</p>
                      <p>• <code className="bg-slate-100 px-1 rounded">fr</code> - Facebook remarketing (90 dní)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-slate-700">
                    ⚠️ <strong>Upozornění:</strong> Tyto cookies mohou sdílet informace s třetími 
                    stranami. Můžete je odmítnout v nastavení cookies.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Správa cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                3. Jak spravovat cookies
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-slate-800 mb-3">
                  🎛️ Nastavení v platformě Faktix
                </h3>
                <p className="text-slate-700 mb-3">
                  Můžete kdykoli změnit své cookie preference:
                </p>
                <ol className="space-y-2 text-slate-700 ml-6 list-decimal">
                  <li>Přejděte do <strong>Nastavení</strong> → <strong>Soukromí</strong></li>
                  <li>Klikněte na <strong>"Nastavení cookies"</strong></li>
                  <li>Zapněte/vypněte jednotlivé kategorie</li>
                  <li>Uložte změny</li>
                </ol>
                
                <div className="mt-4 p-4 bg-white rounded-lg border border-emerald-300">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Settings className="w-5 h-5" />
                    Otevřít nastavení cookies
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-slate-800 mb-3">
                  🌐 Nastavení v prohlížeči
                </h3>
                <p className="text-slate-700 mb-4">
                  Můžete také spravovat cookies přímo v nastavení vašeho prohlížeče:
                </p>
                
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-slate-800">🔵 Google Chrome</p>
                    <p className="text-slate-600 text-xs mt-1">
                      Nastavení → Soukromí a zabezpečení → Soubory cookie
                    </p>
                    <a href="https://support.google.com/chrome/answer/95647" 
                       className="text-blue-600 hover:underline text-xs mt-1 inline-block"
                       target="_blank" rel="noopener noreferrer">
                      Návod →
                    </a>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-slate-800">🦊 Mozilla Firefox</p>
                    <p className="text-slate-600 text-xs mt-1">
                      Nastavení → Soukromí a zabezpečení → Cookies
                    </p>
                    <a href="https://support.mozilla.org/cs/kb/zabraneni-trackovani-nastaveni-soukromi" 
                       className="text-blue-600 hover:underline text-xs mt-1 inline-block"
                       target="_blank" rel="noopener noreferrer">
                      Návod →
                    </a>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-slate-800">🧭 Safari</p>
                    <p className="text-slate-600 text-xs mt-1">
                      Předvolby → Soukromí → Správa dat webu
                    </p>
                    <a href="https://support.apple.com/cs-cz/guide/safari/sfri11471/mac" 
                       className="text-blue-600 hover:underline text-xs mt-1 inline-block"
                       target="_blank" rel="noopener noreferrer">
                      Návod →
                    </a>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-slate-800">🌊 Microsoft Edge</p>
                    <p className="text-slate-600 text-xs mt-1">
                      Nastavení → Soubory cookie a oprávnění webu
                    </p>
                    <a href="https://support.microsoft.com/cs-cz/microsoft-edge/odstran%C4%9Bn%C3%AD-soubor%C5%AF-cookie-v-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                       className="text-blue-600 hover:underline text-xs mt-1 inline-block"
                       target="_blank" rel="noopener noreferrer">
                      Návod →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-slate-800">
                    🗑️ Smazání cookies
                  </h3>
                </div>
                <p className="text-slate-700 mb-2">
                  Můžete kdykoli smazat všechny cookies z vašeho prohlížeče:
                </p>
                <ul className="text-sm text-slate-700 ml-6 space-y-1">
                  <li>• Chrome: Ctrl+Shift+Del (Windows) / Cmd+Shift+Del (Mac)</li>
                  <li>• Firefox: Ctrl+Shift+Del (Windows) / Cmd+Shift+Del (Mac)</li>
                  <li>• Safari: Cmd+, → Soukromí → Spravovat data webu</li>
                </ul>
                <p className="text-sm text-slate-600 mt-3">
                  ⚠️ <strong>Upozornění:</strong> Smazání cookies vás odhlásí z platformy 
                  a resetuje vaše preference.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Do Not Track */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                4. Do Not Track (DNT)
              </h2>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <p className="text-slate-700 mb-3">
                Některé prohlížeče nabízejí funkci "Do Not Track" (Nesledovat). 
              </p>
              <p className="text-slate-700 mb-3">
                <strong>Naše politika:</strong> Respektujeme DNT signál a automaticky 
                deaktivujeme analytické a marketingové cookies, pokud je DNT zapnutý.
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-slate-700 mb-2">
                  <strong>Jak zapnout DNT:</strong>
                </p>
                <ul className="text-sm text-slate-600 ml-6 space-y-1">
                  <li>• <strong>Chrome:</strong> Nastavení → Soukromí → "Nesledovat"</li>
                  <li>• <strong>Firefox:</strong> Nastavení → Soukromí → "Říci webům, aby nesledovaly"</li>
                  <li>• <strong>Safari:</strong> Předvolby → Soukromí → "Zabránit sledování mezi weby"</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Cookies třetích stran */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                5. Cookies třetích stran
              </h2>
            </div>
            
            <div className="space-y-3">
              <p className="text-slate-700">
                Některé cookies pocházejí od třetích stran, se kterými spolupracujeme:
              </p>

              <div className="bg-slate-50 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-3">🔗 Naši partneři:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="text-2xl">🔥</div>
                    <div>
                      <p className="font-semibold text-slate-800">Google Firebase</p>
                      <p className="text-sm text-slate-600">Autentifikace, databáze, analytics</p>
                      <a href="https://policies.google.com/privacy" 
                         className="text-blue-600 hover:underline text-xs"
                         target="_blank" rel="noopener noreferrer">
                        Zásady ochrany soukromí
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="text-2xl">💳</div>
                    <div>
                      <p className="font-semibold text-slate-800">Stripe / ComGate</p>
                      <p className="text-sm text-slate-600">Platební brány</p>
                      <a href="https://stripe.com/privacy" 
                         className="text-blue-600 hover:underline text-xs"
                         target="_blank" rel="noopener noreferrer">
                        Stripe Privacy Policy
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="text-2xl">📊</div>
                    <div>
                      <p className="font-semibold text-slate-800">Google Analytics</p>
                      <p className="text-sm text-slate-600">Webová analytika</p>
                      <a href="https://policies.google.com/technologies/partner-sites" 
                         className="text-blue-600 hover:underline text-xs"
                         target="_blank" rel="noopener noreferrer">
                        Jak Google používá data
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Změny politiky */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                6. Změny této politiky
              </h2>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <p className="text-slate-700">
                Tuto Cookie Policy můžeme čas od času aktualizovat. O významných změnách 
                vás budeme informovat oznámením na platformě nebo e-mailem. Datum poslední 
                aktualizace najdete na začátku tohoto dokumentu.
              </p>
            </div>
          </section>

          {/* 7. Kontakt */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                7. Máte otázky?
              </h2>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-emerald-50 border border-orange-200 rounded-xl p-6">
              <p className="text-slate-700 mb-4">
                Pokud máte jakékoli dotazy ohledně používání cookies, kontaktujte nás:
              </p>
              
              <div className="space-y-2 text-slate-700">
                <p>📧 <strong>E-mail:</strong> gdpr@faktix.cz</p>
                <p>📞 <strong>Telefon:</strong> [Váš telefon]</p>
                <p>🏢 <strong>Adresa:</strong> [Vaše adresa]</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-sm mb-4">
            Poslední aktualizace: 1. ledna 2025
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/legal/ochrana-udaju" 
              className="text-orange-600 hover:underline text-sm font-semibold"
            >
              Ochrana osobních údajů
            </a>
            <span className="text-slate-400">|</span>
            <a 
              href="/legal/obchodni-podminky" 
              className="text-orange-600 hover:underline text-sm font-semibold"
            >
              Obchodní podmínky
            </a>
            <span className="text-slate-400">|</span>
            <a 
              href="/" 
              className="text-orange-600 hover:underline text-sm font-semibold"
            >
              Zpět na Faktix
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

