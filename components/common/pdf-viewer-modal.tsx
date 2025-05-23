import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  productName: string;
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  productName
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${productName}_안내서.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {productName} - 상품 안내서
            </h2>
            <p className="text-sm text-gray-500 mt-1">PDF 문서</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <Download size={16} />
              다운로드
            </button>
            
            <button
              onClick={handleOpenNewTab}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <ExternalLink size={16} />
              새 탭에서 열기
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF 뷰어 영역 */}
        <div className="flex-1 p-4">
          <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full"
              title={`${productName} 안내서`}
              onError={() => {
                console.error('PDF 로드 실패');
              }}
            />
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              PDF 파일이 제대로 표시되지 않는 경우, 다운로드하거나 새 탭에서 열어주세요.
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewerModal;