declare module 'html2canvas' {
  interface Html2CanvasOptions {
    allowTaint?: boolean;
    backgroundColor?: string;
    canvas?: HTMLCanvasElement;
    foreignObjectRendering?: boolean;
    imageTimeout?: number;
    ignoreElements?: (element: Element) => boolean;
    logging?: boolean;
    onclone?: (clonedDoc: Document) => void;
    proxy?: string;
    removeContainer?: boolean;
    scale?: number;
    scrollX?: number;
    scrollY?: number;
    useCORS?: boolean;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
  }

  function html2canvas(element: Element, options?: Html2CanvasOptions): Promise<HTMLCanvasElement>;
  export = html2canvas;
} 