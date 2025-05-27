// components/common/suspension-modal.tsx
"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { ConfirmationModal } from "./confirm-modal"
import { changeActorStatus } from "@/api/adminApi"


interface SuspensionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string, period: string) => void
  userName: string
  userId: number // 추가
}

export default function SuspensionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName,
  userId 
}: SuspensionModalProps) {
  const [reason, setReason] = useState("")
  const [period, setPeriod] = useState("7일 이용정지")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const handlePrimaryAction = () => {
    if (reason.trim()) {
      setShowConfirmation(true)
    }
  }
  
  const handleFinalConfirm = async () => {
    setIsLoading(true)
    
    try {
      // 기간에 따른 매핑
      const periodMapping = {
        "7일 이용정지": { type: "TEMPORARY" as const, days: 7 },
        "14일 이용정지": { type: "TEMPORARY" as const, days: 14 },
        "21일 이용정지": { type: "TEMPORARY" as const, days: 21 },
        "영구정지": { type: "PERMANENT" as const }
      };
      
      const suspensionConfig = periodMapping[period as keyof typeof periodMapping];
      
      const request = {
        actorId: userId,
        action: "SUSPEND" as const,
        suspensionRequest: {
          type: suspensionConfig.type,
          ...(suspensionConfig.type === "TEMPORARY" && { days: suspensionConfig.days }),
          reason: reason.trim()
        }
      };
      
      const response = await changeActorStatus(request);
      
      // 성공 처리
      onConfirm(reason, period);
      setShowConfirmation(false);
      
      // 입력 초기화
      setReason("");
      setPeriod("7일 이용정지");
      
      
    } catch (error) {
      console.error('정지 처리 실패:', error);
      alert('정지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
  }

  const handleClose = () => {
    if (!isLoading) {
      setReason("");
      setPeriod("7일 이용정지");
      onClose();
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
            <h2 className="text-lg font-semibold text-gray-800">유저 이용정지</h2>
          </div>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 내용 */}
        <div className="p-6">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">이용정지 사유</label>
            <div className="relative">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-3 pt-4 h-28 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 focus:outline-none transition-all resize-none"
                placeholder="이용정지 사유를 입력해주세요"
                disabled={isLoading}
                maxLength={200}
              />
              <div className="absolute bottom-3 right-3 flex items-center text-xs text-gray-400">
                <span>{reason.length}</span>
                <span className="mx-1">/</span>
                <span>200</span>
              </div>
            </div>
            {userName && (
              <div className="mt-2 text-sm flex items-center text-gray-500">
                <span className="inline-block w-1.5 h-1.5 bg-pink-400 rounded-full mr-2"></span>
                <span><span className="font-medium text-gray-700">{userName}</span> 님에 대한 이용정지입니다</span>
              </div>
            )}
          </div>
          
          {/* 라디오 버튼 그룹 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">이용정지 기간</label>
            
            <div className="space-y-3 pl-1">
              {[
                { value: "7일 이용정지", label: "7일 이용정지"},
                { value: "14일 이용정지", label: "14일 이용정지" },
                { value: "21일 이용정지", label: "21일 이용정지" },
                { value: "영구정지", label: "영구정지" }
              ].map((option) => (
                <label key={option.value} className="flex items-center group cursor-pointer">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="period"
                      value={option.value}
                      checked={period === option.value}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      period === option.value 
                        ? "border-pink-500" 
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}>
                      {period === option.value && (
                        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm ${period === option.value ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                      {option.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          {/* 버튼 그룹 */}
          <div className="flex gap-3 justify-end pt-2">
            <button 
              onClick={handleClose} 
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              onClick={handlePrimaryAction}
              className={`px-5 py-2.5 text-white rounded-lg font-medium text-sm shadow-sm transition-all flex items-center gap-2 ${
                !reason.trim() || isLoading
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-pink-500 hover:bg-pink-600 hover:shadow"
              }`}
              disabled={!reason.trim() || isLoading}
            >
              <span>{isLoading ? "처리중..." : "확인"}</span>
              {!reason.trim() || isLoading ? null : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <ConfirmationModal 
        isOpen={showConfirmation}
        onClose={handleCancelConfirmation}
        onConfirm={handleFinalConfirm}
        title="이용정지 확인"
        targetName={userName}
        targetType="사용자"
        actionText={period}
        customMessage={`"${userName}" 사용자를 "${period}"하시겠습니까?`}
      />
    </div>
  )
}