// types/pdftron.d.ts
declare module '@pdftron/pdfjs-express' {
  interface WebViewerInstance {
    UI: any;
    Core: any;
    docViewer: any;
    annotManager: any;
    [key: string]: any;
  }

  interface WebViewerOptions {
    path: string;
    initialDoc?: string;
    extension?: string;
    enableAnnotations?: boolean;
    isReadOnly?: boolean;
    [key: string]: any;
  }

  function WebViewer(options: WebViewerOptions, element: HTMLElement): Promise<WebViewerInstance>;
  
  export default WebViewer;
}