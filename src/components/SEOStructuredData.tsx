"use client";

/**
 * SEO Structured Data Component
 * Додає JSON-LD розмітку для покращення відображення в результатах пошуку Google
 * 
 * Переваги:
 * - Багаті сніпети (Rich Snippets) в Google
 * - Покращена видимість в пошукових результатах
 * - Рейтинг, ціни, відгуки відображаються прямо в Google
 */

interface StructuredDataProps {
  type: 'organization' | 'software' | 'webapp' | 'article' | 'faq';
}

export function SEOStructuredData({ type }: StructuredDataProps) {
  
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Faktix",
    "alternateName": ["faktix.cz", "Faktix CZ", "Faktix Online"],
    "url": "https://faktix.cz",
    "logo": "https://faktix.cz/logo.png",
    "description": "Nejrychlejší fakturační systém v České republice. Vytvořte fakturu online za 30 sekund. Pro OSVČ, živnostníky a s.r.o. Kalkulace daní, paušální daň, účetnictví online. Zdarma bez registrace.",
    "email": "info@faktix.cz",
    "telephone": "+420 123 456 789",
    "priceRange": "0 - 804 Kč/měsíc",
    "knowsLanguage": ["cs", "uk", "en"],
    "areaServed": ["CZ", "UA"],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CZ",
      "addressLocality": "Praha"
    },
    "sameAs": [
      "https://facebook.com/faktix",
      "https://twitter.com/faktix",
      "https://linkedin.com/company/faktix"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+420 123 456 789",
      "contactType": "customer support",
      "availableLanguage": ["Czech", "Ukrainian", "English"]
    }
  };

  const softwareData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Faktix - Online Fakturace",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "InvoicingSoftware",
    "operatingSystem": "Web, iOS, Android, Windows, Mac",
    "softwareVersion": "2.0",
    "releaseNotes": "Nová verze s kalkulací paušální daně 2025, pokročilými analýzami a CRM systémem",
    "keywords": "faktury online, fakturace, kalkulace daní, paušální daň, účetnictví OSVČ, faktury s.r.o.",
    "inLanguage": ["cs", "uk", "en"],
    "offers": [
      {
        "@type": "Offer",
        "name": "Starter",
        "price": "0",
        "priceCurrency": "CZK",
        "priceValidUntil": "2025-12-31",
        "description": "Bezplatný plán s omezenými funkcemi"
      },
      {
        "@type": "Offer",
        "name": "Základní",
        "price": "229",
        "priceCurrency": "CZK",
        "priceValidUntil": "2025-12-31",
        "description": "Základní fakturační funkce pro malé podnikatele"
      },
      {
        "@type": "Offer",
        "name": "Oblíbený",
        "price": "467",
        "priceCurrency": "CZK",
        "priceValidUntil": "2025-12-31",
        "description": "Plné funkce pro rostoucí firmy"
      },
      {
        "@type": "Offer",
        "name": "Prémiový",
        "price": "804",
        "priceCurrency": "CZK",
        "priceValidUntil": "2025-12-31",
        "description": "Kompletní řešení s prioritní podporou"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1234",
      "bestRating": "5",
      "worstRating": "1"
    },
    "description": "Nejrychlejší fakturační systém pro OSVČ, živnostníky a s.r.o. v České republice. Vytvořte profesionální fakturu online za 30 sekund. Kalkulace daní 2025, paušální daň, sociální a zdravotní pojištění. Zdarma bez registrace.",
    "screenshot": "https://faktix.cz/screenshot1.png",
    "featureList": [
      "Vystavení faktury online za 30 sekund - nejrychlejší v ČR",
      "Automatická správa klientů a CRM systém",
      "Kalkulace daní OSVČ 2025 (paušální i standardní režim)",
      "Výpočet sociálního a zdravotního pojištění",
      "Kalkulace paušální daně (všechny 3 úrovně)",
      "Podpora pro OSVČ, živnostníky a s.r.o.",
      "Pokročilé analytiky a finanční přehledy",
      "Export faktur do PDF",
      "Automatické číslování faktur",
      "Sledování splatnosti a upomínky",
      "Proforma faktury a nabídky",
      "Cenové kalkulace a výpočty",
      "Multi-language: čeština, ukrajinština, angličtina",
      "Mobilní aplikace (PWA)",
      "Bez registrace - začněte okamžitě zdarma"
    ]
  };

  const webAppData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Faktix - Online fakturační systém",
    "url": "https://faktix.cz",
    "description": "Profesionální online fakturační systém pro živnostníky a malé firmy v České republice.",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "2.0",
    "operatingSystem": "Any",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CZK",
      "description": "Začněte zdarma"
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jak vystavit fakturu online zdarma?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "S Faktix vystavíte fakturu online za 30 sekund zdarma. Stačí otevřít faktix.cz, vyplnit údaje klienta a služby. Systém automaticky vytvoří profesionální fakturu dle českých zákonů s IČO, DIČ a všemi potřebnými údaji. Bez registrace, bez skrytých poplatků."
        }
      },
      {
        "@type": "Question",
        "name": "Je Faktix fakturační systém zdarma?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano! Nabízíme bezplatný Starter plán bez časového omezení. Můžete vystavovat faktury, spravovat klienty a používat základní funkce navždy zdarma. Pro pokročilé funkce jako kalkulace daní a analytiky máme placené plány od 229 Kč měsíčně."
        }
      },
      {
        "@type": "Question",
        "name": "Jak funguje kalkulace paušální daně 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Faktix automaticky vypočítá vaši paušální daň podle příjmů: do 1 mil. Kč = 7,498 Kč/měsíc, 1-1.5 mil. Kč = 16,745 Kč/měsíc, 1.5-2 mil. Kč = 27,139 Kč/měsíc. Zahrnuje sociální pojištění, zdravotní pojištění a daň z příjmů. Jednoduše zadejte roční příjem a systém vše spočítá."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké faktury mohu vystavovat pro OSVČ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pro OSVČ (osoby samostatně výdělečně činné) můžete vystavovat běžné faktury, zálohové faktury, proforma faktury, daňové doklady, a faktury s nebo bez DPH. Všechny faktury obsahují povinné náležitosti dle zákona: IČO, DIČ, číslo faktury, datum vystavení a splatnosti, sazbu DPH."
        }
      },
      {
        "@type": "Question",
        "name": "Jak Faktix pomáhá s kalkulací daní OSVČ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Faktix automaticky vypočítá všechny daně pro OSVČ v roce 2025: sociální pojištění (min. 4,759 Kč/měsíc), zdravotní pojištění (min. 3,143 Kč/měsíc), daň z příjmů (15% s odpočty). Systém porovná standardní režim vs paušální daň a doporučí nejlevnější variantu. Zahrnuje všechny změny v české legislativě 2025."
        }
      },
      {
        "@type": "Question",
        "name": "Mohu používat Faktix na mobilu a tabletu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano, Faktix je plně responzivní webová aplikace (PWA), která funguje perfektně na všech zařízeních - PC, notebook, tablet, mobilní telefon (iPhone, Android). Můžete vystavovat faktury kdykoliv a kdekoliv, i offline."
        }
      },
      {
        "@type": "Question",
        "name": "Co musí obsahovat faktura pro OSVČ v ČR?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Každá faktura OSVČ musí obsahovat: IČO dodavatele a odběratele, DIČ (pokud jste plátce DPH), číslo faktury, datum vystavení, datum zdanitelného plnění, datum splatnosti, popis služeb/zboží, cenu, měnu, způsob platby, číslo účtu. Faktix všechny tyto údaje automaticky doplní."
        }
      },
      {
        "@type": "Question",
        "name": "Jak kalkulovat cenu služeb a náklady?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Faktix nabízí pokročilou cenovou kalkulaci. Zadáte vaši hodinovou sazbu, materiálové náklady, DPH a systém vypočítá celkovou cenu. Můžete vytvářet cenové nabídky, porovnávat varianty a sledovat ziskovost jednotlivých zakázek."
        }
      }
    ]
  };

  // Výběr správných dat podle typu
  let structuredData;
  switch(type) {
    case 'organization':
      structuredData = organizationData;
      break;
    case 'software':
      structuredData = softwareData;
      break;
    case 'webapp':
      structuredData = webAppData;
      break;
    case 'faq':
      structuredData = faqData;
      break;
    default:
      structuredData = organizationData;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

