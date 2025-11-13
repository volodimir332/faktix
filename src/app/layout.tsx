import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ClientProvider } from "@/contexts/ClientContext";
import { InvoiceProvider } from "@/contexts/InvoiceContext";
import { CalculationProvider } from "@/contexts/CalculationContext";
import { AuthGuard } from "@/components/AuthGuard";
import { AuthInitializer } from "@/components/AuthInitializer";
import { ColorFixer } from "@/components/ColorFixer";
import CookieConsent from "@/components/CookieConsent";

// ⚡ ОПТИМІЗАЦІЯ: Font optimization з preload та fallback
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true, // Швидше завантаження критичного шрифту
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Не критичний шрифт, завантажиться пізніше
  fallback: ['Monaco', 'Courier New', 'monospace'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://faktix.cz'),
  title: {
    default: "Faktix - Fakturace za 30 sekund | Online systém pro OSVČ a s.r.o.",
    template: "%s | Faktix"
  },
  description: "Vytvořte fakturu online za méně než minutu! Profesionální fakturační systém pro živnostníky, OSVČ a s.r.o. ✓ Zdarma ✓ Kalkulace daní ✓ Paušální daň ✓ Analytiky",
  keywords: [
    // Hlavní klíčová slova ČESKY (nejvyšší priorita)
    "faktury online", "vystavit fakturu", "fakturace zdarma", "vystavení faktury", "faktury online zdarma",
    "faktury OSVČ", "faktury s.r.o.", "faktury živnostník", "faktura OSVČ vzor", "faktura online bez registrace",
    
    // Fakturace a účetnictví ČESKY
    "fakturační systém", "fakturační program", "online fakturace", "vytvoření faktury", "vytvořit fakturu",
    "účetnictví online", "živnostenské faktury", "faktury čeština", "faktury pdf", "faktury ke stažení",
    "fakturace pro živnostníky", "fakturační software", "fakturace pro firmy", "nejlepší fakturační systém",
    
    // Kalkulace a daně ČESKY
    "kalkulace daní", "kalkulace daní OSVČ", "kalkulačka daní", "výpočet daní OSVČ", "daňová kalkulačka",
    "paušální daň", "paušální daň kalkulačka", "paušální daň 2025", "paušální daň OSVČ", "paušální daň kalkulace",
    "sociální pojištění OSVČ", "zdravotní pojištění OSVČ", "pojištění OSVČ 2025", "minimální zálohy OSVČ",
    
    // Dodatečné ČESKÉ zapytania
    "CRM pro OSVČ", "správa klientů", "daňové přiznání OSVČ", "jak vystavit fakturu", "jak dělat faktury",
    "faktury pro živnostníky", "faktury ČR", "české faktury", "fakturace Česká republika", 
    "kalkulace ceny", "kalkulace nákladů", "cenová kalkulace", "výpočet ceny", "ceník faktury",
    "nabídky a faktury", "objednávky a faktury", "dodací list a faktura", "proforma faktura",
    
    // УКРАЇНСЬКІ ключові слова
    "рахунки онлайн", "виписати рахунок", "безкоштовні рахунки", "рахунки для ФОП", 
    "калькулятор податків", "розрахунок податків", "бухгалтерія онлайн", "рахунки Україна",
    "створити рахунок", "система рахунків", "облік клієнтів", "фінансова аналітика",
    "рахунки українською", "виставлення рахунків", "програма для рахунків"
  ],
  authors: [{ name: "faktix Team", url: "https://faktix.cz" }],
  creator: "faktix",
  publisher: "faktix",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Faktix",
  },
  applicationName: "Faktix",
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    alternateLocale: ["uk_UA", "en_US"],
    url: "https://faktix.cz",
    siteName: "Faktix",
    title: "Faktix - Nejrychlejší fakturace pro OSVČ a firmy",
    description: "Vytvořte profesionální fakturu za 30 sekund. Zdarma. Bez registrace. S automatickými daňovými kalkulacemi.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Faktix - Moderní fakturační systém",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faktix - Fakturace za 30 sekund",
    description: "Profesionální faktury pro OSVČ a s.r.o. Zdarma. Kalkulace daní. Paušální daň.",
    images: ["/og-image.png"],
    creator: "@faktix",
  },
  alternates: {
    canonical: "https://faktix.cz",
    languages: {
      'cs-CZ': 'https://faktix.cz',
      'uk-UA': 'https://faktix.cz?lang=uk',
      'en-US': 'https://faktix.cz?lang=en',
    },
  },
  verification: {
    google: 'cp_9GzoaDSowK7Mnl6KJ2oVHJD4v8N29m1Y6Nq5cVH4',
    yandex: 'your-yandex-verification-code-here',
  },
  category: 'business',
};

// Viewport configuration (Next.js 15+)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#00ff88",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="dark" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning={true}
      >
        <LanguageProvider>
          <ClientProvider>
            <InvoiceProvider>
              <CalculationProvider>
                {/* Initialize global auth state listener */}
                <AuthInitializer />
                
                {/* Auto-fix oklab/oklch color issues for PDF generation and older browsers */}
                <ColorFixer fallbackColor="#ffffff" />
                
                {/* Temporarily disabled AuthGuard for testing */}
                {/* <AuthGuard> */}
                {children}
                {/* </AuthGuard> */}
                
                {/* Cookie Consent Banner */}
                <CookieConsent />
              </CalculationProvider>
            </InvoiceProvider>
          </ClientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
