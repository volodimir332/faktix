// Simple price-list based calculators for construction work

export interface CalculatorItem {
  id: string;
  name: string;
  unit: string; // m², m, ks, kg, l, etc.
  defaultPrice: number; // Kč per unit
  defaultQuantity: number;
}

export interface SimpleCalculatorTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  items: CalculatorItem[];
}

export interface CalculatorCategory {
  id: string;
  name: string;
  icon: string;
}

export const calculatorCategories: CalculatorCategory[] = [
  { id: 'flooring', name: 'Podlahy', icon: '🔲' },
  { id: 'walls', name: 'Stěny', icon: '🧱' },
  { id: 'facades', name: 'Fasády', icon: '🏠' },
  { id: 'roofing', name: 'Střechy', icon: '🏡' },
  { id: 'painting', name: 'Malování', icon: '🎨' },
  { id: 'concrete', name: 'Beton', icon: '🏗️' },
  { id: 'drywall', name: 'Sádrokarton', icon: '⬜' },
  { id: 'other', name: 'Ostatní', icon: '🔧' },
];

export const calculatorTemplates: SimpleCalculatorTemplate[] = [
  // Podlahy
  {
    id: 'tile-floor',
    name: 'Obkladačské práce - podlaha',
    description: 'Dlažba a pokládka na podlahu',
    icon: '🔲',
    category: 'flooring',
    items: [
      { id: 'tile-1', name: 'Dlažba keramická', unit: 'm²', defaultPrice: 450, defaultQuantity: 0 },
      { id: 'tile-2', name: 'Dlažba velkoformátová', unit: 'm²', defaultPrice: 650, defaultQuantity: 0 },
      { id: 'work-1', name: 'Pokládka obkladů', unit: 'm²', defaultPrice: 350, defaultQuantity: 0 },
      { id: 'glue-1', name: 'Lepidlo flexibilní', unit: 'kg', defaultPrice: 45, defaultQuantity: 0 },
      { id: 'grout-1', name: 'Spárovací hmota', unit: 'kg', defaultPrice: 35, defaultQuantity: 0 },
      { id: 'work-2', name: 'Spárování', unit: 'm²', defaultPrice: 80, defaultQuantity: 0 },
    ],
  },
  {
    id: 'laminate-floor',
    name: 'Laminátové podlahy',
    description: 'Laminát a pokládka',
    icon: '🪵',
    category: 'flooring',
    items: [
      { id: 'lam-1', name: 'Laminát 8mm', unit: 'm²', defaultPrice: 250, defaultQuantity: 0 },
      { id: 'lam-2', name: 'Laminát 12mm', unit: 'm²', defaultPrice: 350, defaultQuantity: 0 },
      { id: 'under-1', name: 'Podložka PE', unit: 'm²', defaultPrice: 25, defaultQuantity: 0 },
      { id: 'work-1', name: 'Pokládka laminátu', unit: 'm²', defaultPrice: 150, defaultQuantity: 0 },
      { id: 'list-1', name: 'Soklová lišta', unit: 'm', defaultPrice: 45, defaultQuantity: 0 },
    ],
  },
  {
    id: 'vinyl-floor',
    name: 'Vinylové podlahy',
    description: 'Vinyl a pokládka',
    icon: '🟫',
    category: 'flooring',
    items: [
      { id: 'vin-1', name: 'Vinyl SPC', unit: 'm²', defaultPrice: 450, defaultQuantity: 0 },
      { id: 'vin-2', name: 'Vinyl click', unit: 'm²', defaultPrice: 350, defaultQuantity: 0 },
      { id: 'under-1', name: 'Podložka', unit: 'm²', defaultPrice: 30, defaultQuantity: 0 },
      { id: 'work-1', name: 'Pokládka vinylu', unit: 'm²', defaultPrice: 180, defaultQuantity: 0 },
    ],
  },

  // Stěny
  {
    id: 'wall-tiles',
    name: 'Obkladačské práce - stěna',
    description: 'Obklady a pokládka na stěnu',
    icon: '🧱',
    category: 'walls',
    items: [
      { id: 'tile-1', name: 'Obklad keramický', unit: 'm²', defaultPrice: 380, defaultQuantity: 0 },
      { id: 'tile-2', name: 'Obklad velkoformát', unit: 'm²', defaultPrice: 550, defaultQuantity: 0 },
      { id: 'work-1', name: 'Pokládka obkladů', unit: 'm²', defaultPrice: 380, defaultQuantity: 0 },
      { id: 'glue-1', name: 'Lepidlo', unit: 'kg', defaultPrice: 45, defaultQuantity: 0 },
      { id: 'grout-1', name: 'Spárovací hmota', unit: 'kg', defaultPrice: 35, defaultQuantity: 0 },
      { id: 'work-2', name: 'Spárování', unit: 'm²', defaultPrice: 90, defaultQuantity: 0 },
    ],
  },
  {
    id: 'wall-plaster',
    name: 'Omítky',
    description: 'Omítání stěn',
    icon: '🍦',
    category: 'walls',
    items: [
      { id: 'plast-1', name: 'Sádrová omítka', unit: 'kg', defaultPrice: 12, defaultQuantity: 0 },
      { id: 'plast-2', name: 'Cementová omítka', unit: 'kg', defaultPrice: 15, defaultQuantity: 0 },
      { id: 'penet-1', name: 'Penetrace', unit: 'l', defaultPrice: 65, defaultQuantity: 0 },
      { id: 'work-1', name: 'Omítání stěn', unit: 'm²', defaultPrice: 250, defaultQuantity: 0 },
      { id: 'work-2', name: 'Stěrkování', unit: 'm²', defaultPrice: 180, defaultQuantity: 0 },
    ],
  },

  // Fasády
  {
    id: 'facade-plaster',
    name: 'Fasádní omítka',
    description: 'Omítka fasády',
    icon: '🏠',
    category: 'facades',
    items: [
      { id: 'plast-1', name: 'Fasádní omítka minerální', unit: 'kg', defaultPrice: 25, defaultQuantity: 0 },
      { id: 'plast-2', name: 'Fasádní omítka silikátová', unit: 'kg', defaultPrice: 45, defaultQuantity: 0 },
      { id: 'penet-1', name: 'Fasádní penetrace', unit: 'l', defaultPrice: 85, defaultQuantity: 0 },
      { id: 'work-1', name: 'Aplikace omítky', unit: 'm²', defaultPrice: 350, defaultQuantity: 0 },
    ],
  },
  {
    id: 'facade-insulation',
    name: 'Zateplení fasády',
    description: 'ETICS - zateplení',
    icon: '🌡️',
    category: 'facades',
    items: [
      { id: 'iso-1', name: 'Polystyren EPS 100mm', unit: 'm²', defaultPrice: 280, defaultQuantity: 0 },
      { id: 'iso-2', name: 'Minerální vata 100mm', unit: 'm²', defaultPrice: 350, defaultQuantity: 0 },
      { id: 'glue-1', name: 'Lepící hmota', unit: 'kg', defaultPrice: 35, defaultQuantity: 0 },
      { id: 'mesh-1', name: 'Síťovina', unit: 'm²', defaultPrice: 45, defaultQuantity: 0 },
      { id: 'dowel-1', name: 'Talířové hmoždinky', unit: 'ks', defaultPrice: 8, defaultQuantity: 0 },
      { id: 'work-1', name: 'Montáž zateplení', unit: 'm²', defaultPrice: 450, defaultQuantity: 0 },
    ],
  },

  // Střechy
  {
    id: 'roof-tiles',
    name: 'Střešní krytina',
    description: 'Střešní tašky a montáž',
    icon: '🏡',
    category: 'roofing',
    items: [
      { id: 'tile-1', name: 'Betonová taška', unit: 'ks', defaultPrice: 35, defaultQuantity: 0 },
      { id: 'tile-2', name: 'Keramická taška', unit: 'ks', defaultPrice: 55, defaultQuantity: 0 },
      { id: 'lat-1', name: 'Střešní lať', unit: 'm', defaultPrice: 25, defaultQuantity: 0 },
      { id: 'foil-1', name: 'Difuzní fólie', unit: 'm²', defaultPrice: 45, defaultQuantity: 0 },
      { id: 'work-1', name: 'Pokládka tašek', unit: 'm²', defaultPrice: 350, defaultQuantity: 0 },
    ],
  },

  // Malování
  {
    id: 'painting-interior',
    name: 'Malování interiér',
    description: 'Malířské práce uvnitř',
    icon: '🎨',
    category: 'painting',
    items: [
      { id: 'paint-1', name: 'Malířská barva bílá', unit: 'l', defaultPrice: 150, defaultQuantity: 0 },
      { id: 'paint-2', name: 'Malířská barva barevná', unit: 'l', defaultPrice: 180, defaultQuantity: 0 },
      { id: 'penet-1', name: 'Penetrace', unit: 'l', defaultPrice: 65, defaultQuantity: 0 },
      { id: 'work-1', name: 'Malování stěn', unit: 'm²', defaultPrice: 120, defaultQuantity: 0 },
      { id: 'work-2', name: 'Malování stropů', unit: 'm²', defaultPrice: 140, defaultQuantity: 0 },
    ],
  },

  // Beton
  {
    id: 'concrete-work',
    name: 'Betonářské práce',
    description: 'Beton a betonáž',
    icon: '🏗️',
    category: 'concrete',
    items: [
      { id: 'conc-1', name: 'Beton C20/25', unit: 'm³', defaultPrice: 2500, defaultQuantity: 0 },
      { id: 'conc-2', name: 'Beton C25/30', unit: 'm³', defaultPrice: 2800, defaultQuantity: 0 },
      { id: 'steel-1', name: 'Kari síť', unit: 'ks', defaultPrice: 250, defaultQuantity: 0 },
      { id: 'steel-2', name: 'Výztuž betonářská', unit: 'kg', defaultPrice: 25, defaultQuantity: 0 },
      { id: 'work-1', name: 'Betonáž', unit: 'm³', defaultPrice: 800, defaultQuantity: 0 },
    ],
  },

  // Sádrokarton
  {
    id: 'drywall-work',
    name: 'Sádrokartonové práce',
    description: 'SDK konstrukce',
    icon: '⬜',
    category: 'drywall',
    items: [
      { id: 'board-1', name: 'SDK deska standardní', unit: 'ks', defaultPrice: 180, defaultQuantity: 0 },
      { id: 'board-2', name: 'SDK deska impregnovaná', unit: 'ks', defaultPrice: 220, defaultQuantity: 0 },
      { id: 'prof-1', name: 'CW profil', unit: 'ks', defaultPrice: 65, defaultQuantity: 0 },
      { id: 'prof-2', name: 'UW profil', unit: 'ks', defaultPrice: 55, defaultQuantity: 0 },
      { id: 'work-1', name: 'Montáž SDK příčky', unit: 'm²', defaultPrice: 350, defaultQuantity: 0 },
      { id: 'work-2', name: 'Montáž SDK podhledu', unit: 'm²', defaultPrice: 380, defaultQuantity: 0 },
    ],
  },

  // Ostatní
  {
    id: 'demolition',
    name: 'Bourací práce',
    description: 'Demolice a výkopy',
    icon: '🔨',
    category: 'other',
    items: [
      { id: 'dem-1', name: 'Bourání zdiva', unit: 'm³', defaultPrice: 800, defaultQuantity: 0 },
      { id: 'dem-2', name: 'Bourání betonu', unit: 'm³', defaultPrice: 1200, defaultQuantity: 0 },
      { id: 'exc-1', name: 'Výkop ruční', unit: 'm³', defaultPrice: 450, defaultQuantity: 0 },
      { id: 'exc-2', name: 'Výkop strojní', unit: 'm³', defaultPrice: 250, defaultQuantity: 0 },
      { id: 'waste-1', name: 'Odvoz sutě', unit: 't', defaultPrice: 350, defaultQuantity: 0 },
    ],
  },
];

export const getCalculatorsByCategory = (categoryId: string): SimpleCalculatorTemplate[] => {
  return calculatorTemplates.filter(calc => calc.category === categoryId);
};

export const getCalculatorById = (id: string): SimpleCalculatorTemplate | undefined => {
  return calculatorTemplates.find(calc => calc.id === id);
};
