'use client'
import { useParams, useSearchParams } from "next/navigation"
import AccountInfoComponent from "@/components/common/account/AccountInfo"
import { useState, useEffect } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 백엔드 응답 타입 정의
interface BankAccountResponse {
  bankName: string;
  coinName: string;
  currency: string;
  accountAddress: string | null;
  tag: string | null;
  balance: string;
  status: string;
}
interface AccountInfo {
  coinName: string;
  currency: string;
  depositorName: string;
  coinAccount: string;
  tagAccount?: string;
  balance: {
    fiat: string;
    crypto: string;
  };
  status: 'APPROVED' | 'ACTIVE' | 'REGISTERING' | 'REJECTED' | 'NOT_REGISTERED' | string; 
}

export default function BankWallet() {
  // URL 파라미터에서 은행 ID 가져오기
  const params = useParams();
  const bankId = params.id;

  // URL 쿼리 파라미터에서 은행 이름 가져오기
  const searchParams = useSearchParams();
  const bankName = searchParams.get('name') || "은행";

  // 계좌 정보 상태
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 계좌 정보 조회
  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        
        if (!token) {
          throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
        }
        
        const response = await fetch(`${API_BASE_URL}/api/admin/bank/account/${bankId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API 오류: ${response.status}`);
        }
        
        const data: BankAccountResponse[] = await response.json();
        
        // 데이터 변환 (currency 필드 추가)
        const formattedAccounts = data.map(account => ({
          coinName: account.coinName,
          currency: account.currency, // currency 필드 추가
          depositorName: account.bankName,
          coinAccount: account.accountAddress || "-",
          tagAccount: account.tag || undefined,
          balance: {
            fiat: "0 KRW", // 필요하다면 환율 적용하여 계산
            crypto: `${account.balance} ${account.currency}`
          },
          status: account.status
        }));
        console.log("은행 계좌 정보 조회 성공:", formattedAccounts);
        setAccounts(formattedAccounts);
      } catch (err: any) {
        console.error("은행 계좌 정보 조회 실패:", err);
        setError(err.message || "은행 계좌 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBankAccounts();
  }, [bankId]);

  // 은행용 계좌 연결 해제 처리
  const handleDisconnectBankAccount = async (accountId: string, coinName: string) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }
      
      // 계좌 연결 해제 API 호출 (이 부분은 실제 API에 맞게 수정 필요)
      const response = await fetch(`${API_BASE_URL}/api/admin/bank/account/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bankId: bankId,
          accountAddress: accountId,
          coinName: coinName
        })
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
      
      // 성공 시 계좌 목록 갱신
      const updatedAccounts = accounts.filter(account => 
        !(account.coinName === coinName && account.coinAccount === accountId)
      );
      
      setAccounts(updatedAccounts);
      
    } catch (err: any) {
      console.error(`${bankName} ${coinName} 계좌 연결 해제 실패:`, err);
      alert(`계좌 연결 해제에 실패했습니다: ${err.message}`);
    }
  };

  // 수정된 AccountInfoComponent 컴포넌트 사용
  return (
    <>
      {loading ? (
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-pink-500 rounded-full mb-4"></div>
            <p className="text-gray-600">계좌 정보를 불러오는 중...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-lg w-full text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">오류 발생</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      ) : (
        <AccountInfoComponent
          title={`${bankName} 계좌 정보`}
          backPath={`/bank/management/${bankId}?name=${encodeURIComponent(bankName)}`}
          accounts={accounts}
          onDisconnect={handleDisconnectBankAccount}
        />
      )}
    </>
  );
}