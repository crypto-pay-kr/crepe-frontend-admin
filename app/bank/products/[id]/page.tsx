"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Search, ChevronLeft, ChevronRight, Filter, Ban, FileText, Eye, ArrowLeft, Check, X } from "lucide-react"
import ProductActionModal from "@/components/common/product-modal"
import ProductDetailModal from "@/components/common/product-detail-modal"
import PDFViewer from "@/components/common/pdf-viewer-modal"

// API 응답 타입 정의
interface BankProduct {
  id: number;
  type: string;
  productName: string;
  bankName: string;
  totalBudget: number;
  totalParticipants: number;
  status: string;
  minInterestRate: number;
  maxInterestRate: number;
}

// 상품 액션 API 응답 타입
interface ReviewProductSubmissionResponse {
  productId: number;
  status: string;
  productName: string;
  message: string;
}

// 상품 액션 요청 타입
interface ReviewProductSubmissionRequest {
  productId: number;
  status: string;
  description: string;
}

interface ChangeProductSaleRequest {
  productId: number;
  status: string;
  description: string;
}

// 상태 매핑 함수
const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return '승인';
    case 'WAITING':
      return '승인 중';
    case 'REVIEWING':
      return '심사 중';
    case 'REJECTED':
      return '거절';
    case 'SUSPENDED':
      return '판매정지';
    default:
      return status;
  }
};

// 상품 타입 매핑 함수
const getTypeDisplay = (type: string) => {
  switch (type) {
    case 'INSTALLMENT':
      return '적금';
    case 'SAVING':
      return '예금';
    case 'PENSION':
      return '연금';
    case 'CHECKING':
      return '입출금';
    case 'SUBSCRIPTION':
      return '청약';
    default:
      return type;
  }
};

// 혜택 표시 함수
const getBenefitDisplay = (minRate: number, maxRate: number) => {
  if (minRate === maxRate) {
    return `연 ${minRate}%`;
  }
  return `연 ${minRate}% ~ ${maxRate}%`;
};

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
  
  // API 관련 상태
  const [bankProducts, setBankProducts] = useState<BankProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API 호출 함수
  const fetchBankProducts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }
      
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8080/api/admin/bank/product/${bankId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BankProduct[] = await response.json();
      setBankProducts(data);
    } catch (err) {
      console.error('상품 목록 조회 실패:', err);
      setError(err instanceof Error ? err.message : '상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    if (bankId) {
      fetchBankProducts();
    }
  }, [bankId]);

  // 검색 필터링된 상품 목록
  const filteredProducts = bankProducts.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleConfirmAction = async (reason?: string, action?: 'approve' | 'reject' | 'suspend') => {
    if (selectedProduct && action) {
      try {
        let apiUrl = '';
        let requestBody = {};
        let statusValue = '';

        // 액션 타입에 따라 API 엔드포인트와 상태값 설정
        if (action === 'approve') {
          apiUrl = 'http://localhost:8080/api/admin/bank/product/review';
          statusValue = 'APPROVED';
        } else if (action === 'reject') {
          apiUrl = 'http://localhost:8080/api/admin/bank/product/review';
          statusValue = 'REJECTED';
        } else if (action === 'suspend') {
          apiUrl = 'http://localhost:8080/api/admin/bank/product/suspend';
          statusValue = 'SUSPENDED';
        }

        // 요청 바디 구성
        requestBody = {
          productId: selectedProduct.id,
          status: statusValue,
          description: reason || ''
        };
        
        const token = localStorage.getItem('accessToken');
      
        if (!token) {
          throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
        }

        const response = await fetch(apiUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(`상품 ${action} 처리 완료:`, result);
        
        // 상품 목록 새로고침
        await fetchBankProducts();
        
      } catch (err) {
        console.error('상품 액션 처리 실패:', err);
        // 에러 처리 (토스트 메시지 등)
        alert(`상품 ${action} 처리에 실패했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
      }
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
  const renderActionButton = (product: BankProduct) => {
    switch (product.status) {
      case "WAITING":
      case "REVIEWING":
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
      case "APPROVED":
        return (
          <button
            onClick={() => handleProductAction(product.id, product.productName, 'suspend')}
            className="w-full px-2 py-1 rounded-md text-xs font-medium border border-pink-500 text-pink-500 hover:bg-pink-50 transition-all flex items-center justify-center"
          >
            <Ban className="w-3 h-3 mr-1" />
            판매 정지
          </button>
        )
      case "SUSPENDED":
        return (
          <button 
            className="w-full px-2 py-1 rounded-md text-xs font-medium text-gray-400 border border-gray-200 cursor-not-allowed bg-gray-50"
            disabled
          >
            판매정지됨
          </button>
        )
      case "REJECTED":
        return (
          <button 
            className="w-full px-2 py-1 rounded-md text-xs font-medium text-gray-400 border border-gray-200 cursor-not-allowed bg-gray-50"
            disabled
          >
            거절됨
          </button>
        )
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

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">상품 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">오류가 발생했습니다: {error}</p>
            <button
              onClick={fetchBankProducts}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-gray-500">
                      {searchTerm ? '검색 결과가 없습니다.' : '등록된 상품이 없습니다.'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 text-xs font-medium text-gray-800">{product.id}</td>
                      <td className="py-3 px-2 text-xs font-medium text-gray-800">{product.productName}</td>
                      <td className="py-3 px-2 text-xs text-gray-600">{getTypeDisplay(product.type)}</td>
                      <td className="py-3 px-2 text-xs text-gray-600">{product.bankName}</td>
                      <td className="py-3 px-2 text-xs text-gray-600">₩{product.totalBudget.toLocaleString()}</td>
                      <td className="py-3 px-2 text-xs text-gray-600">{product.totalParticipants}명</td>
                      <td className="py-3 px-2 text-xs text-gray-600">{getBenefitDisplay(product.minInterestRate, product.maxInterestRate)}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === "APPROVED" ? "bg-green-100 text-green-700" :
                          product.status === "REVIEWING" ? "bg-yellow-100 text-yellow-700" :
                          product.status === "WAITING" ? "bg-blue-100 text-blue-700" :
                          product.status === "SUSPENDED" ? "bg-pink-100 text-pink-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {getStatusDisplay(product.status)}
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
                  ))
                )}
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