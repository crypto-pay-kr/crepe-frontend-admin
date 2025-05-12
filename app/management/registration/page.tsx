'use client'

import React, { useState } from "react"
import { ShoppingBag, FileText } from "lucide-react"
import WaitingListComponent, { WaitingListItem } from "@/components/common/waiting-list"
import { ConfirmationModal } from "@/components/common/confirm-modal"
import MerchantInfoModal from "@/components/bank/store-info-modal"
import UpbitLoginModal from "@/components/bank/upbit-login-modal"

// 유저 계좌 등록에 필요한 추가 필드 정의
interface UserAccountRegistration {
  depositorName: string;
  userType: string;
  coin: string;
  accountNumber: string;
  accountNumber2: string;
}

export default function UserAccountRegistrationPage() {
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [showUpbitModal, setShowUpbitModal] = useState(false);
  const [isLoadingAuthentication, setIsLoadingAuthentication] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WaitingListItem<UserAccountRegistration> | null>(null);
  
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

  const handleReject = (id: number, item: WaitingListItem<UserAccountRegistration>) => {
    console.log(`거절 처리: ${id}`, item);
    // 여기에 API 호출 등 실제 거절 처리 로직 구현
  };

  const handleApprove = (id: number, type: string, item: WaitingListItem<UserAccountRegistration>) => {
    // 선택된 아이템 저장
    setSelectedItem(item);
    
    // 아이템의 approveButtonText에 따라 다른 처리
    if (item.approveButtonText === "해제 완료") {
      // 해제 완료의 경우 확인 모달 표시
      setShowConfirmationModal(true);
    } else if (item.approveButtonText === "변경 완료") {
      // 변경 완료의 경우 가맹점 정보 모달 표시
      setShowMerchantModal(true);
    } else if (item.approveButtonText === "등록완료") {
      // 등록 완료의 경우 가맹점 정보 모달 표시
      setShowMerchantModal(true);
    }
  };

  // 확인 모달에서 확인 버튼 클릭 처리
  const handleConfirmAction = () => {
    setShowConfirmationModal(false);
    
    if (!selectedItem) return;
    
    // 모달 확인 후 승인 처리
    processApproval(selectedItem.id);
  };

  // 가맹점 정보 모달의 다음 버튼 클릭 처리
  const handleMerchantNext = () => {
    setShowMerchantModal(false);
    
    if (!selectedItem) return;
    
    if (selectedItem.approveButtonText === "변경 완료") {
      // 변경 완료의 경우 확인 모달 표시
      setShowConfirmationModal(true);
    } else if (selectedItem.approveButtonText === "등록완료") {
      // 등록 완료의 경우 업비트 로그인 모달 표시
      setShowUpbitModal(true);
    }
  };

  // 업비트 인증 처리
  const handleUpbitAuth = (verificationCode: string) => {
    // 로딩 상태 시작
    setIsLoadingAuthentication(true);
    
    // 실제로는 여기서 API 호출 등으로 인증 프로세스 처리
    setTimeout(() => {
      setIsLoadingAuthentication(false);
      setShowUpbitModal(false);
      
      // 업비트 인증 완료 후 확인 모달 표시
      setShowConfirmationModal(true);
    }, 2000); // 2초 후 완료 처리 (데모용)
  };

  // 실제 승인 처리 로직
  const processApproval = (id: number) => {
    // 처리 후 목록에서 제거하는 예시 로직
    setWaitingListItems(prev => 
      prev.filter(listItem => listItem.id !== id)
    );
    
    // 실제 구현에서는 API 호출 등을 통해 요청 확인 처리
    setSelectedItem(null);
  };

  const handleBulkRegistration = () => {
    setBulkModalOpen(true);
    console.log('일괄 등록 모달 열기');
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

  // 확인 모달 메시지 및 제목 설정
  const getConfirmationModalProps = () => {
    if (!selectedItem) return { title: "", actionText: "", targetName: "" };
    
    let title = "확인";
    let actionText = "";
    
    switch (selectedItem.approveButtonText) {
      case "해제 완료":
        title = "계좌 해제 확인";
        actionText = "해제";
        break;
      case "변경 완료":
        title = "계좌 변경 확인";
        actionText = "변경";
        break;
      case "등록완료":
        title = "계좌 등록 확인";
        actionText = "등록";
        break;
    }
    
    return { 
      title, 
      actionText, 
      targetName: selectedItem.depositorName
    };
  };

  const modalProps = getConfirmationModalProps();

  return (
    <>
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
      
      {/* 확인 모달 */}
      {showConfirmationModal && (
        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleConfirmAction}
          title={modalProps.title}
          targetName={modalProps.targetName}
          targetType="계좌"
          actionText={modalProps.actionText}
        />
      )}
      
      {/* 가맹점 정보 모달 */}
      {showMerchantModal && <MerchantInfoModal onNext={handleMerchantNext} />}
      
      {/* 업비트 로그인 모달 */}
      {showUpbitModal && (
        <UpbitLoginModal 
          onComplete={handleUpbitAuth}
          isLoading={isLoadingAuthentication}
        />
      )}
    </>
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
];