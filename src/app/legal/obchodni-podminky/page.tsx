"use client";

import Link from 'next/link';
import { FileText, CheckCircle, XCircle, AlertTriangle, CreditCard, Shield, Mail } from 'lucide-react';

export default function ObchodniPodminkyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Obchodní podmínky
              </h1>
              <p className="text-slate-600 mt-1">
                Platné od 1. ledna 2025
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-slate-700 leading-relaxed">
              Tyto obchodní podmínky upravují vztahy mezi poskytovatelem služby <strong>Faktix</strong> 
              (dále jen &quot;poskytovatel&quot; nebo &quot;my&quot;) a uživatelem služby (dále jen &quot;uživatel&quot; nebo &quot;vy&quot;) 
              při využívání platformy Faktix.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          
          {/* 1. Základní ustanovení */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              1. Základní ustanovení
            </h2>
            
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-slate-800 mb-3">
                  📋 Poskytovatel služby:
                </h3>
                <div className="space-y-2 text-slate-700">
                  <p><strong>Obchodní jméno:</strong> Faktix</p>
                  <p><strong>Sídlo:</strong> [Vaše adresa]</p>
                  <p><strong>IČ:</strong> [Vaše IČ]</p>
                  <p><strong>DIČ:</strong> [Vaše DIČ]</p>
                  <p><strong>E-mail:</strong> info@faktix.cz</p>
                  <p><strong>Web:</strong> www.faktix.cz</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  🎯 Předmět služby:
                </h3>
                <p className="text-slate-700">
                  Faktix je cloudová platforma (SaaS) pro správu faktur, klientů, kalkulací 
                  a účetnictví s AI asistentem. Poskytujeme nástroje pro efektivní řízení 
                  administrativy podnikatelů a malých firem v České republice.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  ✅ Akceptace podmínek:
                </h3>
                <p className="text-slate-700">
                  Registrací a používáním služby Faktix vyjadřujete souhlas s těmito obchodními 
                  podmínkami. Pokud s nimi nesouhlasíte, službu nepoužívejte.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Registrace a účet */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              2. Registrace a uživatelský účet
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-xl">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Podmínky registrace:
                </h3>
                <ul className="space-y-2 text-slate-700 ml-7">
                  <li>• Musíte být starší 18 let nebo jednat se souhlasem zákonného zástupce</li>
                  <li>• Musíte poskytnout pravdivé a aktuální údaje</li>
                  <li>• Jeden uživatel = jeden účet (není dovoleno sdílet přihlašovací údaje)</li>
                  <li>• E-mailová adresa musí být ověřitelná a aktivní</li>
                </ul>
              </div>

              <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-xl">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Povinnosti uživatele:
                </h3>
                <ul className="space-y-2 text-slate-700 ml-7">
                  <li>• Chránit své přihlašovací údaje před zneužitím</li>
                  <li>• Neprodleně nás informovat o neoprávněném přístupu k účtu</li>
                  <li>• Aktualizovat svoje údaje při změnách</li>
                  <li>• Nepoužívat službu k nezákonným účelům</li>
                  <li>• Nezneužívat platformu k rozesílání spamu nebo škodlivého obsahu</li>
                </ul>
              </div>

              <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-xl">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Odpovědnost za účet:
                </h3>
                <p className="text-slate-700 ml-7">
                  Jste plně odpovědní za veškeré aktivity prováděné pod vaším účtem. 
                  V případě podezření na neoprávněný přístup kontaktujte okamžitě naši podporu.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Ceníky a platby */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
              3. Ceník a platební podmínky
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-slate-800 mb-4">
                  💎 Cenové plány:
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <h4 className="font-semibold text-slate-800">FREE</h4>
                    <p className="text-2xl font-bold text-emerald-600 my-2">0 Kč</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• 5 faktur/měsíc</li>
                      <li>• 10 klientů</li>
                      <li>• Základní funkce</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-emerald-500">
                    <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">
                      POPULÁRNÍ
                    </div>
                    <h4 className="font-semibold text-slate-800">STARTER</h4>
                    <p className="text-2xl font-bold text-emerald-600 my-2">199 Kč/měs</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• 50 faktur/měsíc</li>
                      <li>• Neomezení klienti</li>
                      <li>• AI asistent</li>
                      <li>• E-mail podpora</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <h4 className="font-semibold text-slate-800">PRO</h4>
                    <p className="text-2xl font-bold text-emerald-600 my-2">499 Kč/měs</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Neomezené faktury</li>
                      <li>• Pokročilé analýzy</li>
                      <li>• Prioritní podpora</li>
                      <li>• API přístup</li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mt-4 text-center">
                  * Všechny ceny jsou uvedeny bez DPH
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-3">
                  💳 Platební podmínky:
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• <strong>Platba kartou:</strong> Visa, Mastercard, Maestro (přes Stripe/ComGate)</li>
                  <li>• <strong>Fakturace:</strong> Měsíční nebo roční předplatné</li>
                  <li>• <strong>Automatické obnovení:</strong> Předplatné se automaticky obnovuje</li>
                  <li>• <strong>Zrušení:</strong> Můžete kdykoli zrušit bez sankcí</li>
                  <li>• <strong>Daňový doklad:</strong> Zasíláme elektronicky na e-mail do 48 hodin</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  ⚠️ Neuhrazená platba:
                </h3>
                <p className="text-slate-700">
                  Při neuhrazení platby do 14 dnů od splatnosti si vyhrazujeme právo omezit 
                  nebo pozastavit přístup k prémiov ým funkcím. Po 30 dnech může být účet 
                  deaktivován. Data jsou uchovávána dalších 30 dní pro případ obnovení předplatného.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  🔄 Změna ceníku:
                </h3>
                <p className="text-slate-700">
                  Vyhrazujeme si právo změnit ceny s 30denním předstihem. Stávající uživatelé 
                  budou informováni e-mailem. Při nesouhlasu můžete předplatné zrušit.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Vrácení peněz */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              4. Vrácení peněz (Money-back guarantee)
            </h2>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-slate-800 mb-3">
                ✅ 14denní záruka vrácení peněz
              </h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  <strong>Pro nové uživatele:</strong> Pokud nejste spokojeni se službou, 
                  máte právo na vrácení peněz do 14 dnů od první platby.
                </p>
                <p>
                  <strong>Podmínky:</strong>
                </p>
                <ul className="ml-6 space-y-1">
                  <li>• Platí pouze pro první platbu</li>
                  <li>• Musíte kontaktovat podporu (info@faktix.cz)</li>
                  <li>• Vrácení peněz proběhne do 14 pracovních dnů</li>
                  <li>• Po vrácení bude účet převeden na FREE plán</li>
                </ul>
                <p className="text-sm text-slate-600 mt-4">
                  <strong>Výjimky:</strong> Záruka se nevztahuje na roční předplatné po uplynutí 
                  30 dnů nebo pokud byl účet zneužit.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Licence a duševní vlastnictví */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              5. Licence a duševní vlastnictví
            </h2>
            
            <div className="space-y-4">
              <div className="border border-purple-200 bg-purple-50 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  © Naše práva:
                </h3>
                <p className="text-slate-700 mb-3">
                  Veškerý obsah platformy Faktix včetně designu, kódu, log, textů, grafiky 
                  a funkcí je chráněn autorským právem a je výhradním vlastnictvím poskytovatele.
                </p>
                <p className="text-slate-700 text-sm">
                  <strong>Zakázané činnosti:</strong>
                </p>
                <ul className="text-slate-700 text-sm ml-6 space-y-1 mt-2">
                  <li>• Kopírování, modifikace nebo distribuce platformy</li>
                  <li>• Reverzní inženýrství (reverse engineering)</li>
                  <li>• Vytváření konkurenčních produktů na základě Faktix</li>
                  <li>• Pronájem nebo prodej přístupu třetím stranám</li>
                </ul>
              </div>

              <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  ✅ Vaše práva:
                </h3>
                <p className="text-slate-700 mb-3">
                  Udělujeme vám nevýhradní, nepřenosnou licenci k používání platformy Faktix 
                  pro vaše obchodní účely po dobu trvání předplatného.
                </p>
                <p className="text-slate-700 mb-3">
                  <strong>Vaše data:</strong> Všechna data, která nahrajete do platformy 
                  (faktury, klienti, kalkulace), zůstávají vaším vlastnictvím. Můžete je 
                  kdykoli exportovat nebo smazat.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Dostupnost služby */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              6. Dostupnost a údržba služby
            </h2>
            
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  🎯 Cílová dostupnost: 99,5% (SLA)
                </h3>
                <p className="text-slate-700">
                  Usilujeme o maximální dostupnost služby. Nicméně si vyhrazujeme právo na:
                </p>
                <ul className="mt-3 space-y-2 text-slate-700 ml-6">
                  <li>• <strong>Plánovanou údržbu:</strong> Obvykle v noci nebo o víkendech 
                    (s předchozím oznámením 48 hodin)</li>
                  <li>• <strong>Nouzové zásahy:</strong> Při bezpečnostních problémech 
                    nebo kritických chybách (bez předchozího oznámení)</li>
                  <li>• <strong>Aktualizace:</strong> Pravidelné aktualizace funkcí a 
                    bezpečnostních oprav</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  ⚠️ Vyloučení odpovědnosti:
                </h3>
                <p className="text-slate-700">
                  Nenese odpovědnost za výpadky způsobené:
                </p>
                <ul className="mt-2 space-y-1 text-slate-700 ml-6">
                  <li>• Vyšší mocí (přírodní katastrofy, války, teroristické útoky)</li>
                  <li>• Výpadky internetového připojení</li>
                  <li>• Problémy třetích stran (hosting, CDN, platební brány)</li>
                  <li>• DDoS útoky a jiné kybernetické hrozby</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 7. Omezení odpovědnosti */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              7. Omezení odpovědnosti
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-500 bg-yellow-50 p-5 rounded-r-xl">
                <h3 className="font-semibold text-slate-800 mb-2">
                  ⚖️ Rozsah odpovědnosti:
                </h3>
                <p className="text-slate-700 mb-3">
                  Poskytujeme službu Faktix &quot;tak jak je&quot; (as-is) s maximální péčí, 
                  ale neručíme za:
                </p>
                <ul className="space-y-2 text-slate-700 ml-6">
                  <li>• Nepřerušený nebo bezchybný provoz služby</li>
                  <li>• Přesnost dat získaných z externích API (např. ARES)</li>
                  <li>• Ztrátu dat způsobenou poruchou vašeho zařízení</li>
                  <li>• Škody způsobené nesprávným použitím platformy</li>
                  <li>• Daňové nebo účetní chyby způsobené lidskou chybou</li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  💰 Maximální náhrada škody:
                </h3>
                <p className="text-slate-700">
                  V případě prokazatelné škody naší vinou je naše odpovědnost omezena 
                  na výši zaplacených poplatků za posledních 12 měsíců. Neposkytujeme 
                  náhradu za ztrátu zisku, reputace nebo nepřímé škody.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  🛡️ Co garantujeme:
                </h3>
                <ul className="space-y-2 text-slate-700 ml-6">
                  <li>• Pravidelné zálohování vašich dat (denně)</li>
                  <li>• Šifrování citlivých údajů</li>
                  <li>• GDPR compliance</li>
                  <li>• Technickou podporu v pracovních dnech</li>
                  <li>• Průběžné vylepšování platformy</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 8. Ukončení služby */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              8. Ukončení služby a odstoupení od smlouvy
            </h2>
            
            <div className="space-y-4">
              <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  ✅ Ukončení ze strany uživatele:
                </h3>
                <p className="text-slate-700 mb-3">
                  Můžete kdykoli zrušit předplatné bez udání důvodu:
                </p>
                <ul className="space-y-2 text-slate-700 ml-6">
                  <li>• V nastavení účtu klikněte na &quot;Zrušit předplatné&quot;</li>
                  <li>• Nebo napište na info@faktix.cz</li>
                  <li>• Přístup k placeným funkcím trvá do konce zaplaceného období</li>
                  <li>• Poté bude účet převeden na FREE plán</li>
                  <li>• Data zůstanou zachována 90 dní pro případ obnovení</li>
                </ul>
              </div>

              <div className="border border-red-200 bg-red-50 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  ❌ Ukončení ze strany poskytovatele:
                </h3>
                <p className="text-slate-700 mb-3">
                  Vyhrazujeme si právo okamžitě ukončit přístup k službě v případě:
                </p>
                <ul className="space-y-2 text-slate-700 ml-6">
                  <li>• Porušení těchto obchodních podmínek</li>
                  <li>• Neuhrazení platby po dobu delší než 30 dní</li>
                  <li>• Zneužití platformy (spam, podvody, nelegální aktivity)</li>
                  <li>• Ohrožení bezpečnosti systému nebo jiných uživatelů</li>
                  <li>• Sdílení přihlašovacích údajů</li>
                </ul>
                <p className="text-slate-700 mt-3">
                  <strong>Postup:</strong> Před ukončením vás budeme kontaktovat e-mailem 
                  s možností nápravy (pokud to situace umožní). V případě závažného porušení 
                  můžeme účet zablokovat okamžitě.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  💾 Export dat před ukončením:
                </h3>
                <p className="text-slate-700">
                  Před ukončením služby si můžete stáhnout všechna svá data ve formátu CSV, 
                  JSON nebo PDF. Po smazání účtu jsou data trvale vymazána po 90 dnech.
                </p>
              </div>
            </div>
          </section>

          {/* 9. Závěrečná ustanovení */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              9. Závěrečná ustanovení
            </h2>
            
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  ⚖️ Rozhodné právo:
                </h3>
                <p className="text-slate-700">
                  Tyto obchodní podmínky se řídí právním řádem České republiky. 
                  Případné spory budou řešeny před příslušnými soudy České republiky.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  📝 Změny podmínek:
                </h3>
                <p className="text-slate-700">
                  Vyhrazujeme si právo tyto obchodní podmínky měnit. O významných změnách 
                  budete informováni e-mailem minimálně 30 dní předem. Pokračováním používání 
                  služby vyjadřujete souhlas s novými podmínkami.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  📧 Komunikace:
                </h3>
                <p className="text-slate-700">
                  Veškerá oficiální komunikace probíhá na e-mailovou adresu uvedenou 
                  při registraci. Jste povinni udržovat e-mailovou adresu aktuální.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  🔗 Oddělitelnost ustanovení:
                </h3>
                <p className="text-slate-700">
                  Pokud je některé ustanovení těchto podmínek neplatné nebo nevynutitelné, 
                  ostatní ustanovení zůstávají v platnosti.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">
                  👨‍⚖️ Mimosoudní řešení sporů:
                </h3>
                <p className="text-slate-700 mb-2">
                  V případě spotřebitelských sporů můžete kontaktovat:
                </p>
                <p className="text-slate-700 text-sm ml-4">
                  <strong>Česká obchodní inspekce (ČOI)</strong><br />
                  Štěpánská 567/15, 120 00 Praha 2<br />
                  Web: <a href="https://coi.cz" className="text-blue-600 hover:underline">www.coi.cz</a><br />
                  E-mail: adr@coi.cz
                </p>
                <p className="text-slate-700 text-sm ml-4 mt-3">
                  <strong>Online řešení sporů (ODR):</strong><br />
                  <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline">
                    ec.europa.eu/consumers/odr
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* 10. Kontakt */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                10. Kontaktní údaje
              </h2>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-6">
              <p className="text-slate-700 mb-4 font-semibold">
                Máte otázky k obchodním podmínkám nebo potřebujete podporu?
              </p>
              
              <div className="space-y-3 text-slate-700">
                <p className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <strong>Obecné dotazy:</strong> info@faktix.cz
                </p>
                <p className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <strong>Technická podpora:</strong> podpora@faktix.cz
                </p>
                <p className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <strong>GDPR a ochrana údajů:</strong> gdpr@faktix.cz
                </p>
                <p className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  <strong>Platby a fakturace:</strong> platby@faktix.cz
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  📞 <strong>Telefonní podpora:</strong> [Váš telefon]<br />
                  🕒 <strong>Provozní doba:</strong> Po-Pá 9:00-17:00<br />
                  🏢 <strong>Adresa:</strong> [Vaše adresa]
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-sm mb-4">
            Tyto obchodní podmínky nabývají účinnosti dnem 1. ledna 2025
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/legal/ochrana-udaju" 
              className="text-blue-600 hover:underline text-sm font-semibold"
            >
              Ochrana osobních údajů
            </a>
            <span className="text-slate-400">|</span>
            <a 
              href="/legal/cookies" 
              className="text-blue-600 hover:underline text-sm font-semibold"
            >
              Cookie Policy
            </a>
            <span className="text-slate-400">|</span>
            <Link 
              href="/" 
              className="text-blue-600 hover:underline text-sm font-semibold"
            >
              Zpět na Faktix
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

