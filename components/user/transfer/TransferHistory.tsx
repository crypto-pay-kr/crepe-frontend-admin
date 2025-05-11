"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface TransferHistoryProps {
  userId?: string | string[];
  merchantId?: string | string[];
  type?: "user" | "merchant"; // 사용자 타입 지정
  title?: string; // 커스텀 제목
  backPath?: string; // 돌아가기 경로
}

export default function TransferHistory({ 
  userId, 
  merchantId,
  type = "user",
  title = "이체내역",
  backPath = type === "user" ? "/management/user" : "/management/store",
}: TransferHistoryProps) {
  

  
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
                  <th className="py-3 px-4 text-left font-medium text-gray-600">거래 금액</th>
                </tr>
              </thead>
              <tbody>
                {transferHistory.map((transfer, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-800">{transfer.coinType}</td>
                    <td className="py-4 px-4 text-gray-800">{transfer.date}</td>
                    <td className="py-4 px-4 text-gray-800 max-w-xs truncate">
                      <span title={transfer.transactionId}>{transfer.transactionId}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`${transfer.status.includes("실패") ? "text-red-500" : "text-green-500"}`}>
                        {transfer.status}
                      </div>
                      {transfer.errorCode && <div className="text-sm text-gray-500">{transfer.errorCode}</div>}
                    </td>
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

// 샘플 데이터
const transferHistory = [
  {
    coinType: "리플",
    date: "2024/12/27",
    transactionId: "olkdjfierjqnkjkdjf3249udnf982k2nelkn",
    status: "입금 실패",
    errorCode: "Error Code: ~~~",
    amount: "10 XRP",
  },
  {
    coinType: "리플",
    date: "2024/12/26",
    transactionId: "olkdjfierjqnkjkdjf3249udnf982k2nelkn",
    status: "입금",
    errorCode: "",
    amount: "10 XRP",
  },
]