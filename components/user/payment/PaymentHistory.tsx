"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"

// 타입 정의 추가
interface PaymentAmount {
  fiat: string;
  crypto: string;
}

interface Payment {
  merchantName: string;
  date: string;
  transactionHash: string;
  purchaseDetails: string[] | string;
  amount: PaymentAmount;
  status: "completed" | "refund_requested" | "refunded";
  refundReason?: string;
  index?: number;
}

interface PaymentHistoryProps {
  userId?: string | string[];
}

export default function PaymentHistory({ userId }: PaymentHistoryProps) {
  // 환불 요청 상태 관리
  const [payments, setPayments] = useState<Payment[]>(paymentHistory);
  const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // 환불 요청 처리 함수
  const handleRefundRequest = (payment: Payment, index: number) => {
    setSelectedPayment({ ...payment, index });
    setShowRefundModal(true);
  };
  
  // 최대 500ms 지연 후 모달 닫기 (애니메이션 효과를 위해)
  const closeModal = () => {
    setTimeout(() => {
      setShowRefundModal(false);
    }, 200);
  };

  // 환불 승인 함수
  const approveRefund = () => {
    if (selectedPayment && selectedPayment.index !== undefined) {
      const updatedPayments = [...payments];
      updatedPayments[selectedPayment.index] = {
        ...selectedPayment,
        status: "refunded"
      };
      setPayments(updatedPayments);
      closeModal();
    }
  };

  // 환불 거절 함수
  const rejectRefund = () => {
    if (selectedPayment && selectedPayment.index !== undefined) {
      const updatedPayments = [...payments];
      updatedPayments[selectedPayment.index] = {
        ...selectedPayment,
        status: "completed"
      };
      setPayments(updatedPayments);
      closeModal();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          {/* 헤더 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Link href="/management/user" className="flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-2">
                  <ArrowLeft size={18} className="mr-2" />
                  <span className="text-sm font-medium">돌아가기</span>
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">결제내역</h1>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              <span className="hover:text-pink-500">유저</span> / 
              <span className="hover:text-pink-500 ml-1">유저관리</span> / 
              <span className="text-gray-700 font-medium ml-1">유저 결제내역</span>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="결제내역 검색..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Filter size={16} className="mr-2" />
                필터
              </button>
              <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">모든 상태</option>
                <option value="completed">완료됨</option>
                <option value="refund_requested">환불 요청</option>
                <option value="refunded">환불됨</option>
              </select>
            </div>
          </div>

          {/* 결제 내역 테이블 - 스크롤 제한 제거 */}
          <div className="border border-gray-200 rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">가맹점 명</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">결제 날짜</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">결제 내역</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">구매 상세</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">결제 금액</th>
                  <th className="py-3 px-4 text-center font-medium text-gray-700 border-b">상태</th>
                  <th className="py-3 px-4 text-center font-medium text-gray-700 border-b">관리</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 transition-colors ${
                      payment.status === "refunded" ? "bg-red-50 bg-opacity-30" : 
                      payment.status === "refund_requested" ? "bg-yellow-50 bg-opacity-30" : ""
                    }`}
                  >
                    <td className="py-4 px-4 text-gray-800 font-medium">{payment.merchantName}</td>
                    <td className="py-4 px-4 text-gray-700">{payment.date}</td>
                    <td className="py-4 px-4 text-gray-700">
                      <div className="flex items-center">
                        <button 
                          title={`클릭하여 복사: ${payment.transactionHash}`}
                          className="relative group cursor-pointer flex items-center"
                          onClick={() => {
                            navigator.clipboard.writeText(payment.transactionHash);
                            alert("클립보드에 복사되었습니다.");
                          }}
                        >
                          <span>{payment.transactionHash.substring(0, 12)}...</span>
                          <div className="absolute left-0 -top-10 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            {payment.transactionHash}
                          </div>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {Array.isArray(payment.purchaseDetails) ? (
                        <div>
                          {payment.purchaseDetails.map((detail, i) => (
                            <div key={i} className="mb-1 last:mb-0 text-sm">{detail}</div>
                          ))}
                        </div>
                      ) : (
                        payment.purchaseDetails
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{payment.amount.fiat}</div>
                      <div className="text-sm text-gray-500">{payment.amount.crypto}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {payment.status === "refunded" ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                          환불 완료
                        </span>
                      ) : payment.status === "refund_requested" ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                          환불 요청
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                          결제 완료
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {payment.status === "refund_requested" ? (
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={() => handleRefundRequest(payment, index)} 
                            className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs rounded hover:shadow transition-all active:scale-95"
                          >
                            승인 관리
                          </button>
                        </div>
                      ) : payment.status === "refunded" ? (
                        <span className="text-sm text-gray-500">처리 완료</span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              총 <span className="font-medium text-gray-700">12</span>개 중 <span className="font-medium text-gray-700">1-5</span> 표시
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50">
                <ChevronLeft size={18} />
              </button>
              <button className="w-8 h-8 rounded-md bg-gradient-to-r from-pink-500 to-rose-400 text-white flex items-center justify-center font-medium">
                1
              </button>
              <button className="w-8 h-8 rounded-md hover:bg-gray-100 text-gray-700 flex items-center justify-center">
                2
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 환불 승인 모달 */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
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
                    <path d="M9 11L12 14L15 11M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#F47C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">환불 요청 처리</h2>
              </div>
              <button 
                onClick={() => setShowRefundModal(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* 내용 */}
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex">
                  <span className="w-24 text-gray-500 text-sm">가맹점</span>
                  <span className="text-gray-800 text-sm font-medium">{selectedPayment.merchantName}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-500 text-sm">결제 날짜</span>
                  <span className="text-gray-800 text-sm font-medium">{selectedPayment.date}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-500 text-sm">결제 금액</span>
                  <div className="flex flex-col">
                    <span className="text-gray-800 text-sm font-medium">{selectedPayment.amount.fiat}</span>
                    <span className="text-gray-500 text-xs">{selectedPayment.amount.crypto}</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-500 text-sm">환불 사유</span>
                  <span className="text-gray-800 text-sm font-medium">{selectedPayment.refundReason || "고객 변심"}</span>
                </div>
              </div>
              
              <div className="mt-2 text-sm flex items-center text-gray-500 mb-6">
                <span className="inline-block w-1.5 h-1.5 bg-pink-400 rounded-full mr-2"></span>
                <span>환불 요청을 승인하면 즉시 처리됩니다.</span>
              </div>
              
              {/* 버튼 그룹 */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={rejectRefund}
                  className="px-5 py-2.5 border border-red-200 text-red-600 bg-red-50 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors"
                >
                  거절하기
                </button>
                <button
                  onClick={approveRefund}
                  className="px-5 py-2.5 text-white rounded-lg font-medium text-sm shadow-sm transition-all flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:shadow active:scale-95"
                >
                  <span>승인하기</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 더 많은 결제 내역 데이터를 추가하여 테스트 (환불 요청 상태 추가)
const paymentHistory: Payment[] = [
  {
    merchantName: "스타벅스 강남점",
    date: "2024/12/27",
    transactionHash: "olkdjfierjqnkjkdjf3249udnf982k2nelkn",
    purchaseDetails: ["아메리카노 1개, 크로플 1개", "케이크 1개"],
    amount: {
      fiat: "34,543 KRW",
      crypto: "10 XRP",
    },
    status: "completed",
  },
  {
    merchantName: "온라인 쇼핑몰",
    date: "2024/12/26",
    transactionHash: "olkdjfierjqnkjkdjf3249udnf982k2nelkn",
    purchaseDetails: ["의류 구매", "배송비"],
    amount: {
      fiat: "34,543 KRW",
      crypto: "10 XRP",
    },
    status: "refund_requested",
    refundReason: "상품 불량"
  },
  {
    merchantName: "이디야 커피 신사점",
    date: "2024/12/25",
    transactionHash: "q9wensfierjqnkjkdjf3249udnf982k2nelkn",
    purchaseDetails: ["카페라테 2개", "베이글 1개"],
    amount: {
      fiat: "15,000 KRW",
      crypto: "4.3 XRP",
    },
    status: "refund_requested",
    refundReason: "고객 변심"
  },
  {
    merchantName: "현대백화점 판교점",
    date: "2024/12/23",
    transactionHash: "vzpw9wr9jf024jfierjlndasf24j1sf",
    purchaseDetails: ["가전제품", "생활용품"],
    amount: {
      fiat: "245,000 KRW",
      crypto: "70.5 XRP",
    },
    status: "completed",
  },
  {
    merchantName: "CGV 영화관",
    date: "2024/12/20",
    transactionHash: "kjsdh72hsdf7s8f0sfdksd09fs",
    purchaseDetails: ["영화티켓 2장", "팝콘 세트"],
    amount: {
      fiat: "43,000 KRW",
      crypto: "12.4 XRP",
    },
    status: "refunded",
    refundReason: "서비스 불만족"
  }
]