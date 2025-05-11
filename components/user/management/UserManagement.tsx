'use client'
import SuspensionModal from "@/components/common/suspension-modal";
import { User, Search, ChevronLeft, ChevronRight, Filter,Wallet,BarChart4,CreditCard,Ban} from "lucide-react"
import Link from "next/link";
import { useState } from "react"

interface ModernUserManagementProps {
  onShowSuspendedList: () => void;
}

export default function ModernUserManagement({ onShowSuspendedList }: ModernUserManagementProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: number; nickname: string; username: string; phone: string } | null>(null);
  
  const handleSuspend = (user: { id: number; nickname: string; username: string; phone: string }) => {
    setSelectedUser(user);
    setModalOpen(true);
  };
  
  const handleConfirmSuspension = (reason: string, period: string) => {
    // 여기서 API 호출 등 실제 이용정지 처리를 구현할 수 있습니다
    console.log(`사용자 ${selectedUser?.nickname}(${selectedUser?.username})를 ${period}로 정지: ${reason}`);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">유저 관리</h1>
            <button className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <User size={18} className="text-pink-500" />
              <span className="text-sm font-medium">유저 정보 프로모션</span>
            </button>
          </div>
        </div>
        
        {/* 검색 및 필터 */}
        <div className="p-6 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="유저 아이디 검색"
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
                이용정지 유저 리스트
              </button>
            </div>
          </div>
        </div>
        
        {/* 유저 테이블 */}
        <div className="px-6 pb-6">
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">#</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">닉네임</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">아이디</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">휴대폰번호</th>
                  <th className="py-3 px-4 text-middle font-bold text-gray-500 text-sm">관리</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-800">{user.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium">
                          {user.nickname.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{user.nickname}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{user.username}</td>
                    <td className="py-4 px-4 text-gray-600">{user.phone}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                      <button
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center ${
                          user.id === 10 
                            ? "bg-pink-100 text-pink-600 cursor-not-allowed" 
                            : "border border-pink-500 text-pink-500 hover:bg-pink-50 cursor-pointer"
                        }`}
                        onClick={() => user.id !== 10 && handleSuspend(user)}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        {user.id === 10 ? "정지 상태" : "이용정지"}
                      </button>

                      <Link href={`/management/user/wallet/${user.id}`}>
                        <button className="px-3 py-2 rounded-md text-sm font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center cursor-pointer">
                          <Wallet className="w-4 h-4 mr-2" />
                          계좌 관리
                        </button>
                    </Link>
                    
                      <Link href={`/management/user/transfer/${user.id}`}>
                        <button className="px-3 py-2 rounded-md text-sm font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center cursor-pointer">
                          <BarChart4 className="w-4 h-4 mr-2" />
                          이체 내역
                        </button>
                      </Link>

                      {/* 결제 내역 버튼 - 보라색 */}
                      <Link href={`/management/user/payment/${user.id}`}>
                        <button className="px-3 py-2 rounded-md text-sm font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center cursor-pointer">
                          <CreditCard className="w-4 h-4 mr-2" />
                          결제 내역
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
        <SuspensionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmSuspension}
        userName={selectedUser?.username || ""}
      />
    </div>
  )
}

const users = [
  {
    id: 1,
    nickname: "Alyvia Kelley",
    username: "a.kelley9999",
    phone: "010-0000-0000",
  },
  {
    id: 2,
    nickname: "Jaiden Nixon",
    username: "jaiden.n9999",
    phone: "010-0000-0000",
  },
  {
    id: 3,
    nickname: "Ace Foley",
    username: "ace.fo",
    phone: "010-0000-0000",
  },
  {
    id: 4,
    nickname: "Nikolai Schmidt",
    username: "nikolai.schmidt1964",
    phone: "010-0000-0000",
  },
  {
    id: 5,
    nickname: "Clayton Charles",
    username: "me@clayton",
    phone: "010-0000-0000",
  },
  {
    id: 6,
    nickname: "Prince Chen",
    username: "prince.chen1997",
    phone: "010-0000-0000",
  },
  {
    id: 7,
    nickname: "Reece Duran",
    username: "reece",
    phone: "010-0000-0000",
  },
  {
    id: 8,
    nickname: "Anastasia Mcdaniel",
    username: "anastasia.sprin",
    phone: "010-0000-0000",
  },
  {
    id: 9,
    nickname: "Melvin Boyle",
    username: "Me.boyle",
    phone: "010-0000-0000",
  },
  {
    id: 10,
    nickname: "Kailee Thomas",
    username: "Kailee.thomas",
    phone: "010-0000-0000",
  },
]