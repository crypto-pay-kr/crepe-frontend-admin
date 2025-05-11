"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { ResetSettlementModal } from "@/components/common/resettlement-model"

export default function SettlementManagement() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState("")

  const openModal = (transactionId: string) => {
    setSelectedTransactionId(transactionId)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleResettle = () => {
    console.log(`재정산 처리: ${selectedTransactionId}`)
    // 실제 구현에서는 API 호출 등을 통해 재정산 처리
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
                  <Link href="/management/store" className="flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-2">
                    <ArrowLeft size={18} className="mr-2" />
                    <span className="text-sm font-medium">돌아가기</span>
                  </Link>
                  <h1 className="text-2xl font-bold text-gray-800">정산 관리</h1>
                </div>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              <span className="hover:text-pink-500">가맹점</span> 
              / <span className="hover:text-pink-500">가맹점 관리</span> 
              / <span className="text-gray-700 font-medium">가맹점 정산 관리</span>
            </div>
          </div>

          {/* 정산 내역 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left font-medium text-gray-600">코인 종류</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">거래 날짜</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">거래 ID</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">상태</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">거래 금액</th>
                  <th className="py-3 px-4 text-center font-medium text-gray-600">관리</th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((settlement, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-800">{settlement.coinType}</td>
                    <td className="py-4 px-4 text-gray-800">{settlement.date}</td>
                    <td className="py-4 px-4 text-gray-800 max-w-xs truncate">
                      <span title={settlement.transactionId}>{settlement.transactionId}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`${settlement.status.includes("실패") ? "text-red-500" : "text-green-500"}`}>
                        {settlement.status}
                      </div>
                      {settlement.errorCode && <div className="text-sm text-gray-500">{settlement.errorCode}</div>}
                    </td>
                    <td className="py-4 px-4 font-medium">{settlement.amount}</td>
                    <td className="py-4 px-4 text-center">
                      {settlement.status.includes("실패") && (
                        <button
                          onClick={() => openModal(settlement.transactionId)}
                          className="px-4 py-1 rounded-md text-sm border border-red-500 text-red-500 hover:bg-red-50"
                        >
                          재정산
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

      {/* 재정산 확인 모달 */}
      <ResetSettlementModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={handleResettle}
        transactionId={selectedTransactionId}
      />
    </div>
  )
}

const settlements = [
  {
    coinType: "리플",
    date: "2024/12/27",
    transactionId: "olkdjfierjqnkjkdjf3249udnf982k2nelkn",
    status: "입금 실패",
    errorCode: "Error Code: ~~~",
    amount: "10 XRP",
  },
  {
    coinType: "리플",
    date: "2024/12/26",
    transactionId: "olkdjfierjqnkjkdjf3249udnf982k2nelkn",
    status: "입금",
    errorCode: "",
    amount: "10 XRP",
  },
]