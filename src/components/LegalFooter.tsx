"use client";

import { Shield, FileText, Cookie, Mail, ExternalLink } from 'lucide-react';

export default function LegalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-4 border-t border-slate-700">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold">Faktix</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Moderní fakturační systém pro OSVČ a malé firmy v České republice.
            </p>
            <div className="text-slate-400 text-xs space-y-1">
              <p><strong className="text-white">IČ:</strong> [Vaše IČ]</p>
              <p><strong className="text-white">DIČ:</strong> [Vaše DIČ]</p>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Produkt
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/faktury" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Faktury
                </a>
              </li>
              <li>
                <a href="/klienti" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Klienti
                </a>
              </li>
              <li>
                <a href="/kalkulace" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Kalkulace
                </a>
              </li>
              <li>
                <a href="/ucetnictvi" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Účetnictví
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Ceník
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              Právní dokumenty
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/legal/ochrana-udaju" 
                  className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  Ochrana osobních údajů
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="/legal/obchodni-podminky" 
                  className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  Obchodní podmínky
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="/legal/cookies" 
                  className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <Cookie className="w-3 h-3" />
                  Cookie Policy
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500" />
              Kontakt
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="mailto:info@faktix.cz" className="hover:text-emerald-400 transition-colors">
                  info@faktix.cz
                </a>
              </li>
              <li>
                <a href="mailto:podpora@faktix.cz" className="hover:text-emerald-400 transition-colors">
                  podpora@faktix.cz
                </a>
              </li>
              <li>
                <a href="mailto:gdpr@faktix.cz" className="hover:text-emerald-400 transition-colors">
                  gdpr@faktix.cz
                </a>
              </li>
              <li className="pt-2">
                <p className="text-xs">
                  <strong className="text-white">Telefon:</strong><br />
                  [Váš telefon]
                </p>
              </li>
              <li>
                <p className="text-xs">
                  <strong className="text-white">Provozní doba:</strong><br />
                  Po-Pá 9:00-17:00
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} <span className="text-white font-semibold">Faktix</span>. 
              Všechna práva vyhrazena.
            </p>

            {/* GDPR Compliance Badge */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-semibold">GDPR Compliant</span>
              </div>
              
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-400 font-semibold">Česká republika</span>
              </div>
            </div>

            {/* Language/Region */}
            <div className="text-xs text-slate-400">
              🇨🇿 Česky | 🇺🇦 Українська
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 max-w-3xl mx-auto">
              Faktix poskytuje nástroje pro vytváření faktur a správu účetnictví. 
              Za správnost údajů uvedených ve fakturách odpovídá uživatel. 
              Doporučujeme konzultovat daňové záležitosti s odborníkem.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

