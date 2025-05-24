"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import { ArrowLeft, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import {approveRefund, fetchUserPayHistories} from "@/api/payHistoryApi";



export interface Payment {
  payId: number;
  orderId: string;
  storeName: string;
  payDate: string;
  orderDetail: string;
  payCoinAmount: number;
  payType: "APPROVED" | "PENDING" | "CANCELED"|"REFUND";
  coinCurrency: string;
  payKRWAmount: number;
  index: number;
}

interface PaymentHistoryProps {
  userId?: string | string[];
}

export default function PaymentHistory({ userId }: PaymentHistoryProps) {
  // 환불 요청 상태 관리
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // 0부터 시작
  const [totalPages, setTotalPages] = useState(1);

  const [selectedStatus, setSelectedStatus] = useState("all");
  // 환불 요청 처리 함수
  const handleRefundRequest = (payment: Payment, index: number) => {
    setSelectedPayment({ ...payment, index });
    setShowRefundModal(true);
  };
  const filteredPayments = selectedStatus === "all"
      ? payments
      : payments.filter(p => p.payType === selectedStatus);


  useEffect(() => {
    fetchUserPayHistories(Number(userId), currentPage, 10, selectedStatus)
        .then(data => {
          setPayments(data.content);
          setTotalPages(data.totalPages);
        })
        .catch(err => console.error(err));
  }, [userId]);


  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const approveRefundOrder = async () => {
    if (selectedPayment && selectedPayment.index !== undefined) {
      try {
        await approveRefund(selectedPayment.payId, Number(userId));

        setShowRefundModal(false)
      } catch (error) {
        console.error('환불 승인 실패:', error);
        alert('환불 처리 중 오류가 발생했습니다.');
      }
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
              <button
                  className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Filter size={16} className="mr-2"/>
                필터
              </button>
              <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="APPROVED">결제 완료</option>
                <option value="PENDING">대기 중</option>
                <option value="CANCELED">주문 취소</option>
                <option value="REFUND">환불됨</option>
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
                {filteredPayments.map((payment, index) => (

                  <tr
                    key={index}
                    className={`border-b border-gray-100 transition-colors`}
                  >
                    <td className="py-4 px-4 text-gray-800 font-medium">{payment.storeName}</td>
                    <td className="py-4 px-4 text-gray-700">{new Date(payment.payDate).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })}</td>
                    <td className="py-4 px-4 text-gray-700">
                      <div className="flex items-center">
                        <button
                          title={`클릭하여 복사: ${payment.orderId}`}
                          className="relative group cursor-pointer flex items-center"
                          onClick={() => {
                            navigator.clipboard.writeText(payment.orderId);
                            alert("클립보드에 복사되었습니다.");
                          }}
                        >
                          <span>{payment.orderId.substring(0, 12)}...</span>
                          <div className="absolute left-0 -top-10 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            {payment.orderId}
                          </div>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {
                        payment.orderDetail
                      }
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{payment.payKRWAmount} KRW</div>
                      <div className="text-sm text-gray-500">{payment.payCoinAmount} {payment.coinCurrency}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {payment.payType === "REFUND" ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                          환불 완료
                        </span>
                      ) : payment.payType === "CANCELED" ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                          주문 취소
                        </span>
                      ) :payment.payType==="PENDING" ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-600">
                          수락 대기중
                        </span>
                      ) :(
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                          결제 완료
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {payment.payType === "APPROVED" ? (
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={() => handleRefundRequest(payment, index)}
                            className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs rounded hover:shadow transition-all active:scale-95"
                          >
                            환불 승인
                          </button>
                        </div>
                      ) : payment.payType === "REFUND" ? (
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
              총 <span className="font-medium text-gray-700">{totalPages}</span> 페이지 중 <span
                className="font-medium text-gray-700">{currentPage + 1}</span> 페이지
            </div>
            <div className="flex items-center space-x-1">
              <button
                  onClick={() => goToPage(currentPage - 1)}
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50"
                  disabled={currentPage === 0}
              >
                <ChevronLeft size={18}/>
              </button>

              {[...Array(totalPages)].map((_, i) => (
                  <button
                      key={i}
                      onClick={() => goToPage(i)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center font-medium ${
                          i === currentPage
                              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    {i + 1}
                  </button>
              ))}

              <button
                  onClick={() => goToPage(currentPage + 1)}
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50"
                  disabled={currentPage === totalPages - 1}
              >
                <ChevronRight size={18}/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 환불 승인 모달 */}
      {showRefundModal && selectedPayment && (
          <div
              className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
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
                      <path
                          d="M9 11L12 14L15 11M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                          stroke="#F47C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <span className="text-gray-800 text-sm font-medium">{selectedPayment.storeName}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-500 text-sm">결제 날짜</span>
                  <span className="text-gray-800 text-sm font-medium">{selectedPayment.payType}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-500 text-sm">결제 금액</span>
                  <div className="flex flex-col">
                    <span className="text-gray-800 text-sm font-medium">{selectedPayment.payKRWAmount}KRW</span>
                    <span className="text-gray-500 text-xs">{selectedPayment.payCoinAmount}{selectedPayment.coinCurrency}</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-sm flex items-center text-gray-500 mb-6">
                <span className="inline-block w-1.5 h-1.5 bg-pink-400 rounded-full mr-2"></span>
                <span>환불 요청을 승인하면 즉시 처리됩니다.</span>
              </div>

              {/* 버튼 그룹 */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={approveRefundOrder}
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
