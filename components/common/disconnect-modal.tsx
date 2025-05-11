"use client"

import { AlertTriangle } from "lucide-react"

// 연결 해제 확인 모달
interface AccountInfo {
  depositorName: string;
  coinName: string;
  coinAccount: string;
}

export function DisconnectConfirmModal({ isOpen, onClose, onConfirm, accountInfo }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; accountInfo: AccountInfo }) {
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
            <h3 className="text-lg font-semibold text-gray-800 mb-1">연결 해제 확인</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              <span className="font-medium text-gray-700">{accountInfo.depositorName}</span>님의 <span className="font-medium text-red-600">{accountInfo.coinName}</span> 계좌를 연결 해제하시겠습니까?
            </p>
            <div className="mt-2 text-xs bg-gray-50 p-2 rounded w-full overflow-hidden">
              <p className="truncate text-gray-600">{accountInfo.coinAccount}</p>
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