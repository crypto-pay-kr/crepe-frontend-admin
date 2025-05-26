"use client"

import { useEffect, useState } from "react"
import { Search, ArrowLeft, ChevronLeft, ChevronRight, Store } from "lucide-react"
import { ConfirmationModal } from "../../common/confirm-modal";
import { fetchActorsByRole, GetActorInfoResponse } from "@/api/ActorApi";
import { changeActorStatus } from "@/api/adminApi";

interface SuspendedMerchantsListProps {
  onBack: () => void;
}

interface SuspendedMerchant {
  id: number;
  storeName: string;
  username: string;
  phone: string;
  suspendedDate: string;
  suspensionPeriod: string;
  reason: string;
  suspensionEndDate?: string;
}

export default function SuspendedMerchantsList({ onBack }: SuspendedMerchantsListProps) {
  const [selectedMerchants, setSelectedMerchants] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suspendedMerchants, setSuspendedMerchants] = useState<SuspendedMerchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 정지된 가맹점 목록 조회
  const loadSuspendedMerchants = async (pageNum: number = 0) => {
    try {
      setLoading(true);
      const result = await fetchActorsByRole("SELLER", "SUSPENDED", pageNum, 10);
      
      // API 응답을 SuspendedMerchant 형태로 변환
      const transformedMerchants: SuspendedMerchant[] = result.content.map((actor: GetActorInfoResponse) => ({
        id: actor.actorId,
        storeName: actor.actorName,
        username: actor.actorEmail,
        phone: actor.actorPhoneNum,
        suspendedDate: actor.suspensionInfo?.suspendedAt ? 
          new Date(actor.suspensionInfo.suspendedAt).toLocaleDateString('ko-KR') : "미상",
        suspensionPeriod: actor.suspensionInfo?.suspensionPeriod || "정지중",
        reason: actor.suspensionInfo?.reason || "사유 없음",
        suspensionEndDate: actor.suspensionInfo?.suspendedUntil
      }));
      
      setSuspendedMerchants(transformedMerchants);
      setTotalPages(result.totalPages);
      setCurrentPage(pageNum);
    } catch (error) {
      console.error("정지된 가맹점 목록 조회 실패:", error);
      setSuspendedMerchants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuspendedMerchants();
  }, []);

  // 페이지 변경 처리
  const handlePageChange = async (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      await loadSuspendedMerchants(newPage);
    }
  };

  // 검색어로 필터링
  const filteredMerchants = suspendedMerchants.filter(merchant =>
    merchant.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedMerchants([]);
    } else {
      setSelectedMerchants(filteredMerchants.map((merchant) => merchant.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectMerchant = (merchantId: number) => {
    if (selectedMerchants.includes(merchantId)) {
      setSelectedMerchants(selectedMerchants.filter((id) => id !== merchantId));
    } else {
      setSelectedMerchants([...selectedMerchants, merchantId]);
    }
  };

  const handleRemoveSuspension = () => {
    if (selectedMerchants.length > 0) {
      setIsModalOpen(true);
    }
  };
  
  const confirmRemoveSuspension = async () => {
    try {
      // 선택된 가맹점들의 정지를 일괄 해제
      const promises = selectedMerchants.map(merchantId => 
        changeActorStatus({
          actorId: merchantId,
          action: "UNSUSPEND"
        })
      );

      await Promise.all(promises);

      // 성공 시 목록에서 제거
      setSuspendedMerchants(prev => 
        prev.filter(merchant => !selectedMerchants.includes(merchant.id))
      );
      setSelectedMerchants([]);
      setSelectAll(false);

      // 목록 새로고침
      await loadSuspendedMerchants(currentPage);

    } catch (error) {
      console.error("정지 해제 실패:", error);
      alert("정지 해제 중 오류가 발생했습니다.");
    } finally {
      setIsModalOpen(false);
    }
  };

  // 페이지네이션 버튼 렌더링
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors font-medium ${
            i === currentPage 
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          disabled={loading}
        >
          {i + 1}
        </button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">정지된 가맹점 목록을 불러오는 중...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          {/* 헤더 */}
          <div className="p-6 border-b border-gray-100">
            <div className="mb-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-500 hover:text-pink-600 mb-2"
                disabled={loading}
              >
                <ArrowLeft size={18} className="mr-2" />
                <span className="text-sm font-medium">돌아가기</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">이용정지 가맹점 리스트</h1>
            </div>
            <div className="text-sm text-gray-500">
              <span className="hover:text-pink-500">가맹점</span> / <span className="hover:text-pink-500">가맹점관리</span> / <span className="text-gray-700 font-medium ml-1">이용정지 가맹점 리스트</span>
            </div>
          </div>

          {/* 액션 버튼 및 검색 */}
          <div className="p-6 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleRemoveSuspension}
                disabled={selectedMerchants.length === 0 || loading}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium text-white ${
                  selectedMerchants.length > 0 && !loading 
                    ? "bg-gradient-to-r from-pink-500 to-rose-400 hover:shadow active:scale-95" 
                    : "bg-gray-400"
                } transition-all`}
              >
                이용정지 해제 ({selectedMerchants.length})
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="가맹점명 또는 아이디 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg w-[300px] focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                  disabled={loading}
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* 가맹점 테이블 */}
          <div className="px-6 pb-6">
            {filteredMerchants.length === 0 ? (
              <div className="p-6 text-center text-gray-500 border border-gray-100 rounded-lg">
                {searchTerm ? '검색 결과가 없습니다.' : '이용정지된 가맹점이 없습니다.'}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectAll && filteredMerchants.length > 0}
                            onChange={toggleSelectAll}
                            className="mr-2 h-4 w-4 accent-pink-500"
                            disabled={loading}
                          />
                          <span className="font-medium text-gray-500 text-sm">선택</span>
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">가맹점 정보</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">이용정지 일자</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">이용정지 기간</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">이용정지 사유</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMerchants.map((merchant, index) => (
                      <tr key={merchant.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={selectedMerchants.includes(merchant.id)}
                            onChange={() => toggleSelectMerchant(merchant.id)}
                            className="h-4 w-4 accent-pink-500"
                            disabled={loading}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium">
                              <Store size={14} />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{merchant.storeName}</div>
                              <div className="text-xs text-gray-500">{merchant.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{merchant.suspendedDate}</td>
                        <td className="py-4 px-4 text-gray-600">{merchant.suspensionPeriod}</td>
                        <td className="py-4 px-4 text-gray-600 max-w-md truncate" title={merchant.reason}>
                          {merchant.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center mt-6 gap-4">
                <nav className="flex items-center justify-center gap-1">
                  {/* 이전 버튼 */}
                  {currentPage > 0 && (
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
                      disabled={loading}
                    >
                      <ChevronLeft size={18} />
                    </button>
                  )}
                  
                  {/* 페이지 번호 버튼들 */}
                  {renderPaginationButtons()}
                  
                  {/* 다음 버튼 */}
                  {currentPage < totalPages - 1 && (
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
                      disabled={loading}
                    >
                      <ChevronRight size={18} />
                    </button>
                  )}
                </nav>
                
                {/* 페이지 정보 표시 */}
                <div className="text-sm text-gray-500">
                  페이지 {currentPage + 1} / {totalPages}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 확인 모달 */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmRemoveSuspension}
        title="이용정지 해제 확인"
        targetName={`${selectedMerchants.length}개의 가맹점`}
        targetType=""
        actionText="이용정지 해제"
      />
    </div>
  )
}