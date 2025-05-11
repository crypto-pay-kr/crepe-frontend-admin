"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"

// 재정산 확인 모달 컴포넌트
export function ResetSettlementModal({ isOpen, onClose, onConfirm, transactionId }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; transactionId: string }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-xl w-full max-w-sm shadow-xl transform transition-all animate-in zoom-in-95 duration-200"
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="p-5">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">재정산 확인</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              <span className="font-medium text-gray-700">해당 거래</span>를 <span className="font-medium text-red-600">재정산</span> 처리하시겠습니까?
            </p>
            <div className="mt-2 text-xs bg-gray-50 p-2 rounded w-full overflow-hidden">
              <p className="truncate text-gray-600">{transactionId}</p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-5">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-pink-500 text-white rounded-lg font-medium text-sm hover:bg-pink-600 shadow-sm hover:shadow transition-all"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

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
            <div className="flex items-center mb-2">
              <Link href="/merchant" className="flex items-center text-gray-500 hover:text-gray-700">
                <ArrowLeft size={18} className="mr-2" />
                <h1 className="text-xl font-bold">정산 관리</h1>
              </Link>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              <span>가맹점</span> / <span>가맹점 관리</span> / <span>가맹점 아이디</span>
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