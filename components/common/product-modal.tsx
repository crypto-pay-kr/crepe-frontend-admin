"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { ConfirmationModal } from "./confirm-modal"

interface ProductActionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason?: string, action?: 'approve' | 'reject' | 'suspend') => void
  productName: string
  actionType: 'approve' | 'reject' | 'suspend'
}

export default function ProductActionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName,
  actionType
}: ProductActionModalProps) {
  const [reason, setReason] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const getModalConfig = () => {
    switch (actionType) {
      case 'approve':
        return {
          title: "상품 승인",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          iconBg: "bg-green-50",
          placeholder: "승인 사유를 입력해주세요 (선택사항)",
          label: "승인 사유",
          message: "승인",
          buttonColor: "bg-green-500 hover:bg-green-600",
          requireReason: false
        }
      case 'reject':
        return {
          title: "상품 거절",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          iconBg: "bg-red-50",
          placeholder: "거절 사유를 입력해주세요",
          label: "거절 사유",
          message: "거절",
          buttonColor: "bg-red-500 hover:bg-red-600",
          requireReason: true
        }
      case 'suspend':
        return {
          title: "상품 판매정지",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.364 5.636L5.636 18.364M5.636 5.636L18.364 18.364" stroke="#F47C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          iconBg: "bg-pink-50",
          placeholder: "판매정지 사유를 입력해주세요",
          label: "판매정지 사유",
          message: "판매정지",
          buttonColor: "bg-pink-500 hover:bg-pink-600",
          requireReason: true
        }
      default:
        return {
          title: "상품 처리",
          icon: null,
          iconBg: "bg-gray-50",
          placeholder: "사유를 입력해주세요",
          label: "처리 사유",
          message: "처리",
          buttonColor: "bg-gray-500 hover:bg-gray-600",
          requireReason: true
        }
    }
  }

  const config = getModalConfig()
  
  const handlePrimaryAction = () => {
    if (!config.requireReason || reason.trim()) {
      setShowConfirmation(true)
    }
  }
  
  const handleFinalConfirm = () => {
    onConfirm(reason || undefined, actionType)
    setShowConfirmation(false)
    setReason("") // 완료 후 초기화
  }
  
  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
  }

  const handleClose = () => {
    setReason("") // 모달 닫을 때 초기화
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl w-full max-w-md shadow-xl transform transition-all animate-in zoom-in-95 duration-300"
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`${config.iconBg} w-8 h-8 rounded-full flex items-center justify-center`}>
              {config.icon}
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{config.title}</h2>
          </div>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 내용 */}
        <div className="p-6">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.label}
              {!config.requireReason && <span className="text-gray-400 ml-1">(선택사항)</span>}
            </label>
            <div className="relative">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-3 pt-4 h-28 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 focus:outline-none transition-all resize-none"
                placeholder={config.placeholder}
                maxLength={200}
              />
              <div className="absolute bottom-3 right-3 flex items-center text-xs text-gray-400">
                <span>{reason.length}</span>
                <span className="mx-1">/</span>
                <span>200</span>
              </div>
            </div>
            {productName && (
              <div className="mt-2 text-sm flex items-center text-gray-500">
                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                <span><span className="font-medium text-gray-700">{productName}</span> 상품에 대한 {config.message}입니다</span>
              </div>
            )}
          </div>
          
          {/* 버튼 그룹 */}
          <div className="flex gap-3 justify-end pt-2">
            <button 
              onClick={handleClose} 
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handlePrimaryAction}
              className={`px-5 py-2.5 text-white rounded-lg font-medium text-sm shadow-sm transition-all flex items-center gap-2 ${
                config.requireReason && !reason.trim() 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : config.buttonColor
              }`}
              disabled={config.requireReason && !reason.trim()}
            >
              <span>확인</span>
              {(!config.requireReason || reason.trim()) && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* 재확인 모달 컴포넌트 사용 */}
      <ConfirmationModal 
        isOpen={showConfirmation}
        onClose={handleCancelConfirmation}
        onConfirm={handleFinalConfirm}
        title={`${config.message} 확인`}
        targetName={productName}
        targetType="상품"
        actionText={config.message}
        customMessage={`"${productName}" 상품을 ${config.message}하시겠습니까?`}
      />
    </div>
  )
}