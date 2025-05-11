"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DisconnectConfirmModal } from "../disconnect-modal"
import { useState } from "react"

// 계좌 정보 타입 정의
interface AccountBalance {
  fiat: string;
  crypto: string;
}

interface AccountInfo {
  coinName: string;
  depositorName: string;
  coinAccount: string;
  tagAccount?: string;
  balance: AccountBalance;
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
  accounts = [],
  onDisconnect = (accountId: string) => console.log(`${accountId} 계좌 연결 해제`)
}: AccountInfoProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<AccountInfo | null>(null)

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
                  <th className="py-3 px-4 text-left font-medium text-gray-600">코인 명</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">입금자 명</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">코인 계좌</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">Tag 계좌</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">balance</th>
                  <th className="py-3 px-4 text-center font-medium text-gray-600">관리</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-800">{account.coinName}</td>
                    <td className="py-4 px-4 text-gray-800">{account.depositorName}</td>
                    <td className="py-4 px-4 text-gray-800 max-w-xs truncate">
                      <span title={account.coinAccount}>{account.coinAccount}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-800">{account.tagAccount || "-"}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium">{account.balance.fiat}</div>
                      <div className="text-sm text-gray-500">{account.balance.crypto}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => openModal(account)}
                        className="px-4 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50"
                      >
                        연결 해제
                      </button>
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