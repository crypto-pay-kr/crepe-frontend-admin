"use client"
import { Search, Bell, ChevronLeft, ChevronRight, Filter, Wallet, BarChart4, CreditCard, Ban, Store } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import SuspensionModal from "@/components/common/suspension-modal" // 필요하다면 import

// 가맹점 타입 정의
interface Merchant {
  id: string;
  storeName: string; // 가게명 필드 추가
  username: string;
  phone: string;
}

interface ModernMerchantManagementProps {
  onShowSuspendedList: () => void;
}

export default function ModernMerchantManagement({ onShowSuspendedList }: ModernMerchantManagementProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  
  const handleSuspend = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setModalOpen(true);
  };
  
  const handleConfirmSuspension = (reason: string, period: string) => {
    // 여기서 API 호출 등 실제 이용정지 처리를 구현할 수 있습니다
    console.log(`가맹점 ${selectedMerchant?.storeName}(${selectedMerchant?.id})를 ${period}로 정지: ${reason}`);
    setModalOpen(false);
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
                {merchants.map((merchant) => (
                  <tr key={merchant.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-800">{merchant.id}</td>
                    <td className="py-4 px-4 font-medium text-gray-800">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium">
                            <Store size={14} />
                          </div>
                          <span className="text-gray-600">{merchant.storeName}</span>
                        </div>
                        </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{merchant.username}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{merchant.phone}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-3 py-1.5 rounded-md text-sm font-medium border border-pink-500 text-pink-500 hover:bg-pink-50 transition-all flex items-center cursor-pointer"
                          onClick={() => handleSuspend(merchant)}
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          가맹점 정지
                        </button>
                        
                        <Link href={`/management/store/wallet/${merchant.id}`}>
                          <button className="px-3 py-2 rounded-md text-sm font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center cursor-pointer">
                            <Wallet className="w-4 h-4 mr-2" />
                            계좌 관리
                          </button>
                        </Link>
                        
                        <Link href={`/management/store/transfer/${merchant.id}`}>
                          <button className="px-3 py-2 rounded-md text-sm font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center cursor-pointer">
                            <BarChart4 className="w-4 h-4 mr-2" />
                            이체 내역
                          </button>
                        </Link>
                        
                        <Link href={`/management/store/settlement/${merchant.id}`}>
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
              
              <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                4
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

      {modalOpen && (
        <SuspensionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmSuspension}
          userName={selectedMerchant?.storeName || ""}
        />
      )}
    </div>
  )
}

const merchants: Merchant[] = [
  {
    id: "1",
    storeName: "카페 드립",
    username: "cafe.drip",
    phone: "010-0000-0000",
  },
  {
    id: "2",
    storeName: "맛있는 치킨",
    username: "chicken.delicious",
    phone: "010-0000-0000",
  },
  {
    id: "3",
    storeName: "일품 분식",
    username: "best.foods",
    phone: "010-0000-0000",
  },
  {
    id: "4",
    storeName: "오늘의 샐러드",
    username: "today.salad",
    phone: "010-0000-0000",
  },
  {
    id: "5",
    storeName: "홍콩반점",
    username: "hongkong.chinese",
    phone: "010-0000-0000",
  },
  {
    id: "6",
    storeName: "피자 천국",
    username: "pizza.heaven",
    phone: "010-0000-0000",
  },
  {
    id: "7",
    storeName: "서울 돈까스",
    username: "seoul.pork",
    phone: "010-0000-0000",
  },
  {
    id: "8",
    storeName: "베이커리 카페",
    username: "bakery.cafe",
    phone: "010-0000-0000",
  },
  {
    id: "9",
    storeName: "스시 하우스",
    username: "sushi.house",
    phone: "010-0000-0000",
  },
  {
    id: "10",
    storeName: "한우 명가",
    username: "premium.beef",
    phone: "010-0000-0000",
  },
]