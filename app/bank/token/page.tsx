"use client"
import { useState } from "react"
import { Search, ChevronLeft, ChevronRight, X, Check } from "lucide-react"
import RejectionReasonModal from "@/components/token/rejection-reason-modal"
import RequestDetailsModal from "@/components/token/request-details-modal"

export default function BankTokenRequests() {
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedBank, setSelectedBank] = useState("")
  const [selectedRequestType, setSelectedRequestType] = useState("")

  // 상세 보기용 샘플 데이터
  const sampleTokenChanges = [
    {
      symbol: "BTC",
      oldValue: "1.5%",
      newValue: "1.8%",
      status: "+0.3%",
      statusType: "increase" as const
    },
    {
      symbol: "ETH",
      oldValue: "2.1%",
      newValue: "1.9%",
      status: "-0.2%",
      statusType: "decrease" as const
    },
    {
      symbol: "XRP",
      oldValue: "-",
      newValue: "0.8%",
      status: "신규",
      statusType: "new" as const
    }
  ]

  const sampleTokenValues = [
    {
      value: "1 BTC = ₩56,470,000",
      change: "+1.2%",
      changeType: "increase" as const
    },
    {
      value: "1 ETH = ₩3,120,000",
      change: "-0.5%",
      changeType: "decrease" as const
    },
    {
      value: "1 XRP = ₩650",
      change: "+0.8%",
      changeType: "increase" as const
    }
  ]

  const handleReject = (bankName: string, requestType: string) => {
    // 모달 열기 전에 선택된 은행과 요청 종류 저장
    setSelectedBank(bankName)
    setSelectedRequestType(requestType)
    setIsRejectionModalOpen(true)
  }

  const handleConfirmReject = (reason: string) => {
    console.log(`${selectedBank}의 ${selectedRequestType} 반려 처리: ${reason}`)
    // 실제 구현에서는 API 호출 등을 통해 반려 처리
    setIsRejectionModalOpen(false)
  }

  const handleConfirm = (bankName: string, requestType: string) => {
    // 요청 확인 버튼 클릭 시 상세 모달 표시
    setSelectedBank(bankName)
    setSelectedRequestType(requestType)
    setIsDetailsModalOpen(true)
  }

  const handleApproveRequest = () => {
    console.log(`${selectedBank}의 ${selectedRequestType} 승인 처리`)
    // 실제 구현에서는 API 호출 등을 통해 승인 처리
    setIsDetailsModalOpen(false)
  }

  const tokenRequests = [
    {
      bank: "우리은행",
      date: "2024/12/27",
      reason: "가치 유지를 위한 긴급 변경 요청",
      type: "변경 요청",
    },
    {
      bank: "신한은행",
      date: "2024/12/26",
      reason: "토큰 발행을 위한 변경 요청",
      type: "신규 요청",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">은행 토큰 요청 수락</h1>
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
          </div>
        </div>
        
        {/* 토큰 요청 테이블 */}
        <div className="px-6 pb-6">
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">은행</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">요청 날짜</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">사유</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-500 text-sm">요청 종류</th>
                  <th className="py-3 px-4 text-middle font-bold text-gray-500 text-sm">관리</th>
                </tr>
              </thead>
              <tbody>
                {tokenRequests.map((request, index) => (
                  <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium">
                          {request.bank.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{request.bank}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{request.date}</td>
                    <td className="py-4 px-4 text-gray-600">{request.reason}</td>
                    <td className="py-4 px-4 text-gray-600">{request.type}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleReject(request.bank, request.type)}
                          className="px-3 py-1.5 rounded-md text-sm font-medium border border-pink-500 bg-pink-500 text-white hover:bg-pink-600 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <X size={14} /> 반려
                        </button>
                        
                        <button
                          onClick={() => handleConfirm(request.bank, request.type)}
                          className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check size={14} /> 요청 확인
                        </button>
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
              
              <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors">
                <ChevronRight size={18} />
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* 반려 사유 모달 */}
      <RejectionReasonModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        onConfirm={handleConfirmReject}
        targetName={selectedBank}
      />
      
      {/* 요청 상세 모달 */}
      <RequestDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onApprove={handleApproveRequest}
        bankName={selectedBank}
        requestType={selectedRequestType}
        tokenChanges={sampleTokenChanges}
        tokenValues={sampleTokenValues}
      />
    </div>
  )
}