"use client"

import { useState, useEffect } from "react";
import SuspendedList from "../common/suspended-list";

// API URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 정지된 은행 타입 정의
interface SuspendedBank {
  id: number;
  name: string;
  suspendedDate: string;
  bankPhoneNum: string;
  totalSupply: number;
}

interface SuspendedBanksListProps {
  onBack: () => void;
}

export default function SuspendedBanksList({ onBack }: SuspendedBanksListProps) {
  const [suspendedBanks, setSuspendedBanks] = useState<SuspendedBank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 정지된 은행 목록 조회
  const fetchSuspendedBanks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = sessionStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }
      
      // 정지된 은행 목록 조회 API 호출
      const response = await fetch(`${API_BASE_URL}/api/admin/bank/suspend`, {
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
      const validBanks: SuspendedBank[] = Array.isArray(data) ? data.map(bank => ({
        id: bank.id || 0,
        name: bank.name || '이름 없음',
        suspendedDate: bank.suspendedDate ? new Date(bank.suspendedDate).toLocaleDateString('ko-KR') : '-',
        bankPhoneNum: bank.bankPhoneNum || '-',
        totalSupply: bank.totalSupply || 0
      })) : [];
      
      setSuspendedBanks(validBanks);
    } catch (err: any) {
      console.error("이용정지 은행 목록 조회 실패:", err);
      setError(err.message || "이용정지 은행 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 이용정지 은행 목록 조회
  useEffect(() => {
    fetchSuspendedBanks();
  }, []);

  // 은행 이용정지 해제 처리
  const handleRemoveSuspension = async (id: number) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }
      
      // 은행 상태 변경 API 호출
      const response = await fetch(`${API_BASE_URL}/api/admin/bank/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bankId: id,
          bankStatus: 'ACTIVE' // 활성화 상태로 변경
        })
      });
      
      if (!response.ok) {
        // 응답 본문에서 오류 메시지 추출 시도
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `API 오류: ${response.status}`;
        } catch {
          errorMessage = `API 오류: ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }
      
      // 성공 시 목록 갱신
      fetchSuspendedBanks();
      
      // 성공 메시지 표시
      setSuccess(`은행 이용정지가 성공적으로 해제되었습니다.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("은행 이용정지 해제 실패:", err);
      setError(err.message || "은행 이용정지 해제 처리에 실패했습니다.");
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-pink-500 rounded-full mb-2"></div>
          <p className="text-gray-500">이용정지 은행 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-sm max-w-md w-full">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">오류 발생</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchSuspendedBanks}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
            >
              다시 시도
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 ml-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 성공 메시지가 있는 경우 추가
  const successMessage = success ? (
    <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 rounded-md">
      {success}
    </div>
  ) : null;

  return (
    <>
      {successMessage}
      <SuspendedList
        onBack={onBack}
        type="bank"
        items={suspendedBanks}
        onRemoveSuspension={handleRemoveSuspension}
      />
    </>
  );
}