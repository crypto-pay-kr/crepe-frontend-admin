"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import Image from "next/image"
import qrCode from "@/assets/qr-code-sample.png"

interface UpbitLoginModalProps {
  onComplete: (verificationCode: string) => void;
  isLoading?: boolean;
}

export default function UpbitLoginModal({ onComplete, isLoading = false }: UpbitLoginModalProps) {
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerify = () => {
    if (!verificationCode) return;
    onComplete(verificationCode);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] transform transition-all animate-in zoom-in-95 duration-200 overflow-hidden"
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* 모달 헤더 - 고정 */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-800">업비트 로그인</h2>
        </div>

        {/* 모달 내용 */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 size={48} className="text-pink-500 animate-spin mb-4" />
              <p className="text-gray-700 text-lg">인증 중입니다...</p>
              <p className="text-gray-500 mt-2">잠시만 기다려주세요.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-4">업비트 QR 인증 후 체험하는 숫자를 입력해주세요.</p>

              <div className="bg-gray-50 p-4 border border-gray-100 rounded-md mb-6">
                <div className="border border-gray-200 rounded-md p-6 flex items-center bg-white">
                  <div className="w-1/2 flex justify-center">
                    <div className="w-40 h-40 bg-gray-100 relative rounded-md overflow-hidden">
                      <Image 
                        src={qrCode} 
                        alt="QR 코드" 
                        width={160}
                        height={160}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </div>

                  <div className="w-1/2 flex justify-center">
                    <span className="text-7xl font-medium text-gray-800">98</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">인증번호 입력</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="QR코드 스캔 후 발급된 인증번호를 입력하세요"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-200 focus:outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* 하단 버튼 영역 */}
        {!isLoading && (
          <div className="p-5 border-t border-gray-100 bg-white sticky bottom-0 flex justify-end">
            <button
              onClick={handleVerify}
              disabled={!verificationCode}
              className={`px-5 py-3 rounded-lg font-medium transition-colors ${
                verificationCode 
                  ? "bg-pink-500 text-white hover:bg-pink-600" 
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              인증하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}