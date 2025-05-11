"use client"

import { useState } from "react"
import { Search, ArrowLeft, ChevronLeft, ChevronRight, AlertTriangle, Store } from "lucide-react"
import { ConfirmationModal } from "../../common/confirm-modal";

interface SuspendedMerchantsListProps {
  onBack: () => void;
}

export default function SuspendedMerchantsList({ onBack }: SuspendedMerchantsListProps) {
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedMerchants([])
    } else {
      setSelectedMerchants(suspendedMerchants.map((merchant) => merchant.id))
    }
    setSelectAll(!selectAll)
  }

  const toggleSelectMerchant = (merchantId: string) => {
    if (selectedMerchants.includes(merchantId)) {
      setSelectedMerchants(selectedMerchants.filter((id) => id !== merchantId))
    } else {
      setSelectedMerchants([...selectedMerchants, merchantId])
    }
  }

  const handleRemoveSuspension = () => {
    if (selectedMerchants.length > 0) {
      setIsModalOpen(true)
    }
  }
  
  const confirmRemoveSuspension = () => {
    console.log("이용정지 해제:", selectedMerchants)
    // 실제 구현에서는 API 호출 등을 통해 이용정지 해제 처리
    setIsModalOpen(false)
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
                disabled={selectedMerchants.length === 0}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium text-white ${
                  selectedMerchants.length > 0 ? "bg-gradient-to-r from-pink-500 to-rose-400 hover:shadow active:scale-95" : "bg-gray-400"
                } transition-all`}
              >
                이용정지 해제
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="가맹점 아이디 검색"
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg w-[300px] focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* 가맹점 테이블 */}
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
                    <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">가맹점 정보</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">이용정지 일자</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">이용정지 기간</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">이용정지 사유</th>
                  </tr>
                </thead>
                <tbody>
                  {suspendedMerchants.map((merchant) => (
                    <tr key={merchant.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedMerchants.includes(merchant.id)}
                          onChange={() => toggleSelectMerchant(merchant.id)}
                          className="h-4 w-4 accent-pink-500"
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
                      <td className="py-4 px-4 text-gray-600 max-w-md truncate">{merchant.reason}</td>
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

const suspendedMerchants = [
  {
    id: "0001",
    storeName: "카페 드립",
    username: "cafe.drip",
    suspendedDate: "2025/01/05",
    suspensionPeriod: "14일 이용정지",
    reason: "서비스 이용약관 위반 - 부적절한 상품 정보 등록",
  },
  {
    id: "0002",
    storeName: "맛있는 치킨",
    username: "chicken.delicious",
    suspendedDate: "2025/01/07",
    suspensionPeriod: "7일 이용정지",
    reason: "고객 불만 신고 누적 - 위생 관리 미흡",
  },
  {
    id: "0003",
    storeName: "일품 분식",
    username: "best.foods",
    suspendedDate: "2025/01/06",
    suspensionPeriod: "30일 이용정지",
    reason: "결제 시스템 악용 - 부정 환불 요청 다수",
  },
  {
    id: "0004",
    storeName: "오늘의 샐러드",
    username: "today.salad",
    suspendedDate: "2025/01/08",
    suspensionPeriod: "7일 이용정지",
    reason: "서비스 이용약관 위반 - 개인정보 요구",
  },
  {
    id: "0005",
    storeName: "홍콩반점",
    username: "hongkong.chinese",
    suspendedDate: "2025/01/04",
    suspensionPeriod: "14일 이용정지",
    reason: "배달 지연 누적 - 서비스 품질 저하",
  },
  {
    id: "0006",
    storeName: "피자 천국",
    username: "pizza.heaven",
    suspendedDate: "2025/01/09",
    suspensionPeriod: "7일 이용정지",
    reason: "고객 불만 신고 누적 - 주문 취소 지연",
  },
  {
    id: "0007",
    storeName: "서울 돈까스",
    username: "seoul.pork",
    suspendedDate: "2025/01/05",
    suspensionPeriod: "14일 이용정지",
    reason: "서비스 이용약관 위반 - 부적절한 홍보 활동",
  },
  {
    id: "0008",
    storeName: "베이커리 카페",
    username: "bakery.cafe",
    suspendedDate: "2025/01/10",
    suspensionPeriod: "7일 이용정지",
    reason: "결제 관련 문제 - 중복 결제 유도",
  },
  {
    id: "0009",
    storeName: "스시 하우스",
    username: "sushi.house",
    suspendedDate: "2025/01/03",
    suspensionPeriod: "30일 이용정지",
    reason: "서비스 이용약관 위반 - 위조 인증 정보 제공",
  },
  {
    id: "0010",
    storeName: "한우 명가",
    username: "premium.beef",
    suspendedDate: "2025/01/08",
    suspensionPeriod: "14일 이용정지",
    reason: "고객 개인정보 유출 - 마케팅 목적 무단 활용",
  },
]