"use client"
import { X } from "lucide-react"

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: number
    productName: string
    type: string
    bank: string
    deposit: string
    members: string
    benefit: string
    status: string
  } | null
}

export default function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  if (!isOpen || !product) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "승인":
        return "bg-green-50 text-green-600"
      case "심사 중":
        return "bg-yellow-50 text-yellow-600"
      case "승인 중":
        return "bg-blue-50 text-blue-600"
      case "거절":
        return "bg-red-50 text-red-600"
      default:
        return "bg-gray-50 text-gray-600"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div 
        className="bg-white rounded-xl w-full max-w-md max-h-[90vh] shadow-xl transform transition-all animate-in zoom-in-95 duration-300 flex flex-col"
        style={{
          boxShadow: '0 10px 25px -5px rgba(244, 124, 152, 0.1), 0 8px 10px -6px rgba(244, 124, 152, 0.1)'
        }}
      >
        {/* 헤더 - 고정 */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-pink-50 w-8 h-8 rounded-full flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M9 8H15M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="#F47C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">상품 상세 정보</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 스크롤 가능한 내용 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-4 text-sm flex items-center text-gray-500">
              <span className="inline-block w-1.5 h-1.5 bg-pink-400 rounded-full mr-2"></span>
              <span><span className="font-medium text-gray-700">{product.bank}</span> 상품 정보입니다</span>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">상품명</label>
              <div className="relative">
                <input
                  type="text"
                  value={product.productName}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">상품 정보</label>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">상품 종류</span>
                    <span className="font-medium">{product.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">가입 대상</span>
                    <span className="font-medium">만 19세 이상 개인</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">월 최대 입금액</span>
                    <span className="font-medium">50만원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">기본 금리</span>
                    <span className="font-medium">{product.benefit}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">상품 혜택 자본금</label>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                <div className="text-center">
                  <span className="font-bold text-lg">2,000,000,000 WORIT</span>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">가입 조건</label>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 기간: 12개월</li>
                  <li>• 중도해지 시 약정금리 적용</li>
                  <li>• 최소 가입금액 10만원</li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">태그 및 우대 금리</label>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-500 block mb-2">태그</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">신제휴혜택</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">고금리</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-2">우대 금리</span>
                  <div className="bg-green-50 rounded-lg border border-green-100 p-2">
                    <span className="text-sm text-green-700">신규 가입시 +0.5%</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

  )
}