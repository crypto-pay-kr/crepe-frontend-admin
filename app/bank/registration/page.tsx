"use client"
import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, X, Check } from "lucide-react"
import { ConfirmationModal } from "@/components/common/confirm-modal";


// API URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 주소 등록 상태 열거형
enum AddressRegistryStatus {
  REGISTERING = "REGISTERING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

// 주소 요청 인터페이스
interface AddressRequest {
  id: number;
  depositor: string;
  currency: string;
  address: string;
  tag: string;
  addressRegistryStatus: string;
}

// 페이지네이션 인터페이스
interface PaginationInfo {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // 현재 페이지 (0부터 시작)
}

export default function AddressRequests() {
  // 상태 관리
  const [addressRequests, setAddressRequests] = useState<AddressRequest[]>([]);
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
  const [selectedRequest, setSelectedRequest] = useState<AddressRequest | null>(null);

  // 요청 목록 조회 함수
  const fetchAddressRequests = async (page = 0) => {
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
        `${API_BASE_URL}/api/admin/address/requests`,
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
      
      // 데이터 설정
      setAddressRequests(data.content);
      setPagination({
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        size: data.size,
        number: data.number
      });
      setCurrentPage(data.number);
      
    } catch (err: any) {
      console.error("주소 요청 목록 조회 실패:", err);
      setError(err.message || "주소 요청 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 요청 목록 조회
  useEffect(() => {
    fetchAddressRequests();
  }, []);

  // 요청 승인 처리
  const handleApprove = (request: AddressRequest) => {
    setSelectedRequest(request);
    setApproveModalOpen(true);
  };

  // 요청 반려 처리
  const handleReject = (request: AddressRequest) => {
    setSelectedRequest(request);
    setRejectModalOpen(true);
  };

  // 요청 승인 확인
  const handleConfirmApprove = async () => {
    if (!selectedRequest) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }
      
      // API 호출 - 수정된 엔드포인트
      const response = await fetch(`${API_BASE_URL}/api/admin/address/approve?accountId=${selectedRequest.id}`, {
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
      setSuccess(`${selectedRequest.depositor}의 주소 등록 요청이 승인되었습니다.`);
      setTimeout(() => setSuccess(null), 3000);
      
      // 목록 갱신
      fetchAddressRequests(currentPage);
      
    } catch (err: any) {
      console.error("주소 요청 승인 실패:", err);
      setError(err.message || "주소 요청 승인에 실패했습니다.");
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
      
      // API 호출 - 반려 엔드포인트
      const response = await fetch(`${API_BASE_URL}/api/admin/address/disapprove?accountId=${selectedRequest.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
      
      setSuccess(`${selectedRequest.depositor}의 주소 등록 요청이 반려되었습니다.`);
      setTimeout(() => setSuccess(null), 3000);
      
      fetchAddressRequests(currentPage);
      
    } catch (err: any) {
      console.error("주소 요청 반려 실패:", err);
      setError(err.message || "주소 요청 반려에 실패했습니다.");
      setTimeout(() => setError(null), 5000);
    }
    
    setRejectModalOpen(false);
  };

  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchAddressRequests(newPage);
    }
  };

  // 검색어 처리
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 검색어에 따라 필터링된 주소 요청 목록
  const filteredRequests = addressRequests.filter(request => 
    request.depositor.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold text-gray-800">출금 주소 등록 요청</h1>
          </div>
        </div>
        
        {/* 검색 및 필터 */}
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
            {error}
          </div>
        )}
        
        {/* 로딩 상태 */}
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-pink-500 rounded-full mb-2"></div>
            <p>주소 요청 목록을 불러오는 중...</p>
          </div>
        ) : (
          /* 주소 요청 테이블 */
          <div className="px-6 pb-6">
            {filteredRequests.length === 0 ? (
              <div className="p-6 text-center text-gray-500 border border-gray-100 rounded-lg">
                {searchTerm ? '검색 결과가 없습니다.' : '등록 요청된 주소가 없습니다.'}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">#</th>
                      <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">은행</th>
                      <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">통화</th>
                      <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">주소</th>
                      <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">태그</th>
                      <th className="py-3 px-4 text-middle font-bold text-gray-500 text-sm">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request, index) => (
                      <tr key={request.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-gray-800">{index + 1}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium">
                              {request.depositor.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-800">{request.depositor}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{request.currency}</td>
                        <td className="py-4 px-4 text-gray-600 font-mono">
                          <div className="max-w-xs truncate">
                            {request.address}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 font-mono">{request.tag || '-'}</td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-2">
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
        title="주소 승인 확인"
        targetName={selectedRequest?.depositor || ""}
        targetType="은행"
        actionText="주소 등록 승인"
        customMessage={`"${selectedRequest?.depositor}" 은행의 "${selectedRequest?.currency}" 주소 등록 요청을 승인하시겠습니까?`}
      />
      
      {/* 반려 확인 모달 */}
      <ConfirmationModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        title="주소 반려 확인"
        targetName={selectedRequest?.depositor || ""}
        targetType="은행"
        actionText="주소 등록 반려"
        customMessage={`"${selectedRequest?.depositor}" 은행의 "${selectedRequest?.currency}" 주소 등록 요청을 반려하시겠습니까?`}
      />
    </div>
  )
}