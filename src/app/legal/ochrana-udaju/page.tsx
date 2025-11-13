"use client";

import { Shield, Lock, Database, Eye, FileText, Mail, Calendar } from 'lucide-react';

export default function OchranaUdajuPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Zásady ochrany osobních údajů
              </h1>
              <p className="text-slate-600 mt-1">
                Platné od 1. ledna 2025
              </p>
            </div>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-slate-700 leading-relaxed">
              Společnost <strong>Faktix</strong> (dále jen "my", "naše" nebo "poskytovatel služeb") 
              se zavazuje chránit vaše osobní údaje v souladu s nařízením Evropského parlamentu 
              a Rady (EU) 2016/679 o ochraně fyzických osob v souvislosti se zpracováním osobních 
              údajů a o volném pohybu těchto údajů (GDPR).
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          
          {/* 1. Správce osobních údajů */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                1. Správce osobních údajů
              </h2>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 space-y-3">
              <p className="text-slate-700">
                <strong>Název:</strong> Faktix
              </p>
              <p className="text-slate-700">
                <strong>Sídlo:</strong> [Vaše adresa]
              </p>
              <p className="text-slate-700">
                <strong>IČ:</strong> [Vaše IČ]
              </p>
              <p className="text-slate-700">
                <strong>E-mail:</strong> gdpr@faktix.cz
              </p>
              <p className="text-slate-700">
                <strong>Telefon:</strong> [Váš telefon]
              </p>
            </div>
          </section>

          {/* 2. Jaké osobní údaje zpracováváme */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                2. Jaké osobní údaje zpracováváme
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-lg text-slate-800 mb-3">
                  📋 Osobní údaje uživatelů:
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• <strong>Identifikační údaje:</strong> jméno, příjmení, e-mailová adresa</li>
                  <li>• <strong>Kontaktní údaje:</strong> telefonní číslo, adresa</li>
                  <li>• <strong>Firemní údaje:</strong> název firmy, IČ, DIČ, adresa sídla, typ živnosti</li>
                  <li>• <strong>Bankovní údaje:</strong> číslo účtu, název banky, IBAN, SWIFT/BIC</li>
                  <li>• <strong>Údaje o předplatném:</strong> typ plánu, datum platby, historie plateb</li>
                  <li>• <strong>Technické údaje:</strong> IP adresa, typ zařízení, prohlížeč, operační systém</li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-lg text-slate-800 mb-3">
                  👥 Údaje vašich klientů (které zadáváte do systému):
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• <strong>Základní údaje:</strong> název firmy/jméno, IČ, DIČ</li>
                  <li>• <strong>Kontaktní údaje:</strong> e-mail, telefon, adresa</li>
                  <li>• <strong>Fakturační údaje:</strong> informace uvedené na fakturách</li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-lg text-slate-800 mb-3">
                  📊 Údaje z faktur:
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Čísla faktur, data vystavení a splatnosti</li>
                  <li>• Položky faktur (popis služeb/produktů, ceny)</li>
                  <li>• Celkové částky a daňové údaje</li>
                  <li>• Stavy faktur (zaplaceno/nezaplaceno)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Účel zpracování */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                3. Účel a právní základ zpracování
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  ✅ Poskytování služeb (Plnění smlouvy - čl. 6 odst. 1 písm. b GDPR)
                </h3>
                <ul className="space-y-1 text-slate-700 ml-4">
                  <li>• Vytvoření a správa uživatelského účtu</li>
                  <li>• Umožnění vytváření a správy faktur</li>
                  <li>• Správa klientské databáze</li>
                  <li>• Provádění kalkulací a finančních analýz</li>
                  <li>• Poskytování AI asistenta pro účetnictví</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  💳 Zpracování plateb (Plnění smlouvy - čl. 6 odst. 1 písm. b GDPR)
                </h3>
                <ul className="space-y-1 text-slate-700 ml-4">
                  <li>• Správa předplatného</li>
                  <li>• Vystavování účtenek za služby</li>
                  <li>• Vedení platební historie</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  📧 Komunikace (Oprávněný zájem - čl. 6 odst. 1 písm. f GDPR)
                </h3>
                <ul className="space-y-1 text-slate-700 ml-4">
                  <li>• Zasílání důležitých oznámení o službě</li>
                  <li>• Odpovědi na dotazy podpory</li>
                  <li>• Informace o aktualizacích systému</li>
                  <li>• Bezpečnostní upozornění</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  📊 Analytika (Oprávněný zájem - čl. 6 odst. 1 písm. f GDPR)
                </h3>
                <ul className="space-y-1 text-slate-700 ml-4">
                  <li>• Zlepšování kvality služeb</li>
                  <li>• Analýza používání platformy</li>
                  <li>• Prevence podvodů a zneužití</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  ⚖️ Právní povinnosti (Plnění právní povinnosti - čl. 6 odst. 1 písm. c GDPR)
                </h3>
                <ul className="space-y-1 text-slate-700 ml-4">
                  <li>• Archivace faktur podle daňových předpisů</li>
                  <li>• Plnění účetních povinností</li>
                  <li>• Spolupráce s orgány veřejné moci</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  📬 Marketing (Souhlas - čl. 6 odst. 1 písm. a GDPR)
                </h3>
                <ul className="space-y-1 text-slate-700 ml-4">
                  <li>• Zasílání newsletterů (pouze se souhlasem)</li>
                  <li>• Nabídky nových funkcí a služeb</li>
                  <li>• Marketingové kampaně</li>
                  <li><em>* Můžete kdykoli odvolat svůj souhlas</em></li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Doba uchování */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                4. Doba uchovávání osobních údajů
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-800">Typ údajů</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-800">Doba uchovávání</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Uživatelský účet</td>
                    <td className="px-4 py-3 text-slate-700">Do smazání účtu + 30 dní</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-4 py-3 text-slate-700">Faktury a účetní doklady</td>
                    <td className="px-4 py-3 text-slate-700">10 let (dle zákona o účetnictví)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Platební údaje</td>
                    <td className="px-4 py-3 text-slate-700">Do konce předplatného + 3 roky</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-4 py-3 text-slate-700">Technické logy</td>
                    <td className="px-4 py-3 text-slate-700">12 měsíců</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Marketingové souhlasy</td>
                    <td className="px-4 py-3 text-slate-700">Do odvolání souhlasu</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-4 py-3 text-slate-700">Klientská databáze</td>
                    <td className="px-4 py-3 text-slate-700">Do smazání účtu + 30 dní</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-slate-700">
                ⚖️ <strong>Důležité:</strong> Některé údaje jsme povinni uchovávat déle kvůli 
                právním požadavkům (daňové zákony, zákon o účetnictví). Po uplynutí těchto lhůt 
                jsou údaje bezpečně smazány.
              </p>
            </div>
          </section>

          {/* 5. Sdílení údajů */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                5. Komu předáváme osobní údaje
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-slate-700">
                Vaše osobní údaje <strong>NEPRODÁVÁME</strong> třetím stranám. Předáváme je pouze:
              </p>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-3">🔧 Technickým partnerům:</h3>
                <ul className="space-y-3 text-slate-700">
                  <li>
                    <strong>• Google Firebase</strong> (USA)
                    <br />
                    <span className="text-sm text-slate-600 ml-4">
                      - Hosting databáze a autentifikace
                      <br />- Přenos do USA zabezpečen dle čl. 46 GDPR (standardní smluvní doložky)
                    </span>
                  </li>
                  <li>
                    <strong>• Platební brány</strong> (Stripe/ComGate)
                    <br />
                    <span className="text-sm text-slate-600 ml-4">
                      - Zpracování plateb
                      <br />- Shoda s PCI DSS standardy
                    </span>
                  </li>
                  <li>
                    <strong>• ARES API</strong> (Česká republika)
                    <br />
                    <span className="text-sm text-slate-600 ml-4">
                      - Automatické doplnění firemních údajů
                      <br />- Veřejný rejstřík České republiky
                    </span>
                  </li>
                  <li>
                    <strong>• E-mailové služby</strong> (např. SendGrid, Mailgun)
                    <br />
                    <span className="text-sm text-slate-600 ml-4">
                      - Zasílání systémových e-mailů
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-3">⚖️ Právním orgánům:</h3>
                <p className="text-slate-700">
                  V případě, že to vyžaduje zákon nebo soudní příkaz (např. daňová kontrola, 
                  vyšetřování trestného činu).
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-slate-700">
                  🛡️ <strong>Všichni zpracovatelé</strong> jsou vybráni s maximální pečlivostí 
                  a jsou smluvně zavázáni dodržovat GDPR a chránit vaše data.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Vaše práva */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                6. Vaše práva podle GDPR
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">🔍 Právo na přístup</h3>
                <p className="text-slate-700 text-sm">
                  Máte právo získat informace o tom, jaké osobní údaje o vás zpracováváme.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">✏️ Právo na opravu</h3>
                <p className="text-slate-700 text-sm">
                  Můžete požádat o opravu nepřesných nebo neúplných údajů.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">🗑️ Právo na výmaz</h3>
                <p className="text-slate-700 text-sm">
                  Můžete požádat o smazání vašich osobních údajů (s výjimkou údajů, 
                  které musíme uchovávat ze zákona).
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">🚫 Právo na omezení</h3>
                <p className="text-slate-700 text-sm">
                  Můžete požádat o omezení zpracování vašich údajů.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">📦 Právo na přenositelnost</h3>
                <p className="text-slate-700 text-sm">
                  Můžete požádat o export vašich dat ve strukturovaném formátu (CSV, JSON).
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">🛑 Právo vznést námitku</h3>
                <p className="text-slate-700 text-sm">
                  Můžete vznést námitku proti zpracování z oprávněného zájmu nebo pro marketing.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-3">📧 Jak uplatnit svá práva?</h3>
              <p className="text-slate-700 mb-2">
                Kontaktujte nás na: <strong>gdpr@faktix.cz</strong>
              </p>
              <p className="text-slate-700 text-sm">
                ⏱️ <strong>Lhůta odpovědi:</strong> Do 30 dnů od obdržení žádosti
              </p>
              <p className="text-slate-700 text-sm mt-2">
                ⚖️ <strong>Stížnost:</strong> Máte právo podat stížnost u Úřadu pro ochranu 
                osobních údajů (ÚOOÚ): <a href="https://uoou.cz" className="text-emerald-600 hover:underline">www.uoou.cz</a>
              </p>
            </div>
          </section>

          {/* 7. Zabezpečení */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                7. Zabezpečení osobních údajů
              </h2>
            </div>
            
            <div className="space-y-3">
              <p className="text-slate-700">
                Chráníme vaše osobní údaje pomocí technických a organizačních opatření:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">🔐 Šifrování</h3>
                  <ul className="text-slate-700 text-sm space-y-1">
                    <li>• SSL/TLS certifikáty (HTTPS)</li>
                    <li>• Šifrování databáze</li>
                    <li>• Šifrování hesel (bcrypt)</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">🛡️ Přístupová práva</h3>
                  <ul className="text-slate-700 text-sm space-y-1">
                    <li>• Dvoufaktorová autentifikace</li>
                    <li>• Omezení přístupu zaměstnanců</li>
                    <li>• Audit logů přístupu</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">💾 Zálohy</h3>
                  <ul className="text-slate-700 text-sm space-y-1">
                    <li>• Pravidelné zálohování dat</li>
                    <li>• Geograficky oddělené zálohy</li>
                    <li>• Šifrované zálohy</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">🔍 Monitoring</h3>
                  <ul className="text-slate-700 text-sm space-y-1">
                    <li>• 24/7 monitorování bezpečnosti</li>
                    <li>• Detekce podezřelých aktivit</li>
                    <li>• Pravidelné bezpečnostní testy</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                8. Cookies (Soubory cookie)
              </h2>
            </div>
            
            <p className="text-slate-700 mb-4">
              Naše platforma používá cookies pro zlepšení funkčnosti a uživatelského zážitku.
            </p>

            <div className="space-y-3">
              <div className="border border-slate-200 rounded-xl p-4">
                <h3 className="font-semibold text-slate-800 mb-2">✅ Nezbytné cookies</h3>
                <p className="text-slate-700 text-sm">
                  Nutné pro fungování webu (autentifikace, bezpečnost). Nelze odmítnout.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <h3 className="font-semibold text-slate-800 mb-2">📊 Analytické cookies</h3>
                <p className="text-slate-700 text-sm">
                  Pomáhají nám pochopit, jak používáte naši platformu (Google Analytics, Firebase Analytics).
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <h3 className="font-semibold text-slate-800 mb-2">🎯 Marketingové cookies</h3>
                <p className="text-slate-700 text-sm">
                  Používají se pro cílenou reklamu. Vyžadují váš souhlas.
                </p>
              </div>
            </div>

            <p className="text-slate-700 mt-4">
              Podrobné informace najdete v naší{' '}
              <a href="/legal/cookies" className="text-emerald-600 hover:underline font-semibold">
                Cookie Policy
              </a>
              .
            </p>
          </section>

          {/* 9. Kontakt */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                9. Kontaktní údaje
              </h2>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-700 mb-4">
                Pro dotazy ohledně ochrany osobních údajů nás kontaktujte:
              </p>
              
              <div className="space-y-2 text-slate-700">
                <p>📧 <strong>E-mail:</strong> gdpr@faktix.cz</p>
                <p>📞 <strong>Telefon:</strong> [Váš telefon]</p>
                <p>🏢 <strong>Adresa:</strong> [Vaše adresa]</p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  <strong>Úřad pro ochranu osobních údajů (ÚOOÚ)</strong>
                  <br />
                  Pplk. Sochora 27, 170 00 Praha 7
                  <br />
                  Tel.: +420 234 665 111
                  <br />
                  E-mail: posta@uoou.cz
                  <br />
                  Web: <a href="https://uoou.cz" className="text-emerald-600 hover:underline">www.uoou.cz</a>
                </p>
              </div>
            </div>
          </section>

          {/* 10. Změny */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                10. Změny těchto zásad
              </h2>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <p className="text-slate-700">
                Tyto zásady můžeme čas od času aktualizovat. O významných změnách vás budeme 
                informovat e-mailem nebo oznámením na platformě. Aktuální verze je vždy 
                dostupná na této stránce s uvedením data poslední aktualizace.
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-sm">
            Poslední aktualizace: 1. ledna 2025
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <a 
              href="/legal/obchodni-podminky" 
              className="text-emerald-600 hover:underline text-sm font-semibold"
            >
              Obchodní podmínky
            </a>
            <span className="text-slate-400">|</span>
            <a 
              href="/legal/cookies" 
              className="text-emerald-600 hover:underline text-sm font-semibold"
            >
              Cookie Policy
            </a>
            <span className="text-slate-400">|</span>
            <a 
              href="/" 
              className="text-emerald-600 hover:underline text-sm font-semibold"
            >
              Zpět na Faktix
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

