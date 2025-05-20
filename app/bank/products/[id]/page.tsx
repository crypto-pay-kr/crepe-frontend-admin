"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Search, ChevronLeft, ChevronRight, Filter, Ban, FileText, Eye, ArrowLeft,Check,X } from "lucide-react"
import ProductActionModal from "@/components/common/product-modal"
import ProductDetailModal from "@/components/common/product-detail-modal"
import PDFViewer  from "@/components/common/pdf-viewer-modal"



export default function BankProductManagement() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const bankId = params.id;
  const bankName = searchParams.get('name') || "은행";
  
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{id: number, productName: string, actionType: 'approve' | 'reject' | 'suspend'} | null>(null)
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<any>(null)
  const [selectedPdfProduct, setSelectedPdfProduct] = useState<string>("")

  // 상품 안내서 조회
  const handleViewProductGuide = (productId: number) => {
    const product = bankProducts.find(p => p.id === productId)
    if (product) {
      setSelectedPdfProduct(product.productName)
      setPdfViewerOpen(true)
    }
  }

  // 상품 상세 조회
  const handleViewProductDetails = (productId: number) => {
    const product = bankProducts.find(p => p.id === productId)
    if (product) {
      setSelectedDetailProduct(product)
      setDetailModalOpen(true)
    }
  }

  // 상품 액션 처리 (승인/거절/판매정지)
  const handleProductAction = (productId: number, productName: string, actionType: 'approve' | 'reject' | 'suspend') => {
    setSelectedProduct({ id: productId, productName, actionType });
    setActionModalOpen(true);
  }

  const handleConfirmAction = (reason?: string, action?: 'approve' | 'reject' | 'suspend') => {
    if (selectedProduct) {
      console.log(`상품 ${action} 처리: ${selectedProduct.id}, ${selectedProduct.productName}, 사유: ${reason || '없음'}`);
      // 실제 구현에서는 API 호출 등을 통해 상품 처리
    }
    setActionModalOpen(false);
    setSelectedProduct(null);
  }

  const handleCloseActionModal = () => {
    setActionModalOpen(false);
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

  // 상품 상태에 따른 버튼 렌더링
  const renderActionButton = (product: any) => {
    switch (product.status) {
      case "승인 중":
      case "심사 중":
        return (
          <div className="flex gap-1">
            <button
              onClick={() => handleProductAction(product.id, product.productName, 'approve')}
              className="flex-1 px-2 py-1 rounded-md text-xs font-medium border border-green-500 text-green-600 hover:bg-green-50 transition-all flex items-center justify-center"
            >
              <Check className="w-3 h-3 mr-1" />
              승인
            </button>
            <button
              onClick={() => handleProductAction(product.id, product.productName, 'reject')}
              className="flex-1 px-2 py-1 rounded-md text-xs font-medium border border-red-500 text-red-600 hover:bg-red-50 transition-all flex items-center justify-center"
            >
              <X className="w-3 h-3 mr-1" />
              거절
            </button>
          </div>
        )
      case "승인":
        return (
          <button
            onClick={() => handleProductAction(product.id, product.productName, 'suspend')}
            className="w-full px-2 py-1 rounded-md text-xs font-medium border border-pink-500 text-pink-500 hover:bg-pink-50 transition-all flex items-center justify-center"
          >
            <Ban className="w-3 h-3 mr-1" />
            판매 정지
          </button>
        )
      case "거절":
      default:
        return (
          <button className="w-full px-2 py-1 rounded-md text-xs font-medium text-gray-400 border border-gray-200 cursor-not-allowed">
            -
          </button>
        )
    }
  }
  
  const handleGoBack = () => {
    router.push(`/bank/management/${bankId}?name=${encodeURIComponent(bankName)}`);
  }

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
              <h1 className="text-2xl font-bold text-gray-800">{bankName}</h1>
            </div>
            <div className="text-sm text-gray-500">
              <span className="hover:text-pink-500">은행</span> / <span className="hover:text-pink-500">은행 상세 관리</span> / <span className="text-gray-700 font-medium ml-1">은행 상품 관리</span>
            </div>
          </div>

        {/* 검색 및 필터 */}
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
            
            <div className="flex items-center gap-3">
              <Link href={`/bank/products/${bankId}/suspended?name=${encodeURIComponent(bankName)}`}>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-white text-pink-500 border border-pink-500 hover:bg-pink-50">
                  <Filter size={16} />
                  판매정지 상품 리스트
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 상품 테이블 */}
        <div className="px-6 pb-6">
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">#</th>
                  <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">상품명</th>
                  <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">종류</th>
                  <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">주관은행</th>
                  <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">총 혜택 자본금</th>
                  <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">최대 인원</th>
                  <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">혜택</th>
                  <th className="py-3 px-2 text-left font-bold text-gray-500 text-xs">상태</th>
                  <th className="py-3 px-2 text-center font-bold text-gray-500 text-xs" colSpan={3}>
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {bankProducts.map((product) => (
                  <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 text-xs font-medium text-gray-800">{product.id}</td>
                    <td className="py-3 px-2 text-xs font-medium text-gray-800">{product.productName}</td>
                    <td className="py-3 px-2 text-xs text-gray-600">{product.type}</td>
                    <td className="py-3 px-2 text-xs text-gray-600">{product.bank}</td>
                    <td className="py-3 px-2 text-xs text-gray-600">{product.deposit}</td>
                    <td className="py-3 px-2 text-xs text-gray-600">{product.members}</td>
                    <td className="py-3 px-2 text-xs text-gray-600">{product.benefit}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === "승인" ? "bg-green-100 text-green-700" :
                        product.status === "심사 중" ? "bg-yellow-100 text-yellow-700" :
                        product.status === "승인 중" ? "bg-blue-100 text-blue-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-1">
                      {renderActionButton(product)}
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

          {/* 페이지네이션 */}
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
        </div>
      </div>
      
      {/* 상품 액션 모달 */}
      <ProductActionModal
        isOpen={actionModalOpen}
        onClose={handleCloseActionModal}
        onConfirm={handleConfirmAction}
        productName={selectedProduct?.productName || ""}
        actionType={selectedProduct?.actionType || 'suspend'}
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

const bankProducts = [
  {
    id: 1,
    productName: "쿠션 적금",
    type: "적금",
    bank: "우리은행",
    deposit: "₩50,000,000",
    members: "48명",
    benefit: "연 3.5% + 1.5%",
    status: "승인",
  },
  {
    id: 2,
    productName: "자유로 예금",
    type: "예금",
    bank: "우리은행",
    deposit: "₩120,000,000",
    members: "72명",
    benefit: "연 3.5% + 1.5%",
    status: "심사 중",
  },
  {
    id: 3,
    productName: "미래설계 연금",
    type: "연금",
    bank: "국민은행",
    deposit: "₩80,000,000",
    members: "35명",
    benefit: "연 3.5% + 1.5%",
    status: "승인",
  },
  {
    id: 4,
    productName: "여행자 특별 적금",
    type: "적금",
    bank: "신한은행",
    deposit: "₩25,000,000",
    members: "29명",
    benefit: "15% 할인",
    status: "승인",
  },
  {
    id: 5,
    productName: "디지털 입출금통장",
    type: "입출금",
    bank: "하나은행",
    deposit: "₩35,000,000",
    members: "58명",
    benefit: "연 3.5% + 1.5%",
    status: "승인",
  },
  {
    id: 6,
    productName: "청년 희망 적금",
    type: "적금",
    bank: "농협은행",
    deposit: "₩15,000,000",
    members: "18명",
    benefit: "연 3.5% + 1.5%",
    status: "거절",
  },
  {
    id: 7,
    productName: "주택청약종합저축",
    type: "청약",
    bank: "우리은행",
    deposit: "₩130,000,000",
    members: "92명",
    benefit: "연 3.5% + 1.5%",
    status: "승인",
  },
  {
    id: 8,
    productName: "외화 정기예금",
    type: "예금",
    bank: "SC제일은행",
    deposit: "₩95,000,000",
    members: "41명",
    benefit: "연 3.5% + 1.5%",
    status: "승인",
  },
  {
    id: 9,
    productName: "스마트 정기적금",
    type: "적금",
    bank: "카카오뱅크",
    deposit: "₩45,000,000",
    members: "87명",
    benefit: "연 3.5% + 1.5%",
    status: "승인",
  },
  {
    id: 10,
    productName: "플러스 정기예금",
    type: "예금",
    bank: "토스뱅크",
    deposit: "₩88,000,000",
    members: "62명",
    benefit: "연 3.5% + 1.5%",
    status: "승인",
  },
]