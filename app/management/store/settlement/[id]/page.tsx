"use client"

import Link from "next/link"
import {ArrowLeft, ChevronLeft, ChevronRight} from "lucide-react"
import {useEffect, useState} from "react"
import { ResetSettlementModal } from "@/components/common/resettlement-model"
import {fetchSettlementHistories, requestReSettlement, Settlement} from "@/api/payHistoryApi";
;
import {useParams} from "next/navigation";


export default function SettlementManagement() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState(Number)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [settlement, setSettlements] = useState<Settlement[]>([]);
  const {id}= useParams();

  const openModal = (transactionId: number) => {
    setSelectedTransactionId(transactionId)
    setModalOpen(true)
  }

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };
  useEffect(() => {
    if (!id) return;
    fetchSettlementHistories(Number(id), currentPage, 10, "all")
        .then(data => {
          setSettlements(data.content)
          setTotalPages(data.totalPages)
        })
        .catch(err => console.error(err))
  }, [id, currentPage])


  const closeModal = () => {
    setModalOpen(false)
  }

  const handleResettle = async () => {
    try {
      await requestReSettlement(Number(selectedTransactionId));
      closeModal()
    } catch (error) {
      console.error("재정산 실패:", error);
      alert("재정산 중 오류가 발생했습니다.");
    }
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
                  <th className="py-3 px-4 text-left font-medium text-gray-600">상태</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">거래 금액</th>
                  <th className="py-3 px-4 text-center font-medium text-gray-600">관리</th>
                </tr>
              </thead>
              <tbody>
                {settlement.map((settlement, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-800">{settlement.currency}</td>
                    <td className="py-4 px-4 text-gray-800">{new Date(settlement.date).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })}</td>
                    <td className="py-4 px-4">
                      <div className={`${settlement.status.includes("PENDING") ? "text-red-500" : "text-green-500"}`}>
                        {settlement.status}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">{settlement.amount}</td>
                    <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => openModal(settlement.id)}
                          className="px-4 py-1 rounded-md text-sm border border-red-500 text-red-500 hover:bg-red-50"
                        >
                          재정산
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 페이지네이션 */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              총 <span className="font-medium text-gray-700">{totalPages}</span> 페이지 중 <span
                className="font-medium text-gray-700">{currentPage + 1}</span> 페이지
            </div>
            <div className="flex items-center space-x-1">
              <button
                  onClick={() => goToPage(currentPage - 1)}
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50"
                  disabled={currentPage === 0}
              >
                <ChevronLeft size={18}/>
              </button>

              {[...Array(totalPages)].map((_, i) => (
                  <button
                      key={i}
                      onClick={() => goToPage(i)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center font-medium ${
                          i === currentPage
                              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    {i + 1}
                  </button>
              ))}

              <button
                  onClick={() => goToPage(currentPage + 1)}
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50"
                  disabled={currentPage === totalPages - 1}
              >
                <ChevronRight size={18}/>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 재정산 확인 모달 */}
      <ResetSettlementModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={handleResettle}

      />
    </div>
  )
}


