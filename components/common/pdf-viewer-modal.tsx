// components/common/pdf-viewer-modal.tsx
'use client';

import { FileText, X } from 'lucide-react';
import pdfUrl from '@/assets/rest.pdf'; 

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const PDFViewer = ({ isOpen, onClose, productName }: PDFViewerProps) => {
  // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;
  
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="text-pink-500 w-5 h-5 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">{productName} 상품 안내서</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* PDF 내용 */}
        <div className="w-full h-[75vh] bg-gray-50">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-none"
            title={`${productName} PDF Viewer`}
          />
        </div>
        
      </div>
    </div>
  );
};

export default PDFViewer;