"use client"
import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, X, Check, Eye } from "lucide-react"
import { ConfirmationModal } from "@/components/common/confirm-modal";

// API URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 토큰 요청 상태 열거형
enum BankTokenStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

// 토큰 요청 타입 열거형
enum TokenRequestType {
  NEW = "NEW",
  UPDATE = "UPDATE"
}

// 포트폴리오 상세 인터페이스
interface PortfolioDetail {
  coinName: string;
  coinCurrency: string;
  prevAmount: number | null;
  prevPrice: number | null;
  updateAmount: number;
  updatePrice: number;
}

// 토큰 요청 인터페이스
interface TokenRequest {
  bankId: number;
  bankName: string;
  bankTokenId: number;
  tokenHistoryId: number;
  changeReason: string | null;
  rejectReason: string | null;
  requestType: string;
  status: string;
  createdAt: string;
  totalSupplyAmount: number;
  portfolioDetails: PortfolioDetail[];
}

// 페이지네이션 인터페이스
interface PaginationInfo {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // 현재 페이지 (0부터 시작)
}

export default function TokenRequests() {
  // 상태 관리
  const [tokenRequests, setTokenRequests] = useState<TokenRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  
  // 모달 상태
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TokenRequest | null>(null);

  // 요청 목록 조회 함수
  const fetchTokenRequests = async (page = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }
      
      // API 요청
      const response = await fetch(
        `${API_BASE_URL}/api/admin/bank/token?page=${page}&size=${pagination.size}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 데이터가 배열인지 확인하고 처리
      const resultData = Array.isArray(data) ? data : (data.content || []);
      
      // 토큰 요청 데이터 설정
      setTokenRequests(resultData);
      
      // 페이지네이션 정보 처리 (백엔드 응답에 따라 다르게 처리)
      if (data && typeof data === 'object' && 'totalPages' in data) {
        // 백엔드가 페이지네이션 정보를 포함한 경우
        setPagination({
          totalPages: data.totalPages,
          totalElements: data.totalElements,
          size: data.size,
          number: data.number
        });
        setCurrentPage(data.number);
      } else {
        // 백엔드가 단순 배열을 반환한 경우 - 페이지네이션 정보 계산
        const totalElements = resultData.length;
        const totalPages = Math.max(1, Math.ceil(totalElements / pagination.size));
        
        setPagination({
          totalPages: totalPages,
          totalElements: totalElements,
          size: pagination.size,
          number: page
        });
        setCurrentPage(page);
      }
      
    } catch (err: any) {
      console.error("토큰 요청 목록 조회 실패:", err);
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 요청 목록 조회
  useEffect(() => {
    fetchTokenRequests();
  }, []);

  // 에러 메시지 처리 개선
  const handleApiError = (err: any) => {
    // 계좌 등록 관련 에러 메시지 감지
    if (err.message && (
      err.message.includes("getBankToken()") || 
      err.message.includes("계좌 등록") ||
      err.message.includes("NullPointerException")
    )) {
      setError("계좌 등록이 완료되지 않았습니다. 먼저 은행 계좌 등록을 승인해야 토큰 발행이 가능합니다.");
    } else {
      setError(err.message || "토큰 요청 목록을 불러오는데 실패했습니다.");
    }
  };

  // 요청 승인 처리
  const handleApprove = (request: TokenRequest) => {
    setSelectedRequest(request);
    setApproveModalOpen(true);
  };

  // 요청 반려 처리
  const handleReject = (request: TokenRequest) => {
    setSelectedRequest(request);
    setRejectModalOpen(true);
  };
  
  // 요청 상세 보기
  const handleViewDetails = (request: TokenRequest) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  // 요청 승인 확인
  const handleConfirmApprove = async () => {
    if (!selectedRequest) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }
      
      // API 호출 - 토큰 승인 엔드포인트 (이 부분은 실제 API에 맞게 수정 필요)
      const response = await fetch(`${API_BASE_URL}/api/admin/bank/token/approve?tokenHistoryId=${selectedRequest.tokenHistoryId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
      
      // 성공 메시지 표시
      setSuccess(`${selectedRequest.bankName}의 토큰 발행 요청이 승인되었습니다.`);
      setTimeout(() => setSuccess(null), 3000);
      
      // 목록 갱신
      fetchTokenRequests(currentPage);
      
    } catch (err: any) {
      console.error("토큰 요청 승인 실패:", err);
      setError(err.message || "토큰 요청 승인에 실패했습니다.");
      setTimeout(() => setError(null), 5000);
    }
    
    setApproveModalOpen(false);
  };

  // 요청 반려 확인
  const handleConfirmReject = async () => {
    if (!selectedRequest) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }
      
      // API 호출 - 반려 엔드포인트 (이 부분은 실제 API에 맞게 수정 필요)
      const response = await fetch(`${API_BASE_URL}/api/admin/bank/token/reject?tokenHistoryId=${selectedRequest.tokenHistoryId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rejectReason: "관리자 승인 거부" // 실제로는 사용자 입력을 받아야 할 수 있음
        })
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
      
      setSuccess(`${selectedRequest.bankName}의 토큰 발행 요청이 반려되었습니다.`);
      setTimeout(() => setSuccess(null), 3000);
      
      fetchTokenRequests(currentPage);
      
    } catch (err: any) {
      console.error("토큰 요청 반려 실패:", err);
      setError(err.message || "토큰 요청 반려에 실패했습니다.");
      setTimeout(() => setError(null), 5000);
    }
    
    setRejectModalOpen(false);
  };

  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchTokenRequests(newPage);
    }
  };

  // 검색어 처리
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 검색어에 따라 필터링된 토큰 요청 목록
  const filteredRequests = tokenRequests.filter(request => 
    request.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // 금액 포맷팅 함수
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  // 요청 타입 표시
  const getRequestTypeText = (type: string) => {
    switch (type) {
      case 'NEW': return '신규 발행';
      case 'UPDATE': return '업데이트';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* 성공 메시지 - 플로팅 형태 */}
      {success && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <div className="mx-4 p-3 bg-green-50 border border-green-100 text-green-600 rounded-md shadow-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">토큰 발행 요청</h1>
          </div>
        </div>
        <div className="p-6 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="은행명 검색"
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg w-[300px] focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* 에러 메시지 */}
        {error && (
          <div className="px-6 py-3 my-2 text-red-500 bg-red-50 border border-red-100 rounded-md">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">오류 발생</p>
                <p>{error}</p>
                {error.includes("계좌 등록") && (
                  <p className="mt-2 text-sm">
                    <strong>작업 순서:</strong> 1) 은행 계좌 등록 승인 → 2) 토큰 발행 요청 승인
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* 로딩 상태 */}
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-pink-500 rounded-full mb-2"></div>
            <p>토큰 요청 목록을 불러오는 중...</p>
          </div>
        ) : (
          /* 토큰 요청 테이블 */
          <div className="px-6 pb-6">
            {filteredRequests.length === 0 ? (
              <div className="p-6 text-center text-gray-500 border border-gray-100 rounded-lg">
                {searchTerm ? '검색 결과가 없습니다.' : '등록 요청된 토큰이 없습니다.'}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">#</th>
                      <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">은행명</th>
                      <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">요청 유형</th>
                      <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">총 발행량</th>
                      <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">요청 시간</th>
                      <th className="py-3 px-4 text-middle font-bold text-gray-500 text-sm">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request, index) => (
                      <tr key={request.tokenHistoryId} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-gray-800">{index + 1}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium">
                              {request.bankName.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-800">{request.bankName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.requestType === 'NEW' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {getRequestTypeText(request.requestType)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 font-medium">{formatAmount(request.totalSupplyAmount)} 원</td>
                        <td className="py-4 px-4 text-gray-600">{formatDate(request.createdAt)}</td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye size={14} /> 상세
                            </button>
                            
                            <button
                              onClick={() => handleReject(request)}
                              className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <X size={14} /> 반려
                            </button>
                            
                            <button
                              onClick={() => handleApprove(request)}
                              className="px-3 py-1.5 rounded-md text-sm font-medium border border-pink-500 bg-pink-500 text-white hover:bg-pink-600 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Check size={14} /> 승인
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col items-center mt-6 gap-4">
                <nav className="flex items-center justify-center gap-1">
                  <button 
                    className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {Array.from({ length: pagination.totalPages }).map((_, index) => (
                    <button
                      key={index}
                      className={`w-9 h-9 flex items-center justify-center rounded-md ${
                        currentPage === index
                          ? "bg-pink-500 text-white font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      } transition-colors`}
                      onClick={() => handlePageChange(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages - 1}
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 승인 확인 모달 */}
      <ConfirmationModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleConfirmApprove}
        title="토큰 발행 승인 확인"
        targetName={selectedRequest?.bankName || ""}
        targetType="은행"
        actionText="토큰 발행 승인"
        customMessage={`"${selectedRequest?.bankName}" 은행의 토큰 발행 요청을 승인하시겠습니까? 총 발행량: ${selectedRequest ? formatAmount(selectedRequest.totalSupplyAmount) : 0} 원`}
      />
      
      {/* 반려 확인 모달 */}
      <ConfirmationModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        title="토큰 발행 반려 확인"
        targetName={selectedRequest?.bankName || ""}
        targetType="은행"
        actionText="토큰 발행 반려"
        customMessage={`"${selectedRequest?.bankName}" 은행의 토큰 발행 요청을 반려하시겠습니까?`}
      />
      
      {/* 상세 정보 모달 */}
      {selectedRequest && detailModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm animate-in fade-in duration-150">
          <div className="absolute inset-0" onClick={() => setDetailModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-200"
               style={{
                 boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
               }}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">토큰 발행 상세 정보</h3>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500">은행명</span>
                  <span className="font-medium">{selectedRequest.bankName}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500">요청 유형</span>
                  <span className="font-medium">{getRequestTypeText(selectedRequest.requestType)}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500">총 발행량</span>
                  <span className="font-medium">{formatAmount(selectedRequest.totalSupplyAmount)} 원</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500">요청 시간</span>
                  <span className="font-medium">{formatDate(selectedRequest.createdAt)}</span>
                </div>
                
                {selectedRequest.changeReason && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">변경 사유</span>
                    <span className="font-medium">{selectedRequest.changeReason}</span>
                  </div>
                )}
                
                {/* 포트폴리오 상세 정보 */}
                <div className="mt-4">
                  <span className="text-sm text-gray-500 mb-2 block">포트폴리오 구성</span>
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">코인명</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">통화</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">수량</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">단가</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">금액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRequest.portfolioDetails.map((detail, index) => (
                          <tr key={index} className="border-t border-gray-100">
                            <td className="py-3 px-4 text-gray-800">{detail.coinName}</td>
                            <td className="py-3 px-4 text-gray-600">{detail.coinCurrency}</td>
                            <td className="py-3 px-4 text-gray-600">{formatAmount(detail.updateAmount)}</td>
                            <td className="py-3 px-4 text-gray-600">{formatAmount(detail.updatePrice)} 원</td>
                            <td className="py-3 px-4 font-medium text-gray-800">
                              {formatAmount(detail.updateAmount * detail.updatePrice)} 원
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
              >
                닫기
              </button>
              
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  handleReject(selectedRequest);
                }}
                className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-1.5"
              >
                <X size={14} /> 반려
              </button>
              
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  handleApprove(selectedRequest);
                }}
                className="px-4 py-2 rounded-md text-sm font-medium border border-pink-500 bg-pink-500 text-white hover:bg-pink-600 transition-all flex items-center gap-1.5"
              >
                <Check size={14} /> 승인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}