'use client'
import type React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import GradientProgressBar from "@/components/bank/detail/gradient-progress-bar"
import CryptoChart from "@/components/bank/detail/crypto-chart"
import bankLogo from "@/assets/generic-bank-logo.png"
import Link from "next/link"
import { useSearchParams, useParams } from "next/navigation"
import { ConfirmationModal } from "@/components/common/confirm-modal"

export default function BankDetails() {
  // Next.js의 useParams를 사용하여 URL 파라미터에서 은행 ID 가져오기
  const params = useParams();
  const bankId = params.id || ""; // URL 경로에서 은행 ID 가져오기
  
  // Next.js의 useSearchParams를 사용하여 URL 쿼리 파라미터에서 정보 가져오기
  const searchParams = useSearchParams();
  const bankName = searchParams.get('name') || "은행 이름"; // 기본값 설정
  const phoneNum = searchParams.get('phoneNum') || "전화번호 없음"; // 전화번호 파라미터
  const imageUrl = searchParams.get('imageUrl') || ""; // 이미지 URL 파라미터 추가

  // 삭제 확인 모달을 위한 상태 추가
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false); // 이미지 로딩 에러 상태

  // 디버깅을 위한 useEffect 추가
  useEffect(() => {
    console.log('받은 파라미터들:', {
      bankId,
      bankName,
      phoneNum,
      imageUrl
    });
  }, [bankId, bankName, phoneNum, imageUrl]);

  // 삭제 모달 열기
  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  // 삭제 모달 닫기
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  // 삭제 확인 시 처리
  const handleConfirmDelete = () => {
    console.log(`${bankName} 은행 삭제 처리`);
    // 실제 구현에서는 여기서 API 호출을 통해 삭제 처리할 수 있음
    closeDeleteModal();
    // 성공 후 리다이렉트 또는 다른 처리를 추가할 수 있음
  };

  // 이미지 로딩 에러 핸들러
  const handleImageError = () => {
    console.log('이미지 로딩 실패:', imageUrl);
    setImageError(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Link를 버튼 밖으로 이동하고, 버튼 전체를 클릭 가능하게 만듦 */}
              <Link href="/bank/management" className="p-2 rounded-full hover:bg-gray-100 inline-flex">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </Link>
              {/* URL에서 가져온 은행 이름 표시 */}
              <h1 className="text-lg font-medium">{bankName}</h1>
            </div>
            {/* 삭제 버튼 클릭 시 모달 열기 */}
            <button 
              onClick={openDeleteModal} 
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              은행 삭제
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Bank Info Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md font-medium">은행 CI 이미지 정보</h2>
              
            </div>
            <div className="w-full h-40 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
              <div className="relative w-32 h-32">
                {imageUrl && !imageError ? (
                  <>
                    <img 
                      src={imageUrl} 
                      alt={`${bankName} 로고`} 
                      className="w-full h-full object-contain rounded-lg" 
                      onError={handleImageError}
                      onLoad={() => console.log('이미지 로딩 성공:', imageUrl)}
                    />
                  </>
                ) : (
                  <Image 
                    src={bankLogo} 
                    alt="기본 은행 로고" 
                    fill 
                    className="object-contain" 
                  />
                )}
              </div>
            </div>
            
          </div>

          {/* Contact Info Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-md font-medium mb-4">담당자 전화 번호</h2>
            <div className="mb-4">
              <input
                type="text"
                value={phoneNum} // URL 파라미터에서 가져온 전화번호 사용
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div className="space-y-3">
              {/* Link를 사용하여 계좌 관리 페이지로 이동, 은행 ID와 이름을 함께 전달 */}
              <Link href={`/bank/wallet/${bankId}?name=${encodeURIComponent(bankName)}`}>
                <button className="w-full p-3 text-left border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors mb-1">
                  <span>은행 계좌 관리</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </Link>

              <Link href={`/bank/products/${bankId}?name=${encodeURIComponent(bankName)}`}>
                <button className="w-full p-3 text-left border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <span>은행 상품 관리</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </Link>
            </div>
          </div>

          {/* Token Price Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-md font-medium mb-4">토큰 현재가</h2>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-sm">1.12142KRW</div>
              <div className="text-red-500">+3.4%</div>
            </div>
            <GradientProgressBar
              segments={[
                {
                  label: "USDT",
                  width: "w-1/3",
                  startColor: "rose-300",
                  endColor: "rose-200",
                  textColor: "text-rose-900",
                },
                {
                  label: "XRP",
                  width: "w-1/3",
                  startColor: "gray-200",
                  endColor: "gray-300",
                  textColor: "text-gray-700",
                },
                { label: "", width: "w-1/3", startColor: "rose-500", endColor: "rose-400" },
              ]}
            />
            <CryptoChart />
          </div>

          {/* Asset Balance Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-md font-medium mb-4">자본금 추이</h2>
            <div className="flex items-center justify-between mb-2">
              <div className="w-full">
                <input
                  type="text"
                  value="1,232,324,242,242,400KRW"
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="text-red-500 ml-2">+3.4%</div>
            </div>
            <CryptoChart />
          </div>

          {/* Bank Balance Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-md font-medium mb-4">은행 잔여금</h2>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-sm">3,321,232.23232123XRP</div>
              <div className="text-red-500">+3.4%</div>
            </div>
            <GradientProgressBar
              segments={[
                {
                  label: "잔여 2,232,123XRP",
                  width: "w-1/3",
                  startColor: "rose-300",
                  endColor: "rose-200",
                  textColor: "text-rose-900",
                },
                { label: "", width: "w-2/3", startColor: "rose-500", endColor: "rose-400" },
              ]}
            />
            <CryptoChart />
          </div>

          {/* Token Value Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md font-medium">토큰 거래량</h2>
              <div className="relative">
                <select className="appearance-none border border-gray-300 rounded-lg p-2 pr-8 bg-white">
                  <option>XRP</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-sm">3,321.233WOORI</div>
              <div className="text-red-500">+3.4%</div>
            </div>
            <CryptoChart />
          </div>
        </div>
      </div>
      
      {/* 은행 삭제 확인 모달 - 개선된 버전 사용 */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="은행 삭제 확인"
        targetName={bankName}
        targetType="은행"
        actionText="삭제"
      />
    </div>
  )
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}