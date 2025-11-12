"use client";

interface IconProps {
  className?: string;
}

// Minimalist icons in green lines
export const TilesIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="20" height="20" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <rect x="34" y="10" width="20" height="20" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <rect x="10" y="34" width="20" height="20" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <rect x="34" y="34" width="20" height="20" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <line x1="18" y1="14" x2="26" y2="14" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
    <line x1="18" y1="20" x2="26" y2="20" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
  </svg>
);

export const FacadeIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 8 L52 24 L52 54 L12 54 L12 24 Z" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <rect x="22" y="30" width="8" height="10" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <rect x="34" y="30" width="8" height="10" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <rect x="28" y="44" width="8" height="10" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <line x1="14" y1="30" x2="20" y2="30" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
    <line x1="14" y1="36" x2="20" y2="36" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
    <line x1="44" y1="30" x2="50" y2="30" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
    <line x1="44" y1="36" x2="50" y2="36" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
  </svg>
);

export const RoofIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 36 L32 12 L56 36" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <path d="M12 36 L12 52 L52 52 L52 36" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <line x1="16" y1="18" x2="24" y2="26" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
    <line x1="32" y1="16" x2="32" y2="24" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
    <line x1="40" y1="18" x2="48" y2="26" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
    <line x1="20" y1="40" x2="28" y2="40" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
    <line x1="36" y1="40" x2="44" y2="40" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
  </svg>
);

export const PaintingIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="24" width="6" height="28" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <path d="M16 24 L18 16 L28 16 L30 24" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <line x1="18" y1="32" x2="28" y2="38" stroke="#00ff88" strokeWidth="2" opacity="0.6"/>
    <line x1="28" y1="38" x2="38" y2="28" stroke="#00ff88" strokeWidth="2" opacity="0.6"/>
    <line x1="38" y1="28" x2="48" y2="40" stroke="#00ff88" strokeWidth="2" opacity="0.6"/>
    <circle cx="42" cy="46" r="2" fill="#00ff88" opacity="0.5"/>
    <circle cx="36" cy="52" r="2" fill="#00ff88" opacity="0.5"/>
  </svg>
);

export const FlooringIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="44" height="8" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <rect x="10" y="32" width="22" height="8" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <rect x="32" y="32" width="22" height="8" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <rect x="10" y="44" width="44" height="8" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <line x1="12" y1="22" x2="52" y2="22" stroke="#00ff88" strokeWidth="1" opacity="0.4"/>
    <line x1="12" y1="25" x2="52" y2="25" stroke="#00ff88" strokeWidth="1" opacity="0.4"/>
  </svg>
);

export const DrywallIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="10" width="36" height="44" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <line x1="32" y1="10" x2="32" y2="54" stroke="#00ff88" strokeWidth="2"/>
    <line x1="14" y1="32" x2="50" y2="32" stroke="#00ff88" strokeWidth="2"/>
    <circle cx="20" cy="20" r="1.5" fill="#00ff88"/>
    <circle cx="44" cy="20" r="1.5" fill="#00ff88"/>
    <circle cx="20" cy="44" r="1.5" fill="#00ff88"/>
    <circle cx="44" cy="44" r="1.5" fill="#00ff88"/>
    <line x1="18" y1="16" x2="22" y2="16" stroke="#00ff88" strokeWidth="1" opacity="0.4"/>
    <line x1="42" y1="16" x2="46" y2="16" stroke="#00ff88" strokeWidth="1" opacity="0.4"/>
  </svg>
);

export const PlasterIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="12" width="40" height="40" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <path d="M16 20 Q24 18 32 20 T48 20" stroke="#00ff88" strokeWidth="1.5" opacity="0.6" fill="none"/>
    <path d="M16 28 Q24 26 32 28 T48 28" stroke="#00ff88" strokeWidth="1.5" opacity="0.6" fill="none"/>
    <path d="M16 36 Q24 34 32 36 T48 36" stroke="#00ff88" strokeWidth="1.5" opacity="0.6" fill="none"/>
    <path d="M16 44 Q24 42 32 44 T48 44" stroke="#00ff88" strokeWidth="1.5" opacity="0.6" fill="none"/>
  </svg>
);

export const InsulationIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="16" width="40" height="32" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <path d="M20 20 L20 44 M28 20 L28 44 M36 20 L36 44 M44 20 L44 44" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
    <circle cx="24" cy="26" r="2" stroke="#00ff88" strokeWidth="1.5" fill="none" opacity="0.6"/>
    <circle cx="32" cy="32" r="2" stroke="#00ff88" strokeWidth="1.5" fill="none" opacity="0.6"/>
    <circle cx="40" cy="38" r="2" stroke="#00ff88" strokeWidth="1.5" fill="none" opacity="0.6"/>
  </svg>
);

export const WindowsDoorsIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="14" width="16" height="20" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <line x1="22" y1="14" x2="22" y2="34" stroke="#00ff88" strokeWidth="2"/>
    <line x1="14" y1="24" x2="30" y2="24" stroke="#00ff88" strokeWidth="2"/>
    <rect x="34" y="20" width="16" height="28" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <line x1="42" y1="20" x2="42" y2="48" stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/>
    <circle cx="46" cy="34" r="1.5" fill="#00ff88"/>
  </svg>
);

export const ConstructionIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 50 L32 10 L52 50 Z" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <circle cx="32" cy="32" r="8" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <line x1="32" y1="24" x2="32" y2="10" stroke="#00ff88" strokeWidth="2"/>
    <line x1="24" y1="32" x2="12" y2="32" stroke="#00ff88" strokeWidth="1.5" opacity="0.6"/>
    <line x1="40" y1="32" x2="52" y2="32" stroke="#00ff88" strokeWidth="1.5" opacity="0.6"/>
  </svg>
);

export const DefaultCalculatorIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="12" width="32" height="40" rx="2" stroke="#00ff88" strokeWidth="2" fill="none"/>
    <rect x="20" y="16" width="24" height="8" stroke="#00ff88" strokeWidth="1.5" fill="none"/>
    <circle cx="24" cy="32" r="2" fill="#00ff88"/>
    <circle cx="32" cy="32" r="2" fill="#00ff88"/>
    <circle cx="40" cy="32" r="2" fill="#00ff88"/>
    <circle cx="24" cy="40" r="2" fill="#00ff88"/>
    <circle cx="32" cy="40" r="2" fill="#00ff88"/>
    <circle cx="40" cy="40" r="2" fill="#00ff88"/>
    <rect x="24" y="45" width="16" height="4" fill="#00ff88" opacity="0.6"/>
  </svg>
);

// Auto-select icon based on calculator name/keywords
export const getCalculatorIcon = (name: string): React.FC<IconProps> => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('dlaž') || lowerName.includes('obklad') || lowerName.includes('tile')) {
    return TilesIcon;
  }
  if (lowerName.includes('fasád') || lowerName.includes('facade')) {
    return FacadeIcon;
  }
  if (lowerName.includes('střech') || lowerName.includes('roof') || lowerName.includes('kryt')) {
    return RoofIcon;
  }
  if (lowerName.includes('malíř') || lowerName.includes('nátěr') || lowerName.includes('barv') || lowerName.includes('paint')) {
    return PaintingIcon;
  }
  if (lowerName.includes('podlah') || lowerName.includes('floor') || lowerName.includes('lamin')) {
    return FlooringIcon;
  }
  if (lowerName.includes('sádrokarton') || lowerName.includes('drywall') || lowerName.includes('gips')) {
    return DrywallIcon;
  }
  if (lowerName.includes('omítk') || lowerName.includes('plaster') || lowerName.includes('štuk')) {
    return PlasterIcon;
  }
  if (lowerName.includes('izolac') || lowerName.includes('zateplen') || lowerName.includes('insulation')) {
    return InsulationIcon;
  }
  if (lowerName.includes('okn') || lowerName.includes('dveř') || lowerName.includes('window') || lowerName.includes('door')) {
    return WindowsDoorsIcon;
  }
  if (lowerName.includes('staveb') || lowerName.includes('construction') || lowerName.includes('práce')) {
    return ConstructionIcon;
  }
  
  return DefaultCalculatorIcon;
};


