"use client"

import { useState } from "react"
import { Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { ConfirmationModal } from "./confirm-modal";
// 기존 모달 대신 개선된 모달 import

// 정지된 항목(유저 또는 은행) 타입
interface SuspendedItem {
  id: number;
  name: string;  // 유저명 또는 은행명
  suspendedDate: string;
  suspensionPeriod: string;
  reason: string;
}

interface SuspendedListProps {
  onBack: () => void;
  type: 'user' | 'bank';  // 유저 또는 은행 타입
  items: SuspendedItem[];  // 정지된 항목 목록
  onRemoveSuspension?: (ids: number[]) => void;  // 정지 해제 콜백 (옵션)
}

export default function SuspendedList({ 
  onBack, 
  type, 
  items,
  onRemoveSuspension 
}: SuspendedListProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 타입에 따른 텍스트 설정
  const getTypeText = () => {
    return type === 'user' ? '유저' : '은행';
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  const toggleSelectItem = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  const handleRemoveSuspension = () => {
    if (selectedItems.length > 0) {
      setIsModalOpen(true)
    }
  }
  
  const confirmRemoveSuspension = () => {
    console.log(`${getTypeText()} 이용정지 해제:`, selectedItems)
    // 실제 구현에서는 API 호출 등을 통해 이용정지 해제 처리
    if (onRemoveSuspension) {
      onRemoveSuspension(selectedItems);
    }
    setIsModalOpen(false)
    setSelectedItems([]);
    setSelectAll(false);
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

          {/* 액션 버튼 및 검색 */}
          <div className="p-6 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleRemoveSuspension}
                disabled={selectedItems.length === 0}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium text-white ${
                  selectedItems.length > 0 ? "bg-gradient-to-r from-pink-500 to-rose-400 hover:shadow active:scale-95" : "bg-gray-400"
                } transition-all`}
              >
                이용정지 해제
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`${getTypeText()} ${type === 'user' ? '아이디' : '명'} 검색`}
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg w-[300px] focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* 항목 테이블 */}
          <div className="px-6 pb-6">
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                          className="mr-2 h-4 w-4 accent-pink-500"
                        />
                        <span className="font-medium text-gray-500 text-sm">선택</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">
                      {type === 'user' ? '아이디' : '은행명'}
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">이용정지 일자</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">이용정지 기간</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">이용정지 사유</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="h-4 w-4 accent-pink-500"
                        />
                      </td>
                      <td className="py-4 px-4 text-gray-800">{item.name}</td>
                      <td className="py-4 px-4 text-gray-600">{item.suspendedDate}</td>
                      <td className="py-4 px-4 text-gray-600">{item.suspensionPeriod}</td>
                      <td className="py-4 px-4 text-gray-600 max-w-md truncate">{item.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
                
                <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                  3
                </button>
                
                <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                  ...
                </button>
                
                <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                  5
                </button>
                
                <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* 개선된 확인 모달 */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmRemoveSuspension}
        title="이용정지 해제 확인"
        targetName={`${selectedItems.length}개의 ${getTypeText()}`}
        targetType=""
        actionText="이용정지 해제"
      />
      
    </div>
  )
}