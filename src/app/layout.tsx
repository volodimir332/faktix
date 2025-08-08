import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ClientProvider } from "@/contexts/ClientContext";
import { InvoiceProvider } from "@/contexts/InvoiceContext";
import { AuthGuard } from "@/components/AuthGuard";
import ConditionalAIAssistant from "@/components/ConditionalAIAssistant";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "faktix - Rychlá fakturace pro moderní podnikatele",
  description: "Vystavte fakturu za 30 sekund. První měsíc zcela zdarma! Moderní fakturační systém pro podnikatele v České republice a na Ukrajině.",
  keywords: ["faktix", "faktury", "fakturace", "účetnictví", "podnikání", "česká republika", "ukrajina"],
  authors: [{ name: "faktix Team" }],
  creator: "faktix",
  publisher: "faktix",
  robots: "index, follow",
  openGraph: {
    title: "Faktury - Rychlá fakturace pro moderní podnikatele",
    description: "Vystavte fakturu za 30 sekund. První měsíc zcela zdarma!",
    type: "website",
    locale: "cs_CZ",
    alternateLocale: ["uk_UA"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faktury - Rychlá fakturace pro moderní podnikatele",
    description: "Vystavte fakturu za 30 sekund. První měsíc zcela zdarma!",
  },
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
              {/* Temporarily disabled AuthGuard for testing */}
              {/* <AuthGuard> */}
              {children}
              {/* AI Assistant - appears only on internal platform pages */}
              <ConditionalAIAssistant />
              {/* </AuthGuard> */}
            </InvoiceProvider>
          </ClientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
