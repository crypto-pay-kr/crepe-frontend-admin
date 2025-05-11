"use client"

import { X } from "lucide-react"

interface TokenChange {
  symbol: string
  oldValue: string
  newValue: string
  status: string
  statusType: "increase" | "decrease" | "new"
}

interface TokenValue {
  value: string
  change?: string
  changeType?: "increase" | "decrease"
}

interface RequestDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onApprove: () => void
  bankName?: string
  requestType: string
  tokenChanges: TokenChange[]
  tokenValues: TokenValue[]
}

export default function RequestDetailsModal({
  isOpen,
  onClose,
  onApprove,
  bankName,
  requestType,
  tokenChanges,
  tokenValues,
}: RequestDetailsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl w-full max-w-md shadow-xl transform transition-all animate-in zoom-in-95 duration-300"
        style={{
          boxShadow: '0 10px 25px -5px rgba(244, 124, 152, 0.1), 0 8px 10px -6px rgba(244, 124, 152, 0.1)'
        }}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-pink-50 w-8 h-8 rounded-full flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M9 8H15M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="#F47C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">요청 상세</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 내용 */}
        <div className="p-6">
          {bankName && (
            <div className="mb-4 text-sm flex items-center text-gray-500">
              <span className="inline-block w-1.5 h-1.5 bg-pink-400 rounded-full mr-2"></span>
              <span><span className="font-medium text-gray-700">{bankName}</span> 요청 정보입니다</span>
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">요청 정보</label>
            <div className="relative">
              <input
                type="text"
                value={requestType}
                readOnly
                className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">토큰 변경 내역</label>
            <div className="space-y-2">
              {tokenChanges.map((token, index) => (
                <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium mr-2">
                      {token.symbol.charAt(0)}
                    </div>
                    <span className="font-medium">{token.symbol}</span>
                    
                    <div className="ml-auto flex items-center">
                      <span className="text-gray-500">{token.oldValue}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-2">
                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="font-medium">{token.newValue}</span>
                    </div>
                    
                    <span
                      className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                        token.statusType === "increase" || token.statusType === "new" 
                          ? "bg-red-50 text-red-600" 
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {token.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">예상 토큰 가치 (현재 기준)</label>
            <div className="space-y-2">
              {tokenValues.map((value, index) => (
                <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-3 flex items-center">
                  <span className="font-medium">{value.value}</span>
                  {value.change && (
                    <span 
                      className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                        value.changeType === "increase" 
                          ? "bg-red-50 text-red-600" 
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {value.change}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* 버튼 그룹 */}
          <div className="flex gap-3 justify-end pt-2">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              닫기
            </button>
            <button
              onClick={onApprove}
              className="px-5 py-2.5 bg-pink-500 text-white rounded-lg font-medium text-sm shadow-sm hover:bg-pink-600 hover:shadow transition-all flex items-center gap-2"
            >
              <span>승인</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}