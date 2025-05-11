'use client'

import WaitingListComponent, { WaitingListItem } from "@/components/common/waiting-list";
import { ShoppingBag, FileText } from "lucide-react"
import { useState } from "react"


// 유저 계좌 등록에 필요한 추가 필드 정의
interface UserAccountRegistration {
  depositorName: string;
  userType: string;
  coin: string;
  accountNumber: string;
  accountNumber2: string;
}

export default function UserAccountRegistrationPage() {
  // 실제 데이터는 API에서 불러올 것이므로 useState로 관리
  const [waitingListItems, setWaitingListItems] = useState(
    // 기존 데이터를 새로운 형식으로 변환
    waitingList.map(item => ({
      id: item.id,
      requestDate: item.requestDate,
      name: item.depositorName, // 공통 필드인 name으로 매핑
      type: item.userType, // 공통 필드인 type으로 매핑
      approveType: item.approveType,
      approveButtonText: item.approveButtonText,
      depositorName: item.depositorName,
      userType: item.userType,
      coin: item.coin,
      accountNumber: item.accountNumber,
      accountNumber2: item.accountNumber2
    }))
  );
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  const handleReject = (id: number, item: WaitingListItem<UserAccountRegistration>) => {
    console.log(`거절 처리: ${id}`, item);
    // 여기에 API 호출 등 실제 거절 처리 로직 구현
  };

  const handleApprove = (id: number, type: string, item: WaitingListItem<UserAccountRegistration>) => {
    console.log(`승인 처리: ${id}, 타입: ${type}`, item);
    // 여기에 API 호출 등 실제 승인 처리 로직 구현
  };

  const handleBulkRegistration = () => {
    console.log('일괄 등록 모달 열기');
    setBulkModalOpen(true);
    // 모달 로직은 별도로 구현
  };

  const handleSearch = (searchText: string) => {
    console.log('검색어:', searchText);
    // 실제 구현에서는 API 호출 또는 클라이언트 측 필터링
  };

  // 컬럼 정의
  const columns = [
    {
      key: 'requestDate',
      header: '요청 일자',
    },
    {
      key: 'name',
      header: '입금자 명',
      render: (value: string, item: WaitingListItem<UserAccountRegistration>) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium">
            {value.charAt(0)}
          </div>
          <span className="font-medium text-gray-800">{value}</span>
        </div>
      )
    },
    {
      key: 'type',
      header: '타입',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "가맹점" 
            ? "bg-blue-100 text-blue-700" 
            : "bg-purple-100 text-purple-700"
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'coin',
      header: '코인',
    },
    {
      key: 'accountNumber',
      header: '계좌번호',
    },
    {
      key: 'accountNumber2',
      header: '계좌번호2',
    },
  ];

  // 추가 액션 버튼
  const extraActionButton = (
    <button 
      onClick={handleBulkRegistration}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
    >
      <FileText size={16} className="text-pink-500" />
      한번에 여러 계좌 등록하기 (최대 20명)
    </button>
  );

  return (
    <WaitingListComponent
      title="계좌 등록 대기 리스트"
      subtitle="신규 정산 계좌 등록 대기"
      subtitleIcon={<ShoppingBag size={18} className="text-pink-500" />}
      items={waitingListItems}
      columns={columns}
      searchPlaceholder="유저 또는 계좌 검색"
      onApprove={handleApprove}
      onReject={handleReject}
      onSearch={handleSearch}
      extraActionButton={extraActionButton}
      rejectModalTitle="계좌 등록 거절 확인"
      rejectModalTargetType="등록 요청"
      rejectModalActionText="거절"
    />
  )
}

// 데이터를 컴포넌트 외부로 이동
const waitingList = [
  {
    id: 1,
    requestDate: "2025/01/07",
    depositorName: "홍길동",
    userType: "가맹점",
    coin: "XRP",
    accountNumber: "880912",
    accountNumber2: "010-0000-0000",
    approveType: "release",
    approveButtonText: "해제 완료",
  },
  {
    id: 2,
    requestDate: "2025/01/07",
    depositorName: "홍길동",
    userType: "유저",
    coin: "USDT",
    accountNumber: "880912",
    accountNumber2: "010-0000-0000",
    approveType: "change",
    approveButtonText: "변경 완료",
  },
  {
    id: 3,
    requestDate: "2025/01/07",
    depositorName: "홍길동",
    userType: "유저",
    coin: "아기호랑이",
    accountNumber: "880912",
    accountNumber2: "010-0000-0000",
    approveType: "register",
    approveButtonText: "등록완료",
  },
  {
    id: 4,
    requestDate: "2025/01/07",
    depositorName: "김철수",
    userType: "가맹점",
    coin: "아기호랑이",
    accountNumber: "880912",
    accountNumber2: "010-0000-0000",
    approveType: "register",
    approveButtonText: "등록완료",
  },
  {
    id: 5,
    requestDate: "2025/01/07",
    depositorName: "이영희",
    userType: "유저",
    coin: "아기호랑이",
    accountNumber: "880912",
    accountNumber2: "010-0000-0000",
    approveType: "register",
    approveButtonText: "등록완료",
  },
]