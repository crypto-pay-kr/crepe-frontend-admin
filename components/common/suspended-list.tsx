"use client"

import { useState } from "react"
import { Search, ArrowLeft, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { ConfirmationModal } from "./confirm-modal";

// 기본 정지 아이템 인터페이스
interface BaseSuspendedItem {
  id: number;
  name: string;
  suspendedDate: string;
}

// 은행 정지 아이템
interface SuspendedBank extends BaseSuspendedItem {
  bankPhoneNum: string;
  totalSupply: number;
}

// 사용자 정지 아이템
interface SuspendedUser extends BaseSuspendedItem {
  suspensionPeriod: string;
  reason: string;
}

// 유니온 타입으로 두 타입을 모두 허용
type SuspendedItem = SuspendedBank | SuspendedUser;

interface SuspendedListProps {
  onBack: () => void;
  type: 'user' | 'bank';
  items: SuspendedItem[];
  onRemoveSuspension?: (id: number) => void;
}

export default function SuspendedList({ 
  onBack, 
  type, 
  items,
  onRemoveSuspension 
}: SuspendedListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  // 타입에 따른 텍스트 설정
  const getTypeText = () => {
    return type === 'user' ? '유저' : '은행';
  }

  const handleReactivateClick = (id: number, name: string) => {
    setSelectedItemId(id);
    setSelectedItemName(name);
    setIsModalOpen(true);
  }
  
  const confirmRemoveSuspension = () => {
    if (selectedItemId !== null && onRemoveSuspension) {
      console.log(`${getTypeText()} 이용정지 해제:`, selectedItemId);
      onRemoveSuspension(selectedItemId);
    }
    setIsModalOpen(false);
    setSelectedItemId(null);
  }

  // 검색어 처리
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 검색어로 아이템 필터링
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 금액 포맷팅 함수
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { 
      style: 'currency', 
      currency: 'KRW',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // 타입 가드 함수들
  const isSuspendedBank = (item: SuspendedItem): item is SuspendedBank => {
    return 'bankPhoneNum' in item && 'totalSupply' in item;
  };

  const isSuspendedUser = (item: SuspendedItem): item is SuspendedUser => {
    return 'suspensionPeriod' in item && 'reason' in item;
  };

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
              >
                <ArrowLeft size={18} className="mr-2" />
                <span className="text-sm font-medium">돌아가기</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">이용정지 {getTypeText()} 리스트</h1>
            </div>
            <div className="text-sm text-gray-500">
              <span className="hover:text-pink-500">{getTypeText()}</span> / <span className="hover:text-pink-500">{getTypeText()}관리</span> / <span className="text-gray-700 font-medium ml-1">이용정지 {getTypeText()} 리스트</span>
            </div>
          </div>

          {/* 검색 */}
          <div className="p-6 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative ml-auto">
                <input
                  type="text"
                  placeholder={`${getTypeText()} 명 검색`}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg w-[300px] focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* 항목 테이블 */}
          <div className="px-6 pb-6">
            {filteredItems.length === 0 ? (
              <div className="p-6 text-center text-gray-500 border border-gray-100 rounded-lg">
                {searchTerm ? '검색 결과가 없습니다.' : `이용정지된 ${getTypeText()}이 없습니다.`}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">#</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">
                        {type === 'bank' ? '은행명' : '유저명'}
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">이용정지 일자</th>
                      {type === 'bank' ? (
                        <>
                          <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">담당 부서 번호</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">예치 자본금</th>
                        </>
                      ) : (
                        <>
                          <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">정지 기간</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">정지 사유</th>
                        </>
                      )}
                      <th className="py-3 px-4 text-center font-medium text-gray-500 text-sm">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-gray-800">{item.id}</td>
                        <td className="py-4 px-4 text-gray-800 font-medium">{item.name}</td>
                        <td className="py-4 px-4 text-gray-600">{item.suspendedDate}</td>
                        {type === 'bank' && isSuspendedBank(item) ? (
                          <>
                            <td className="py-4 px-4 text-gray-600">{item.bankPhoneNum}</td>
                            <td className="py-4 px-4 text-gray-600">{formatCurrency(item.totalSupply)}</td>
                          </>
                        ) : type === 'user' && isSuspendedUser(item) ? (
                          <>
                            <td className="py-4 px-4 text-gray-600">{item.suspensionPeriod}</td>
                            <td className="py-4 px-4 text-gray-600 max-w-xs truncate" title={item.reason}>
                              {item.reason}
                            </td>
                          </>
                        ) : null}
                        <td className="py-4 px-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleReactivateClick(item.id, item.name)}
                              className="px-3 py-1.5 rounded-md text-sm font-medium border border-pink-500 text-pink-500 hover:bg-pink-50 transition-all flex items-center"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              이용정지 해제
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
            <div className="flex flex-col items-center mt-6 gap-4">
              <nav className="flex items-center justify-center gap-1">
                <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors">
                  <ChevronLeft size={18} />
                </button>
                
                <button className="w-9 h-9 flex items-center justify-center rounded-md bg-gradient-to-r from-pink-500 to-rose-400 text-white font-medium">
                  1
                </button>
                
                <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                  2
                </button>
                
                <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* 확인 모달 */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmRemoveSuspension}
        title="이용정지 해제 확인"
        targetName={selectedItemName}
        targetType={getTypeText()}
        actionText="이용정지 해제"
      />
    </div>
  )
}