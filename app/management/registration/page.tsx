'use client'

import { ShoppingBag, ChevronLeft, ChevronRight, Search, FileText } from "lucide-react"
import { useState } from "react"
import { ConfirmationModal } from "@/components/common/confirm-modal"

// 등록 데이터 타입 정의
interface RegistrationData {
  depositorName: string;
  userType: string;
  coin: string;
  accountNumber: string;
  accountNumber2: string;
}

export default function RegistrationWaitingList() {
  // 실제 데이터는 API에서 불러올 것이므로 useState로 관리
  const [waitingListItems, setWaitingListItems] = useState(waitingList);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: number; depositorName: string; userType: string } | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  const handleRejectClick = (item: { id: number; depositorName: string; userType: string }) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (selectedItem) {
      console.log(`거절 처리: ${selectedItem.id}`);
      // 여기에 API 호출 등 실제 거절 처리 로직 구현
      setModalOpen(false);
    }
  };

  const handleApprove = (id: number, type: string) => {
    console.log(`승인 처리: ${id}, 타입: ${type}`);
  };

  const handleBulkRegistration = (registrations: RegistrationData[]) => {
    console.log('일괄 등록 처리:', registrations);
    // 여기에 API 호출 등 실제 일괄 등록 처리 로직 구현
    setBulkModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">계좌 등록 대기 리스트</h1>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <ShoppingBag size={18} className="text-pink-500" />
              <span className="text-sm font-medium">신규 정산 계좌 등록 대기: {waitingListItems.length}명</span>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="p-6 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="유저 또는 계좌 검색"
                className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg w-[300px] focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setBulkModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
              >
                <FileText size={16} className="text-pink-500" /> {/* 통장 느낌의 아이콘으로 변경 */}
                한번에 여러 계좌 등록하기 (최대 20명)
              </button>
            </div>
          </div>
        </div>

        {/* 등록 대기 테이블 */}
        <div className="px-6 pb-6">
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">요청 일자</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">입금자 명</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">타입</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">코인</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">계좌번호</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">계좌번호2</th>
                  <th className="py-3 px-4 text-middle font-bold text-gray-500 text-sm">관리</th>
                </tr>
              </thead>
              <tbody>
                {waitingListItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-800">{item.requestDate}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium">
                          {item.depositorName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{item.depositorName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.userType === "가맹점" 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {item.userType}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{item.coin}</td>
                    <td className="py-4 px-4 text-gray-600">{item.accountNumber}</td>
                    <td className="py-4 px-4 text-gray-600">{item.accountNumber2}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleRejectClick({ id: item.id, depositorName: item.depositorName, userType: item.userType })}
                          className="px-3 py-1.5 rounded-md text-sm font-medium border border-pink-500 text-pink-500 hover:bg-pink-50 transition-all flex items-center"
                        >
                          거절하기
                        </button>
                        <button
                          onClick={() => handleApprove(item.id, item.approveType)}
                          className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center"
                        >
                          {item.approveButtonText}
                        </button>
                      </div>
                    </td>
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
              
              <button className="w-9 h-9 flex items-center justify-center rounded-md bg-pink-500 text-white font-medium">
                1
              </button>
              
              <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                2
              </button>
              
              <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                3
              </button>
              
              <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors">
                <ChevronRight size={18} />
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* 확인 모달 */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmReject}
        title="계좌 등록 거절 확인"
        targetName={`${selectedItem?.depositorName || ""} (${selectedItem?.userType || ""})`}
        targetType="등록 요청"
        actionText="거절"
      />

    </div>
  )
}

// 데이터를 컴포넌트 외부로 이동
const waitingList = [
  {
    id: 1,
    requestDate: "2025/01/07",
    depositorName: "홍길동",
    userType: "가맹점",
    coin: "XRP",
    accountNumber: "880912",
    accountNumber2: "010-0000-0000",
    approveType: "release",
    approveButtonText: "해제 완료",
  },
  {
    id: 2,
    requestDate: "2025/01/07",
    depositorName: "홍길동",
    userType: "유저",
    coin: "USDT",
    accountNumber: "880912",
    accountNumber2: "010-0000-0000",
    approveType: "change",
    approveButtonText: "변경 완료",
  },
  {
    id: 3,
    requestDate: "2025/01/07",
    depositorName: "홍길동",
    userType: "유저",
    coin: "아기호랑이",
    accountNumber: "880912",
    accountNumber2: "010-0000-0000",
    approveType: "register",
    approveButtonText: "등록완료",
  },
  {
    id: 4,
    requestDate: "2025/01/07",
    depositorName: "김철수",
    userType: "가맹점",
    coin: "아기호랑이",
    accountNumber: "880912",
    accountNumber2: "010-0000-0000",
    approveType: "register",
    approveButtonText: "등록완료",
  },
  {
    id: 5,
    requestDate: "2025/01/07",
    depositorName: "이영희",
    userType: "유저",
    coin: "아기호랑이",
    accountNumber: "880912",
    accountNumber2: "010-0000-0000",
    approveType: "register",
    approveButtonText: "등록완료",
  },
]