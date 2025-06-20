"use client"

import Link from "next/link"
import {ArrowLeft, ChevronLeft, ChevronRight} from "lucide-react"
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {fetchUserTransactionHistory} from "@/api/ActorApi";

interface TransferHistoryProps {
  userId?: string | string[];
  merchantId?: string | string[];
  type?: "user" | "merchant"; // 사용자 타입 지정
  title?: string; // 커스텀 제목
  backPath?: string; // 돌아가기 경로
}
interface GetTransactionHistoryResponse {
  currency: string;
  transactionId: string;
  transactionStatus: string;
  amount: string;
  transferAt: string;
  transactionType: string;
}

export default function TransferHistory({ 
  userId, 
  merchantId,
  type = "user",
  title = "이체내역",
  backPath = type === "user" ? "/management/user" : "/management/store",
}: TransferHistoryProps) {

  const { id } = useParams();
  const [transactions, setTransactions] = useState<GetTransactionHistoryResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // 0부터 시작
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    console.log("actorId 확인:", id);
    const load = async () => {
      if (!id) return;

      try {
        const data = await fetchUserTransactionHistory(Number(id),currentPage,10);

        setTransactions(data.content);
        setTotalPages(data.totalPages);
      } catch (e) {
        console.error('거래 내역 불러오기 실패:', e);
      }
    };

    load();
  }, [id, currentPage]);


  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };


  
  return (
    <div className="flex h-screen bg-white">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-8 overflow-auto bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* 헤더 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Link
                  href={backPath}
                  className={`flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-2`}
                >
                  <ArrowLeft size={18} className="mr-2" />
                  <span className="text-sm font-medium">돌아가기</span>
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              </div>
            </div>
          </div>

          {/* 이체 내역 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-gray-600">코인 종류</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">거래 날짜</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">거래 ID</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">상태</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">타입</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">거래 금액</th>
              </tr>
              </thead>
              <tbody>
              {transactions.map((transfer, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-800">{transfer.currency}</td>
                    <td className="py-4 px-4 text-gray-800">{new Date(transfer.transferAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })}</td>
                    <td className="py-4 px-4 text-gray-800 max-w-xs truncate">
                      <span title={transfer.transactionId}>{transfer.transactionId}</span>
                    </td>
                    <td className="py-4 px-4">
                      {/*<div className={`${transfer.transactionStatus ? "text-red-500" : "text-green-500"}`}>*/}
                      <div>
                        {transfer.transactionStatus}
                      </div>
                    </td>
                    <td className="py-4 px-4">{transfer.transactionType}</td>


                    <td className="py-4 px-4 font-medium">{transfer.amount}</td>
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
    </div>
  )
}