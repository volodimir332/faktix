/**
 * Czech Construction Data & Prices (2025)
 * Databáze českých stavebních termínů, cen a postupů
 */

export const CZECH_CONSTRUCTION_PRICES = {
  // DLAŽBA A OBKLADY
  tiles: {
    'Dlažba keramická': { price: 400, unit: 'm²', category: 'materiál' },
    'Obklady keramické': { price: 350, unit: 'm²', category: 'materiál' },
    'Lepidlo flexibilní': { price: 180, unit: 'bal', category: 'materiál' },
    'Spárovací hmota': { price: 250, unit: 'bal', category: 'materiál' },
    'Těsnící pás': { price: 150, unit: 'bm', category: 'materiál' },
    'Pokládka dlažby': { price: 400, unit: 'm²', category: 'práce' },
    'Pokládka obkladů': { price: 450, unit: 'm²', category: 'práce' },
  },
  
  // FASÁDY
  facade: {
    'Kontaktní zateplovací systém (ETICS)': { price: 1600, unit: 'm²', category: 'materiál + práce' },
    'Fasádní omítka tenkovrstvá': { price: 600, unit: 'm²', category: 'materiál + práce' },
    'Polystyren EPS 100mm': { price: 250, unit: 'm²', category: 'materiál' },
    'Minerální vata 100mm': { price: 350, unit: 'm²', category: 'materiál' },
    'Výztužná sklotextilní síťka': { price: 80, unit: 'm²', category: 'materiál' },
    'Lepící hmota': { price: 150, unit: 'bal', category: 'materiál' },
    'Montáž lešení': { price: 120, unit: 'm²', category: 'práce' },
    'Nátěr fasády': { price: 180, unit: 'm²', category: 'práce' },
  },

  // STŘECHY
  roofing: {
    'Pálená střešní taška': { price: 450, unit: 'm²', category: 'materiál' },
    'Betonová taška': { price: 350, unit: 'm²', category: 'materiál' },
    'Plechová krytina': { price: 400, unit: 'm²', category: 'materiál' },
    'Latě 40x60mm': { price: 45, unit: 'bm', category: 'materiál' },
    'Kontralatě': { price: 40, unit: 'bm', category: 'materiál' },
    'Parozábrana': { price: 80, unit: 'm²', category: 'materiál' },
    'Střešní fólie': { price: 90, unit: 'm²', category: 'materiál' },
    'Pokrývačské práce': { price: 550, unit: 'm²', category: 'práce' },
    'Tesařské práce': { price: 450, unit: 'm²', category: 'práce' },
  },

  // MALÍŘSKÉ PRÁCE
  painting: {
    'Malířská barva disperzní': { price: 120, unit: 'l', category: 'materiál' },
    'Penetrace': { price: 80, unit: 'l', category: 'materiál' },
    'Štuk': { price: 200, unit: 'bal', category: 'materiál' },
    'Skelná tkanina': { price: 60, unit: 'm²', category: 'materiál' },
    'Malování stěn': { price: 180, unit: 'm²', category: 'práce' },
    'Malování stropů': { price: 200, unit: 'm²', category: 'práce' },
    'Stěrkování': { price: 150, unit: 'm²', category: 'práce' },
  },

  // PODLAHY
  flooring: {
    'Laminátová podlaha': { price: 500, unit: 'm²', category: 'materiál' },
    'Vinylová podlaha': { price: 600, unit: 'm²', category: 'materiál' },
    'Parkety dřevěné': { price: 1200, unit: 'm²', category: 'materiál' },
    'Podložka pod laminát': { price: 50, unit: 'm²', category: 'materiál' },
    'Soklová lišta': { price: 80, unit: 'bm', category: 'materiál' },
    'Pokládka laminátové podlahy': { price: 200, unit: 'm²', category: 'práce' },
    'Pokládka vinylové podlahy': { price: 250, unit: 'm²', category: 'práce' },
  },

  // SÁDROKARTON
  drywall: {
    'Sádrokartonová deska 12,5mm': { price: 150, unit: 'm²', category: 'materiál' },
    'CD profil 60/27': { price: 35, unit: 'bm', category: 'materiál' },
    'UD profil 28/27': { price: 30, unit: 'bm', category: 'materiál' },
    'Závěs přímý': { price: 8, unit: 'ks', category: 'materiál' },
    'Minerální izolace': { price: 120, unit: 'm²', category: 'materiál' },
    'Montáž SDK příček': { price: 280, unit: 'm²', category: 'práce' },
    'Montáž SDK podhledů': { price: 320, unit: 'm²', category: 'práce' },
  },

  // ELEKTROINSTALACE
  electrical: {
    'Elektroinstalace komplet': { price: 450, unit: 'm²', category: 'materiál + práce' },
    'Zásuvka': { price: 350, unit: 'ks', category: 'materiál + práce' },
    'Vypínač': { price: 300, unit: 'ks', category: 'materiál + práce' },
    'Svítidlo LED': { price: 800, unit: 'ks', category: 'materiál' },
  },

  // SANITÁRNÍ TECHNIKA
  plumbing: {
    'Vodovodní rozvody': { price: 400, unit: 'm²', category: 'materiál + práce' },
    'Odpadní potrubí': { price: 350, unit: 'm²', category: 'materiál + práce' },
    'WC mísa závěsná': { price: 4500, unit: 'ks', category: 'materiál' },
    'Umyvadlo': { price: 2500, unit: 'ks', category: 'materiál' },
    'Sprchový kout': { price: 8000, unit: 'ks', category: 'materiál' },
  },
};

export const CZECH_CONSTRUCTION_TERMS = {
  // Základní termíny
  materials: [
    'Dlažba keramická',
    'Obklady',
    'Lepidlo flexibilní',
    'Spárovací hmota',
    'Fasádní omítka tenkovrstvá',
    'Kontaktní zateplovací systém (ETICS)',
    'Střešní krytina',
    'Parozábrana',
    'Malířská barva disperzní',
    'Penetrace',
    'Sádrokartonové desky (SDK)',
    'Laminátová podlaha',
  ],
  
  works: [
    'Pokládka dlažby',
    'Montáž SDK',
    'Pokrývačské práce',
    'Tesařské práce',
    'Malířské práce',
    'Elektroinstalační práce',
    'Instalatérské práce',
  ],

  units: {
    'm': 'metr',
    'm²': 'metr čtvereční',
    'm³': 'metr krychlový',
    'bm': 'běžný metr',
    'ks': 'kus',
    'kg': 'kilogram',
    'l': 'litr',
    't': 'tuna',
    'bal': 'balení',
    'role': 'role',
    'hod': 'hodina práce',
    'den': 'den práce',
  },
};

export const CONSTRUCTION_WORK_TEMPLATES = {
  bathroom: {
    name: 'Rekonstrukce koupelny',
    items: [
      { name: 'Bourací práce', price: 3000, unit: 'kpl' },
      { name: 'Vodovodní rozvody', price: 12000, unit: 'kpl' },
      { name: 'Odpadní potrubí', price: 8000, unit: 'kpl' },
      { name: 'Elektroinstalace', price: 9000, unit: 'kpl' },
      { name: 'Dlažba keramická', price: 450, unit: 'm²' },
      { name: 'Obklady keramické', price: 400, unit: 'm²' },
      { name: 'Lepidlo flexibilní', price: 180, unit: 'bal' },
      { name: 'Spárovací hmota', price: 250, unit: 'bal' },
      { name: 'Pokládka dlažby', price: 400, unit: 'm²' },
      { name: 'Pokládka obkladů', price: 450, unit: 'm²' },
      { name: 'WC mísa závěsná', price: 4500, unit: 'ks' },
      { name: 'Umyvadlo s baterií', price: 3500, unit: 'ks' },
      { name: 'Sprchový kout', price: 8000, unit: 'ks' },
    ],
  },

  facade: {
    name: 'Zateplení fasády',
    items: [
      { name: 'Montáž lešení', price: 120, unit: 'm²' },
      { name: 'Polystyren EPS 100mm', price: 250, unit: 'm²' },
      { name: 'Lepící hmota', price: 150, unit: 'bal' },
      { name: 'Výztužná sklotextilní síťka', price: 80, unit: 'm²' },
      { name: 'Fasádní omítka tenkovrstvá', price: 200, unit: 'm²' },
      { name: 'Penetrace', price: 80, unit: 'l' },
      { name: 'Fasádní barva', price: 150, unit: 'l' },
      { name: 'Montáž ETICS', price: 600, unit: 'm²' },
      { name: 'Nátěr fasády', price: 180, unit: 'm²' },
    ],
  },

  roofing: {
    name: 'Pokrytí střechy',
    items: [
      { name: 'Latě 40x60mm', price: 45, unit: 'bm' },
      { name: 'Kontralatě', price: 40, unit: 'bm' },
      { name: 'Střešní fólie', price: 90, unit: 'm²' },
      { name: 'Pálená střešní taška', price: 450, unit: 'm²' },
      { name: 'Hřebenáče', price: 180, unit: 'bm' },
      { name: 'Okapový systém', price: 350, unit: 'bm' },
      { name: 'Tesařské práce', price: 450, unit: 'm²' },
      { name: 'Pokrývačské práce', price: 550, unit: 'm²' },
    ],
  },
};

export function getCzechConstructionKnowledge(): string {
  return `
ČESKÉ STAVEBNÍ NORMY A POSTUPY:

1. DLAŽBA A OBKLADY:
   - Minimální spára: 2-3mm
   - Lepidlo: cca 3-4 kg/m²
   - Spárovací hmota: cca 1-2 kg/m²
   - Rezerva materiálu: +10%

2. FASÁDY:
   - Doporučená tloušťka izolace: 100-150mm
   - ETICS systém musí být kompletní (od jednoho výrobce)
   - Nutné lešení pro práce ve výšce

3. STŘECHY:
   - Minimální sklon pro tašky: 22°
   - Nutná parozábrana a pojistná hydroizolace
   - Rezerva krycí plochy: +15%

4. SÁDROKARTON:
   - Vzdálenost CD profilů: 400-600mm
   - Pro vlhké prostory použít SDK GKBI
   - Minerální izolace pro zvukovou pohodu

5. MALÍŘSKÉ PRÁCE:
   - Penetrace povrchu vždy nutná
   - 2-3 nátěry pro kvalitní povrch
   - Stěrkování nerovností nad 2mm
`;
}


