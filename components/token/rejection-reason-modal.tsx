"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface RejectionReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  targetName?: string
}

export default function RejectionReasonModal({ isOpen, onClose, onConfirm, targetName }: RejectionReasonModalProps) {
  const [reason, setReason] = useState("")
  
  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason)
      setReason("")
    }
  }

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
                <path d="M12 15V9M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#F47C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">반려 사유</h2>
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
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">반려 사유</label>
            <div className="relative">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-3 pt-4 h-28 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 focus:outline-none transition-all resize-none"
                placeholder="반려 사유를 입력해주세요"
              />
              <div className="absolute bottom-3 right-3 flex items-center text-xs text-gray-400">
                <span>{reason.length}</span>
                <span className="mx-1">/</span>
                <span>200</span>
              </div>
            </div>
            {targetName && (
              <div className="mt-2 text-sm flex items-center text-gray-500">
                <span className="inline-block w-1.5 h-1.5 bg-pink-400 rounded-full mr-2"></span>
                <span><span className="font-medium text-gray-700">{targetName}</span> 님에 대한 반려입니다</span>
              </div>
            )}
          </div>
          
          {/* 버튼 그룹 */}
          <div className="flex gap-3 justify-end pt-2">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className={`px-5 py-2.5 text-white rounded-lg font-medium text-sm shadow-sm transition-all flex items-center gap-2 ${
                !reason.trim() 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-pink-500 hover:bg-pink-600 hover:shadow"
              }`}
              disabled={!reason.trim()}
            >
              <span>확인</span>
              {!reason.trim() ? null : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}