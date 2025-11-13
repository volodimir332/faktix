interface FaktixLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

export function FaktixLogo({ size = "md", className, showText = true }: FaktixLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-8",
    md: "w-8 h-9", 
    lg: "w-9 h-10",
    xl: "w-10 h-12"
  };

  const textSizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl", 
    xl: "text-5xl"
  };

  return (
    <div className={`flex items-center space-x-3 ${className || ""}`}>
      {/* Simple File Icon Outline */}
      <div className={`relative group cursor-pointer ${sizeClasses[size]}`}>
        {/* Main File Body - Only outline */}
        <div className="relative w-full h-full bg-transparent border-2 border-money rounded-md transition-colors duration-150 group-hover:border-money-light">
          {/* Corner Fold */}
          <div className="absolute top-0 right-0">
            <div className="w-1.5 h-1.5 border-l-2 border-b-2 border-money transition-colors duration-150 group-hover:border-money-light"></div>
          </div>
          
          {/* Wavy text lines inside file - closer to center and thicker */}
          <div className="absolute inset-0 flex flex-col justify-center items-center px-1 py-1">
            {/* SVG wavy lines - thicker and closer together */}
            <svg className="w-5/6 h-3 mb-0.5" viewBox="0 0 40 6" fill="none">
              <path d="M3 3 Q10 1 17 3 T37 3" stroke="currentColor" strokeWidth="2.5" className="text-money transition-colors duration-150 group-hover:text-money-light" fill="none"/>
            </svg>
            <svg className="w-5/6 h-3 mb-0.5" viewBox="0 0 40 6" fill="none">
              <path d="M3 3 Q10 5 17 3 T37 3" stroke="currentColor" strokeWidth="2.5" className="text-money transition-colors duration-150 group-hover:text-money-light" fill="none"/>
            </svg>
            <svg className="w-5/6 h-3" viewBox="0 0 40 6" fill="none">
              <path d="M3 3 Q10 1 17 3 T37 3" stroke="currentColor" strokeWidth="2.5" className="text-money transition-colors duration-150 group-hover:text-money-light" fill="none"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span className={`font-semibold text-white tracking-tight leading-tight transition-colors duration-150 select-none cursor-pointer group-hover:text-money antialiased ${textSizeClasses[size]}`}>
            faktix
          </span>
        </div>
      )}
    </div>
  );
}

// Icon only variant
export function FaktixIcon({ size = "md", className }: { size?: "sm" | "md" | "lg" | "xl", className?: string }) {
  return <FaktixLogo size={size} className={className} showText={false} />;
} 