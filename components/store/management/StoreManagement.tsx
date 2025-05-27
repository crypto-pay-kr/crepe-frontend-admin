"use client"
import { Search, Bell, ChevronLeft, ChevronRight, Filter, Wallet, BarChart4, CreditCard, Ban, Store } from "lucide-react"
import Link from "next/link"
import {useEffect, useState} from "react"
import SuspensionModal from "@/components/common/suspension-modal"
import {fetchActorsByRole, GetActorInfoResponse} from "@/api/ActorApi";

interface ModernMerchantManagementProps {
  onShowSuspendedList: () => void;
}

export default function ModernMerchantManagement({ onShowSuspendedList }: ModernMerchantManagementProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<{ 
    id: number; 
    storeName: string; 
    username: string; 
    phone: string 
  } | null>(null);
  const [actors, setActors] = useState<GetActorInfoResponse[]>([]);
  const [role, setRole] = useState("SELLER");
  const [page, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const onPageChange = async (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      setPage(newPage);
      
      try {
        const result = await fetchActorsByRole(role, "ACTIVE", newPage);
        setActors(result.content);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const loadActors = async () => {
      try {
        const result = await fetchActorsByRole(role, "ACTIVE", page); // ACTIVE만 조회
        setActors(result.content);
        setTotalPages(result.totalPages);
        setCurrentPage(page);
      } catch (error) {
        console.error(error);
      }
    };

    loadActors();
  }, [role, page]);

  // 가맹점 정지 버튼 클릭 핸들러
  const handleSuspend = (actorId: number, actorName: string, actorEmail: string, actorPhone: string) => {
    setSelectedMerchant({
      id: actorId,
      storeName: actorName, // 가게명으로 사용
      username: actorEmail,
      phone: actorPhone
    });
    setModalOpen(true);
  };

  const handleConfirmSuspension = async (reason: string, period: string) => {
    console.log(`가맹점 ${selectedMerchant?.storeName}(${selectedMerchant?.id})를 ${period}로 정지: ${reason}`);
    setModalOpen(false);
    
    // 정지 후 목록에서 해당 가맹점 즉시 제거
    if (selectedMerchant) {
      setActors(prev => prev.filter(actor => actor.actorId !== selectedMerchant.id));
    }
    
    // 목록 새로고침
    try {
      const result = await fetchActorsByRole(role, "ACTIVE", currentPage);
      setActors(result.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('목록 새로고침 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">가맹점 관리</h1>
            <button className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <Bell size={18} className="text-pink-500" />
              <span className="text-sm font-medium">등록대기 리스트</span>
            </button>
          </div>
        </div>
        
        {/* 검색 및 필터 */}
        <div className="p-6 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="가맹점 아이디 검색"
                className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg w-[300px] focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
                onClick={onShowSuspendedList}
              >
                <Filter size={16} />
                이용정지 가맹점 리스트
              </button>
            </div>
          </div>
        </div>
        
        {/* 가맹점 테이블 */}
        <div className="px-6 pb-6">
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">#</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">가게명</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">가게 아이디</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">휴대폰번호</th>
                  <th className="py-3 px-4 text-middle font-bold text-gray-500 text-sm">관리</th>
                </tr>
              </thead>
              <tbody>
                {actors.map((actor, index) => (
                  <tr key={actor.actorId} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-800">{(currentPage * 10) + index + 1}</td>
                    <td className="py-4 px-4 font-medium text-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium">
                          <Store size={14} />
                        </div>
                        <span className="text-gray-600">{actor.actorName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{actor.actorEmail}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{actor.actorPhoneNum}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-3 py-1.5 rounded-md text-sm font-medium border border-pink-500 text-pink-500 hover:bg-pink-50 transition-all flex items-center cursor-pointer"
                          onClick={() => handleSuspend(
                            actor.actorId, 
                            actor.actorName, 
                            actor.actorEmail, 
                            actor.actorPhoneNum
                          )}
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          가맹점 정지
                        </button>
                        
                        <Link href={`/management/store/wallet/${actor.actorId}`}>
                          <button className="px-3 py-2 rounded-md text-sm font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center cursor-pointer">
                            <Wallet className="w-4 h-4 mr-2" />
                            계좌 관리
                          </button>
                        </Link>
                        
                        <Link href={`/management/store/transfer/${actor.actorId}`}>
                          <button className="px-3 py-2 rounded-md text-sm font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center cursor-pointer">
                            <BarChart4 className="w-4 h-4 mr-2" />
                            이체 내역
                          </button>
                        </Link>
                        
                        <Link href={`/management/store/settlement/${actor.actorId}`}>
                          <button className="px-3 py-2 rounded-md text-sm font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center cursor-pointer">
                            <CreditCard className="w-4 h-4 mr-2" />
                            정산 관리
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center mt-6 gap-4">
              <nav className="flex items-center justify-center gap-1">
                {/* 이전 버튼 */}
                {currentPage > 0 && (
                  <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}

                {/* 페이지 버튼들 */}
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors font-medium ${
                      i === currentPage ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                {/* 다음 버튼 */}
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>

      <SuspensionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmSuspension}
        userName={selectedMerchant?.storeName || ""}
        userId={selectedMerchant?.id || 0}
      />
    </div>
  )
}