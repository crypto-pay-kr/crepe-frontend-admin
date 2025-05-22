"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Search, ChevronLeft, ChevronRight, ArrowLeft, Eye, FileText, RotateCcw, AlertTriangle } from "lucide-react"
import ProductDetailModal from "@/components/common/product-detail-modal"
import PDFViewer from "@/components/common/pdf-viewer-modal"
import { ConfirmationModal } from "@/components/common/confirm-modal"


export default function SuspendedProductsList() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const bankId = params.id;
  const bankName = searchParams.get('name') || "은행";
  
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  
  // 모달 상태 추가
  const [restoreModalOpen, setRestoreModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{id: number, productName: string} | null>(null)
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<any>(null)
  const [selectedPdfProduct, setSelectedPdfProduct] = useState<string>("")

  const handleGoBack = () => {
    router.push(`/bank/products/${bankId}?name=${encodeURIComponent(bankName)}`);
  }

  // 상품 상세 조회
  const handleViewProductDetails = (productId: number) => {
    const product = suspendedProducts.find(p => p.id === productId)
    if (product) {
      setSelectedDetailProduct(product)
      setDetailModalOpen(true)
    }
  }

  // 상품 안내서 조회
  const handleViewProductGuide = (productId: number) => {
    const product = suspendedProducts.find(p => p.id === productId)
    if (product) {
      setSelectedPdfProduct(product.productName)
      setPdfViewerOpen(true)
    }
  }

  // 판매 재개 모달 열기
  const handleRestoreProduct = (productId: number, productName: string) => {
    setSelectedProduct({ id: productId, productName })
    setRestoreModalOpen(true)
  }

  // 판매 재개 확인
  const handleConfirmRestore = () => {
    if (selectedProduct) {
      console.log(`상품 판매 재개: ${selectedProduct.id}, ${selectedProduct.productName}`);
      // 실제 구현에서는 API 호출을 통해 상품 상태 변경
    }
    setRestoreModalOpen(false);
    setSelectedProduct(null);
  }

  // 모달 닫기 핸들러
  const handleCloseRestoreModal = () => {
    setRestoreModalOpen(false);
    setSelectedProduct(null);
  }

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedDetailProduct(null);
  }

  const handleClosePdfViewer = () => {
    setPdfViewerOpen(false);
    setSelectedPdfProduct("");
  }

  // 검색 필터링된 상품 목록
  const filteredProducts = suspendedProducts.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="p-6 border-b border-gray-100">
          <div>
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-500 hover:text-pink-600 mb-2"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span className="text-sm font-medium">돌아가기</span>
            </button>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">{bankName}</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full">
                <AlertTriangle size={16} className="text-red-500" />
                <span className="text-sm font-medium text-red-700">판매정지 상품</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span className="hover:text-pink-500">은행</span> / 
            <span className="hover:text-pink-500"> 은행 상세 관리</span> / 
            <span className="hover:text-pink-500"> 은행 상품 관리</span> / 
            <span className="text-gray-700 font-medium ml-1">판매정지 상품 리스트</span>
          </div>
        </div>

        {/* 상품 정보 요약 */}
        <div className="p-6 bg-red-50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{filteredProducts.length}</div>
              <div className="text-sm text-gray-600">판매정지 상품 수</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                ₩{filteredProducts.reduce((sum, product) => sum + parseInt(product.deposit.replace(/[₩,]/g, '')), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">총 예치금</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {filteredProducts.reduce((sum, product) => sum + parseInt(product.members.replace('명', '')), 0)}명
              </div>
              <div className="text-sm text-gray-600">총 예치 인원</div>
            </div>
          </div>
        </div>

        {/* 검색 */}
        <div className="p-6 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="상품명 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg w-[300px] focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 상품 테이블 */}
        <div className="px-6 pb-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
              <div className="text-lg font-medium text-gray-600 mb-2">판매정지된 상품이 없습니다</div>
              <div className="text-sm text-gray-500">
                {searchTerm ? '검색 조건에 맞는 상품이 없습니다.' : '현재 모든 상품이 정상적으로 판매되고 있습니다.'}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">#</th>
                    <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">상품명</th>
                    <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">종류</th>
                    <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">주관은행</th>
                    <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">총 예치 인원</th>
                    <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">혜택</th>
                    <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">정지일</th>
                    <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">정지사유</th>
                    <th className="py-3 px-2 text-center font-bold text-gray-500 text-xs" colSpan={3}>
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 text-xs font-medium text-gray-800">{product.id}</td>
                      <td className="py-3 px-2 text-xs font-medium text-gray-800">{product.productName}</td>
                      <td className="py-3 px-2 text-xs text-gray-600">{product.type}</td>
                  
                      <td className="py-3 px-2 text-xs text-gray-600">{product.deposit}</td>
                      <td className="py-3 px-2 text-xs text-gray-600">{product.members}</td>
                      <td className="py-3 px-2 text-xs text-gray-600">{product.benefit}</td>
                      <td className="py-3 px-2 text-xs text-gray-600">{product.suspendedDate}</td>
                      <td className="py-3 px-2 text-xs text-gray-600 max-w-[150px] truncate" title={product.suspendedReason}>
                        {product.suspendedReason}
                      </td>
                      <td className="py-3 px-1">
                        <button
                          onClick={() => handleRestoreProduct(product.id, product.productName)}
                          className="w-full px-2 py-1 rounded-md text-xs font-medium border border-green-500 text-green-600 hover:bg-green-50 transition-all flex items-center justify-center"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          판매 재개
                        </button>
                      </td>
                      <td className="py-3 px-1">
                        <button
                          onClick={() => handleViewProductGuide(product.id)}
                          className="w-full px-2 py-1 rounded-md text-xs font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center justify-center"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          안내서
                        </button>
                      </td>
                      <td className="py-3 px-1">
                        <button
                          onClick={() => handleViewProductDetails(product.id)}
                          className="w-full px-2 py-1 rounded-md text-xs font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center justify-center"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          상세 조회
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 페이지네이션 */}
          {filteredProducts.length > 0 && (
            <div className="flex flex-col items-center mt-6 gap-4">
              <nav className="flex items-center justify-center gap-1">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`w-9 h-9 flex items-center justify-center rounded-md ${
                    currentPage === 1 ? "text-gray-300" : "text-gray-400 hover:bg-gray-100"
                  } transition-colors`}
                >
                  <ChevronLeft size={18} />
                </button>
                
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-md ${
                      currentPage === page 
                        ? "bg-pink-500 text-white font-medium" 
                        : "text-gray-600 hover:bg-gray-100 transition-colors"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
                  disabled={currentPage === 5}
                  className={`w-9 h-9 flex items-center justify-center rounded-md ${
                    currentPage === 5 ? "text-gray-300" : "text-gray-400 hover:bg-gray-100"
                  } transition-colors`}
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
      
      {/* 판매 재개 확인 모달 */}
      <ConfirmationModal
        isOpen={restoreModalOpen}
        onClose={handleCloseRestoreModal}
        onConfirm={handleConfirmRestore}
        title="판매 재개 확인"
        targetName={selectedProduct?.productName || ""}
        targetType="상품"
        actionText="판매 재개"
      />
      
      {/* 상품 상세 조회 모달 */}
      <ProductDetailModal
        isOpen={detailModalOpen}
        onClose={handleCloseDetailModal}
        product={selectedDetailProduct}
      />

      {/* PDF 뷰어 */}
      <PDFViewer 
        isOpen={pdfViewerOpen} 
        onClose={handleClosePdfViewer} 
        productName={selectedPdfProduct}
      />
    </div>
  )
}

// 판매정지된 상품 더미 데이터
const suspendedProducts = [
  {
    id: 11,
    productName: "고위험 투자상품",
    type: "투자",
    bank: "투자증권",
    deposit: "₩200,000,000",
    members: "150명",
    benefit: "연 5.5% + 2.0%",
    suspendedDate: "2024-03-15",
    suspendedReason: "고위험 상품으로 인한 고객 보호 차원의 판매 정지"
  },
  {
    id: 12,
    productName: "해외펀드 연계예금",
    type: "예금",
    bank: "글로벌은행",
    deposit: "₩150,000,000",
    members: "89명",
    benefit: "환율 연동",
    suspendedDate: "2024-03-10",
    suspendedReason: "환율 변동성으로 인한 위험도 증가"
  },
  {
    id: 13,
    productName: "단기 고수익 적금",
    type: "적금",
    bank: "신속은행",
    deposit: "₩75,000,000",
    members: "65명",
    benefit: "연 6.0%",
    suspendedDate: "2024-03-08",
    suspendedReason: "약관 변경으로 인한 임시 판매 중단"
  },
  {
    id: 14,
    productName: "암호화폐 연계상품",
    type: "투자",
    bank: "디지털뱅크",
    deposit: "₩300,000,000",
    members: "200명",
    benefit: "비트코인 연동",
    suspendedDate: "2024-03-05",
    suspendedReason: "규제 기관 권고에 따른 판매 정지"
  }
]