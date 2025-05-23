"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    console.log("actorId 확인:", id);
    const load = async () => {
      if (!id) return;

      try {
        const data = await fetchUserTransactionHistory(Number(id),0,5);

        setTransactions(data.content);
        setTotalPages(data.totalPages);
      } catch (e) {
        console.error('거래 내역 불러오기 실패:', e);
      }
    };

    load();
  }, [id, page]);



  
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
                    <td className="py-4 px-4 text-gray-800">{transfer.transferAt.split("T")[0]}</td>
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
        </div>
      </div>
    </div>
  )
}