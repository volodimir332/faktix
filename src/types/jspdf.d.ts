declare module 'jspdf' {
  interface jsPDFOptions {
    orientation?: 'portrait' | 'landscape';
    unit?: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc';
    format?: string | [number, number];
    compress?: boolean;
    precision?: number;
    putOnlyUsedFonts?: boolean;
    floatPrecision?: number | 'smart';
  }

  interface jsPDF {
    addImage(
      imageData: string | HTMLImageElement | HTMLCanvasElement,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number,
      alias?: string,
      compression?: string,
      rotation?: number
    ): jsPDF;
    
    save(filename: string): void;
    output(type: string, options?: Record<string, unknown>): unknown;
  }

  function jsPDF(options?: jsPDFOptions): jsPDF;
  export = jsPDF;
} 