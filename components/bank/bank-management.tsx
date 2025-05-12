'use client'
import { Search, ChevronLeft, ChevronRight, Filter, PlusCircle, Ban, CreditCard } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type React from "react"
import { ConfirmationModal } from "../common/confirm-modal"
import AddBankModal from "./add-bank-modal" // AddBankModal 추가

// 은행 데이터 인터페이스 정의
interface Bank {
  id: number;
  name: string;
  depositCapital: string;
  departmentNumber: string;
}

// 은행 추가 데이터 인터페이스
interface BankData {
  id: string;
  password: string;
  passwordConfirm: string;
  bankName: string;
  bankCode: string;
  managerPhone: string;
  bankImage: File | null;
}

// BankManagement 컴포넌트 Props 인터페이스
interface BankManagementProps {
  onShowSuspendedList: () => void;
}

export default function BankManagement({ onShowSuspendedList }: BankManagementProps) {
  // 모달 상태 관리
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  
  // 은행 목록 상태 (실제 구현에서는 API에서 데이터를 가져올 수 있음)
  const [banks, setBanks] = useState<Bank[]>([
    {
      id: 1,
      name: "신한은행",
      depositCapital: "₩50,000,000,000",
      departmentNumber: "02-1234-5678",
    },
    {
      id: 2,
      name: "국민은행",
      depositCapital: "₩45,000,000,000",
      departmentNumber: "02-2345-6789",
    },
    {
      id: 3,
      name: "우리은행",
      depositCapital: "₩40,000,000,000",
      departmentNumber: "02-3456-7890",
    },
    {
      id: 4,
      name: "하나은행",
      depositCapital: "₩38,000,000,000",
      departmentNumber: "02-4567-8901",
    },
    {
      id: 5,
      name: "농협은행",
      depositCapital: "₩35,000,000,000",
      departmentNumber: "02-5678-9012",
    },
    {
      id: 6,
      name: "기업은행",
      depositCapital: "₩30,000,000,000",
      departmentNumber: "02-6789-0123",
    },
    {
      id: 7,
      name: "SC제일은행",
      depositCapital: "₩25,000,000,000",
      departmentNumber: "02-7890-1234",
    },
    {
      id: 8,
      name: "카카오뱅크",
      depositCapital: "₩20,000,000,000",
      departmentNumber: "02-8901-2345",
    },
    {
      id: 9,
      name: "토스뱅크",
      depositCapital: "₩18,000,000,000",
      departmentNumber: "02-9012-3456",
    },
    {
      id: 10,
      name: "케이뱅크",
      depositCapital: "₩15,000,000,000",
      departmentNumber: "02-0123-4567",
    },
  ]);

  // 은행 이용정지 처리
  const handleSuspend = (bank: Bank) => {
    setSelectedBank(bank);
    setConfirmModalOpen(true);
  };

  // 은행 이용정지 확인
  const handleConfirmSuspend = () => {
    if (selectedBank) {
      console.log(`${selectedBank.name} 은행 이용정지 처리`);
      // 실제 구현에서는 API 호출을 통해 이용정지 처리
      
      // 예시로 목록에서 제거
      const updatedBanks = banks.filter(bank => bank.id !== selectedBank.id);
      setBanks(updatedBanks);
    }
    setConfirmModalOpen(false);
    setSelectedBank(null);
  };

  // 은행 추가 모달 열기
  const openAddModal = () => {
    setAddModalOpen(true);
  };

  // 은행 추가 모달 닫기
  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  // 확인 모달 닫기
  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
    setSelectedBank(null);
  };

  // 은행 추가 처리
  const handleAddBank = (bankData: BankData) => {
    console.log("은행 추가:", bankData);
    
    // 새 은행 정보를 목록에 추가
    const newBank: Bank = {
      id: banks.length + 1, // 간단한 ID 부여
      name: bankData.bankName,
      depositCapital: "₩0", // 초기값 설정
      departmentNumber: bankData.managerPhone,
    };
    
    setBanks([...banks, newBank]);
    closeAddModal();
    
    // 실제 구현에서는 여기서 API 호출을 통해 등록 처리할 수 있음
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">은행 관리</h1>
            <button 
              onClick={openAddModal} 
              className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <PlusCircle size={18} className="text-pink-500" />
              <span className="text-sm font-medium">은행 추가</span>
            </button>
          </div>
        </div>
        
        {/* 검색 및 필터 */}
        <div className="p-6 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="은행명 검색"
                className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg w-[300px] focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onShowSuspendedList}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
              >
                <Filter size={16} />
                이용정지 은행 리스트
              </button>
            </div>
          </div>
        </div>
        
        {/* 은행 테이블 */}
        <div className="px-6 pb-6">
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">#</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">은행명</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">예치 자본금</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">담당 부서 번호</th>
                  <th className="py-3 px-4 text-middle font-bold text-gray-500 text-sm">관리</th>
                </tr>
              </thead>
              <tbody>
                {banks.map((bank) => (
                  <tr key={bank.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-800">{bank.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium">
                          {bank.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{bank.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{bank.depositCapital}</td>
                    <td className="py-4 px-4 text-gray-600">{bank.departmentNumber}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-3 py-1.5 rounded-md text-sm font-medium border border-pink-500 text-pink-500 hover:bg-pink-50 transition-all flex items-center cursor-pointer"
                          onClick={() => handleSuspend(bank)}
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          은행 정지
                        </button>
                        
                        {/* 링크에 은행 이름을 쿼리 파라미터로 추가 */}
                        <Link href={`/bank/management/${bank.id}?name=${encodeURIComponent(bank.name)}`}>
                          <button className="px-3 py-2 rounded-md text-sm font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center cursor-pointer">
                            <CreditCard className="w-4 h-4 mr-2" />
                            은행 상세 관리
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

      {/* 은행 추가 모달 */}
      <AddBankModal 
        isOpen={addModalOpen} 
        onClose={closeAddModal} 
        onSubmit={handleAddBank} 
      />

      {/* 은행 정지 확인 모달 */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmSuspend}
        title="이용정지 확인"
        targetName={selectedBank?.name || ""}
        targetType="은행"
        actionText="이용정지"
      />
    </div>
  )
}