'use client'

import { useState } from "react"
import { Landmark, ClipboardCheck } from "lucide-react"
import WaitingListComponent, { WaitingListItem } from "@/components/common/waiting-list"

// 은행 토큰 요청에 필요한 추가 필드 정의
interface BankTokenRequest {
  bank: string;
  reason: string;
  type: string;
  tokenChanges?: {
    symbol: string;
    oldValue: string;
    newValue: string;
    status: string;
    statusType: "increase" | "decrease" | "new";
  }[];
  tokenValues?: {
    value: string;
    change?: string;
    changeType?: "increase" | "decrease";
  }[];
}

export default function BankTokenRequestPage() {
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);
  
  // 실제 데이터는 API에서 불러올 것이므로 useState로 관리
  const [waitingListItems, setWaitingListItems] = useState(
    // 기존 데이터를 새로운 형식으로 변환
    tokenRequests.map(item => ({
      id: item.id,
      requestDate: item.date,
      name: item.bank, // 공통 필드인 name으로 매핑
      type: item.type, // 공통 필드인 type으로 매핑
      approveType: "approve",
      approveButtonText: "요청 확인",
      bank: item.bank,
      reason: item.reason,
      tokenChanges: item.id === 1 ? sampleTokenChanges : undefined, // 예시 데이터
      tokenValues: item.id === 1 ? sampleTokenValues : undefined, // 예시 데이터
    }))
  );

  const handleReject = (id: number, item: WaitingListItem<BankTokenRequest>) => {
    console.log(`거절 처리: ${id}`, item);
    // 여기에 API 호출 등 실제 거절 처리 로직 구현
  };

  const handleApprove = (id: number, type: string, item: WaitingListItem<BankTokenRequest>) => {
    // 요청 확인 버튼 클릭 시 바로 처리
    console.log(`${item.bank}의 ${item.type} 요청 확인 처리`);
    
    // 처리 후 목록에서 제거하는 예시 로직
    setWaitingListItems(prev => 
      prev.filter(listItem => listItem.id !== id)
    );
    
    // 실제 구현에서는 API 호출 등을 통해 요청 확인 처리
  };

  const handleSearch = (searchText: string) => {
    console.log('검색어:', searchText);
    // 실제 구현에서는 API 호출 또는 클라이언트 측 필터링
  };

  const handleBulkRegistration = () => {
    setBulkModalOpen(true);
    console.log('일괄 토큰 등록 모달 열기');
  };

  const handleBulkConfirm = (selectedIds: number[]) => {
    console.log('일괄 승인 처리:', selectedIds);
    
    // 처리 후 목록에서 제거하는 예시 로직
    setWaitingListItems(prev => 
      prev.filter(item => !selectedIds.includes(item.id))
    );
    
    // 실제 구현에서는 API 호출 등 실제 일괄 승인 처리 로직 구현
  };

  // 컬럼 정의
  const columns = [
    {
      key: 'requestDate',
      header: '요청 날짜',
    },
    {
      key: 'name',
      header: '은행',
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium">
            {value.charAt(0)}
          </div>
          <span className="font-medium text-gray-800">{value}</span>
        </div>
      )
    },
    {
      key: 'reason',
      header: '사유',
    },
    {
      key: 'type',
      header: '요청 종류',
    },
  ];

  // 추가 액션 버튼
  const extraActionButton = (
    <button 
      onClick={handleBulkRegistration}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
    >
      <ClipboardCheck size={16} className="text-pink-500" />
      한번에 여러 토큰 요청 승인하기
    </button>
  );

  return (
    <>
      <WaitingListComponent
        title="은행 토큰 요청 수락"
        subtitle="토큰 요청"
        subtitleIcon={<Landmark size={18} className="text-pink-500" />}
        items={waitingListItems}
        columns={columns}
        searchPlaceholder="은행명 검색"
        onApprove={handleApprove}
        onReject={handleReject}
        onSearch={handleSearch}
        extraActionButton={extraActionButton}
        rejectModalTitle="토큰 요청 반려 확인"
        rejectModalTargetType="토큰 요청"
        rejectModalActionText="반려"
      />
      
    
    </>
  )
}

// 데이터를 컴포넌트 외부로 이동
const tokenRequests = [
  {
    id: 1,
    date: "2024/12/27",
    bank: "우리은행",
    reason: "가치 유지를 위한 긴급 변경 요청",
    type: "변경 요청",
  },
  {
    id: 2,
    date: "2024/12/26",
    bank: "신한은행",
    reason: "토큰 발행을 위한 변경 요청",
    type: "신규 요청",
  },
];

// 상세 보기용 샘플 데이터 (이제 직접 사용하지 않지만 나중에 필요할 수 있어 유지)
const sampleTokenChanges = [
  {
    symbol: "BTC",
    oldValue: "1.5%",
    newValue: "1.8%",
    status: "+0.3%",
    statusType: "increase" as const
  },
  {
    symbol: "ETH",
    oldValue: "2.1%",
    newValue: "1.9%",
    status: "-0.2%",
    statusType: "decrease" as const
  },
  {
    symbol: "XRP",
    oldValue: "-",
    newValue: "0.8%",
    status: "신규",
    statusType: "new" as const
  }
];

const sampleTokenValues = [
  {
    value: "1 BTC = ₩56,470,000",
    change: "+1.2%",
    changeType: "increase" as const
  },
  {
    value: "1 ETH = ₩3,120,000",
    change: "-0.5%",
    changeType: "decrease" as const
  },
  {
    value: "1 XRP = ₩650",
    change: "+0.8%",
    changeType: "increase" as const
  }
];