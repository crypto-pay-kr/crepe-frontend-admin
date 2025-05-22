'use client'
import { Search, ChevronLeft, ChevronRight, Filter, PlusCircle, Ban, CreditCard } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import type React from "react"
import { ConfirmationModal } from "../common/confirm-modal"
import AddBankModal from "./add-bank-modal"

// API URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 은행 데이터 인터페이스 수정 (API 응답 형식에 맞게)
interface Bank {
  id: number;
  name: string;
  bankPhoneNum: string;
  totalSupply: number;
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
  
  // API 관련 상태
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);  // 성공 메시지 상태 추가
  const [searchTerm, setSearchTerm] = useState("");

  // 은행 목록 조회 함수
  const fetchBanks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/admin/bank`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 데이터 유효성 검사 및 변환
      const validBanks = Array.isArray(data) ? data.map(bank => ({
        id: bank.id || 0,
        name: bank.name || '이름 없음',
        bankPhoneNum: bank.bankPhoneNum || '-',
        totalSupply: bank.totalSupply || 0
      })) : [];
      
      setBanks(validBanks);
    } catch (err: any) {
      console.error("은행 목록 조회 실패:", err);
      setError(err.message || "은행 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 은행 목록 조회
  useEffect(() => {
    fetchBanks();
  }, []);

  // 은행 이용정지 처리
  const handleSuspend = (bank: Bank) => {
    setSelectedBank(bank);
    setConfirmModalOpen(true);
  };

  // 은행 이용정지 확인 - API 연결 추가
  const handleConfirmSuspend = async () => {
    if (selectedBank) {
      try {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
        }
        
        // 상태 변경 API 호출
        const response = await fetch(`${API_BASE_URL}/api/admin/bank/status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bankId: selectedBank.id,
            bankStatus: 'SUSPENDED' // 정지 상태로 변경
          })
        });
        
        if (!response.ok) {
          // 응답 본문에서 오류 메시지 추출 시도
          let errorMessage;
          try {
            const errorData = await response.text();
            errorMessage = errorData || `API 오류: ${response.status}`;
          } catch {
            errorMessage = `API 오류: ${response.status}`;
          }
          
          throw new Error(errorMessage);
        }
        
        // 성공 시 목록 갱신
        fetchBanks();
        
        // 성공 메시지 표시
        setSuccess(`${selectedBank.name} 은행이 성공적으로 정지되었습니다.`);
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        console.error("은행 이용정지 실패:", err);
        setError(err.message || "은행 이용정지 처리에 실패했습니다.");
        setTimeout(() => setError(null), 5000);
      }
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

  // 은행 추가 성공 시 목록 갱신
  const handleAddBankSuccess = () => {
    fetchBanks();
  };

  // 검색어 처리
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 검색어에 따라 필터링된 은행 목록
  const filteredBanks = banks.filter(bank => 
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 금액 포맷팅 함수
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { 
      style: 'currency', 
      currency: 'KRW',
      maximumFractionDigits: 0 
    }).format(amount);
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
                value={searchTerm}
                onChange={handleSearchChange}
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
        
        {/* 성공 메시지 */}
        {success && (
          <div className="px-6 py-4 my-2 text-green-600 bg-green-50 border border-green-100 rounded-md">
            {success}
          </div>
        )}
        
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
            <p>은행 목록을 불러오는 중...</p>
          </div>
        ) : (
          /* 은행 테이블 */
          <div className="px-6 pb-6">
            {filteredBanks.length === 0 ? (
              <div className="p-6 text-center text-gray-500 border border-gray-100 rounded-lg">
                {searchTerm ? '검색 결과가 없습니다.' : '등록된 은행이 없습니다.'}
              </div>
            ) : (
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
                    {filteredBanks.map((bank) => (
                      <tr key={bank.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-gray-800">{bank.id}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-800">{bank.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{formatCurrency(bank.totalSupply)}</td>
                        <td className="py-4 px-4 text-gray-600">{bank.bankPhoneNum}</td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-2">
                            <button
                              className="px-3 py-1.5 rounded-md text-sm font-medium border border-pink-500 text-pink-500 hover:bg-pink-50 transition-all flex items-center cursor-pointer"
                              onClick={() => handleSuspend(bank)}
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              은행 정지
                            </button>
                            
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
            )}
            
            {/* 페이지네이션 부분은 필요에 따라 구현 */}
          </div>
        )}
      </div>

      {/* 은행 추가 모달 */}
      <AddBankModal 
        isOpen={addModalOpen} 
        onClose={closeAddModal} 
        onSubmit={handleAddBankSuccess} 
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