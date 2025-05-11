'use client'
import { AlertTriangle } from "lucide-react"
import type React from "react"

// 확인 모달 Props 인터페이스
interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string // 모달 제목 (기본값: "확인")
  targetName: string // 대상 이름 (사용자명 또는 상품명 등)
  targetType?: string // 대상 유형 (기본값: "항목")
  actionText: string // 수행할 작업 텍스트 (예: "이용정지", "판매정지" 등)
  customMessage?: string // 완전 커스텀 메시지 (지정 시 targetName, targetType, actionText 무시)
}

// 개선된 확인 모달 컴포넌트
export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "확인", 
  targetName,
  targetType = "항목",
  actionText,
  customMessage
}: ConfirmationModalProps) {
  if (!isOpen) return null
  
  // 표시할 메시지 생성
  const message = customMessage || `"${targetName}" ${targetType}을(를) ${actionText}하시겠습니까?`;
  
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
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 max-w-xs" dangerouslySetInnerHTML={{ 
              __html: message.replace(
                /"([^"]+)"/g, '<span class="font-medium text-gray-700">$1</span>'
              ).replace(
                actionText, `<span class="font-medium text-pink-600">${actionText}</span>`
              )
            }} />
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