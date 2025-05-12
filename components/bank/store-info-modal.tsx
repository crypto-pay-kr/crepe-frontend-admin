"use client"

import { X } from "lucide-react"
import Image from "next/image"
import menuImg from "@/assets/ornate-menu.png"
import qrTemp from "@/assets/qr-code-generic.png"

interface MerchantInfoModalProps {
  onNext: () => void
}

export default function MerchantInfoModal({ onNext }: MerchantInfoModalProps) {
  const menuItems = [
    { id: 1, title: "메뉴 제목 1" },
    { id: 2, title: "메뉴 제목 2" },
    { id: 3, title: "메뉴 제목 3" },
  ]

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
          <h2 className="text-lg font-bold text-gray-800">가맹점 정보</h2>
        </div>

        {/* 모달 내용 - 스크롤 가능 */}
        <div 
          className="p-6 overflow-y-auto custom-scrollbar"
          style={{
            maxHeight: 'calc(90vh - 140px)', // 헤더와 하단 버튼 영역 고려
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E0 #F7FAFC',
          }}
        >
          <div className="space-y-5">
            {/* 판매 분야 */}
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-md">
              <h3 className="text-md font-semibold mb-3 text-gray-800">판매 분야</h3>
              <input 
                type="text" 
                value="음식점" 
                readOnly 
                className="w-full p-3 border border-gray-200 rounded-md bg-white" 
              />
            </div>

            {/* 메뉴 */}
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-md">
              <h3 className="text-md font-semibold mb-3 text-gray-800">메뉴</h3>
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-md p-3 flex items-center bg-white">
                    <div className="w-16 h-16 bg-gray-100 mr-4 rounded-md overflow-hidden">
                      <Image src={menuImg} alt="메뉴 이미지" width={64} height={64} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{item.title}</p>
                    </div>
                    <button className="border border-blue-500 text-blue-500 px-3 py-1.5 rounded-md hover:bg-blue-50 text-sm transition-colors">
                      이미지 다운
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 가맹점 주소 */}
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-md">
              <h3 className="text-md font-semibold mb-3 text-gray-800">가맹점 주소</h3>
              <input
                type="text"
                value="대구 광역시 00로 00길"
                readOnly
                className="w-full p-3 border border-gray-200 rounded-md bg-white"
              />
            </div>

            {/* 사업자등록증 이미지 */}
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-md">
              <h3 className="text-md font-semibold mb-3 text-gray-800">사업자등록증 이미지</h3>
              <div className="border border-gray-200 rounded-md p-3 flex items-center bg-white">
                <div className="w-16 h-16 bg-gray-100 mr-4 rounded-md overflow-hidden">
                  <Image src={qrTemp} alt="사업자등록증" width={64} height={64} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-gray-700 text-sm truncate" title="file-cew4kcm5owr24513jvflkfm4r.png">
                    file-cew4kcm5owr24513jvflkfm4r.png
                  </p>
                  <p className="text-gray-500 text-xs mt-1">34 KB</p>
                </div>
                <button className="border border-blue-500 text-blue-500 px-3 py-1.5 rounded-md hover:bg-blue-50 text-sm transition-colors">
                  이미지 다운
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="p-5 border-t border-gray-100 bg-white sticky bottom-0 flex justify-end">
          <button
            onClick={onNext}
            className="px-5 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  )
}