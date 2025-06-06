"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DisconnectConfirmModal } from "../disconnect-modal"
import {useEffect, useState} from "react"
import {fetchAccountInfo} from "@/api/accountApi";
import { useParams } from 'next/navigation'
// 계좌 정보 타입 정의
interface AccountBalance {
  fiat: string;
  crypto: string;
}

interface AccountInfo {
  coinName: string;
  currency: string; // currency 필드 추가
  depositorName: string;
  coinAccount: string;
  tagAccount?: string;
  balance: AccountBalance;
  status: string;
}
export interface GetAccountInfoResponse {
  coinName: string;
  currency: string;
  address: string;
  tag: string;
  balance: string;
  registryStatus: string;
}
interface AccountInfoProps {
  title?: string;
  backPath?: string;
  accounts?: AccountInfo[];
  onDisconnect?: (accountId: string, coinName: string) => void;
}

export default function AccountInfoComponent({
  title = "계좌 정보",
  backPath = "/management/user",
  onDisconnect = (accountId: string) => console.log(`${accountId} 계좌 연결 해제`)
}: AccountInfoProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<AccountInfo | null>(null)
  const {id} = useParams();
  const [accounts, setAccounts] = useState<GetAccountInfoResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {

    const loadAccounts = async () => {
      try {

        const data = await fetchAccountInfo(Number(id), page, 10);
        setAccounts(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("불러오기 실패:", err);
      }
    };

    loadAccounts();
  }, [id, page]);




  const openModal = (account: AccountInfo) => {
    setSelectedAccount(account)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleDisconnectConfirm = () => {
    if (selectedAccount) {
      onDisconnect(selectedAccount.coinAccount, selectedAccount.coinName)
    }
    closeModal()
  }

  // 상태에 따른 스타일과 텍스트 반환 함수
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">승인됨</span>;
      case 'REGISTERING':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">등록 대기중</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">반려됨</span>;
      case 'NOT_REGISTERED':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">미등록</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-8 overflow-auto bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* 헤더 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Link 
                  href={backPath} 
                  className="flex items-center text-gray-600 hover:text-pink-500 transition-colors mb-2"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  <span className="text-sm font-medium">돌아가기</span>
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              </div>
            </div>
          </div>

          {/* 계좌 정보 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-gray-600">코인 종류</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">계좌 주소</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">태그</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">잔액</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">상태</th>
                <th className="py-3 px-4 text-center font-medium text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-800">
                    {account.coinName} {account.currency && `(${account.currency})`}
                  </td>
                  <td className="py-4 px-4 text-gray-800 max-w-xs truncate font-mono">
                    {account.address === "-" ? (
                      <span className="text-gray-400">미등록</span>
                    ) : (
                      <span title={account.address}>{account.address}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-800 font-mono">{account.tag || "-"}</td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">{account.balance}</div>
                    {account.balance !== "0 KRW" && (
                      <div className="text-xs text-gray-500">{account.balance}</div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(account.registryStatus)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {account.address !== "-" && account.registryStatus === 'ACTIVE' && (
                      <button
                        // onClick={() => openModal(account)}
                        className="px-4 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50"
                      >
                        연결 해제
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 연결 해제 확인 모달 */}
      {selectedAccount && (
        <DisconnectConfirmModal
          isOpen={modalOpen}
          onClose={closeModal}
          onConfirm={handleDisconnectConfirm}
          accountInfo={selectedAccount}
        />
      )}
    </div>
  )
}