'use client'

import React, {useEffect, useState} from "react"
import { Landmark, ClipboardCheck } from "lucide-react"
import WaitingListComponent, { WaitingListItem } from "@/components/common/waiting-list"
import { ConfirmationModal } from "@/components/common/confirm-modal";
import MerchantInfoModal from "@/components/bank/store-info-modal";
import UpbitLoginModal from "@/components/bank/upbit-login-modal";
import {
  approveUnregisterRequest,
  approveWithdrawAddress,
  fetchPendingWithdrawAddresses,
  rejectAddressRequest
} from "@/api/adminAccountApi";

// 은행 계좌 등록에 필요한 추가 필드 정의
interface BankAccountRegistration {
  depositorName: string;
  userType: string;
  coin: string;
  accountNumber: string;
  accountNumber2: string;
}

export default function BankAccountRegistrationPage() {
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [showUpbitModal, setShowUpbitModal] = useState(false);
  const [isLoadingAuthentication, setIsLoadingAuthentication] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WaitingListItem<BankAccountRegistration> | null>(null);
  const statuses = ['REGISTERING', 'UNREGISTERED_AND_REGISTERING', 'UNREGISTERED'];
  const [waitingListItems, setWaitingListItems] = useState<WaitingListItem<BankAccountRegistration>[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);


  const loadPendingAddresses = async (targetPage: number) => {
    try {
      const result = await fetchPendingWithdrawAddresses(statuses, targetPage, 5,true);

      // 페이지 정보 업데이트
      setCurrentPage(result.number);
      setTotalPages(result.totalPages);
      // 실제 아이템 리스트 설정
      setWaitingListItems(
          result.content.map((item): WaitingListItem<BankAccountRegistration> => ({
            id: item.id,
            requestDate: item.createdAt.split('T')[0],
            name: item.depositor,
            type:'은행',
            approveType: item.addressRegistryStatus,
            approveButtonText: getApproveButtonText(item.addressRegistryStatus),
            depositorName: item.depositor,
            userType: item.userType,
            coin: item.currency,
            accountNumber: item.address,
            accountNumber2: item.tag ?? '-',
          }))
      );
    } catch (e) {
      console.error('계좌 목록 불러오기 실패', e);
    }
  };


  useEffect(() => {
    loadPendingAddresses(0);
  }, []);

  const getApproveButtonText = (status: string) => {
    switch (status) {
      case 'REGISTERING':
        return '등록 완료';
      case 'UNREGISTERED_AND_REGISTERING':
        return '변경 완료';
      case 'UNREGISTERED':
        return '해제 완료';
      default:
        return '승인';
    }
  };

  const handleReject =async (id: number, item: WaitingListItem<BankAccountRegistration>) => {
    await rejectAddressRequest(id);
    await loadPendingAddresses(0);
    console.log(`거절 처리: ${id}`, item);
  };

  const handleApprove = (id: number, type: string, item: WaitingListItem<BankAccountRegistration>) => {
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


  // 계좌 승인 완료
  const handleConfirmAction = async () => {
    setShowConfirmationModal(false);

    if (!selectedItem) return;

    try {
      if (selectedItem.approveButtonText === "해제 완료") {
        await approveUnregisterRequest(selectedItem.id);
      } else {
        await approveWithdrawAddress(selectedItem.id);
      }
      await loadPendingAddresses(0);
    } catch (error) {
      alert("계좌 승인 실패");
    } finally {
      setSelectedItem(null);
    }
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


  const handleSearch = (searchText: string) => {
    console.log('검색어:', searchText);
    // 실제 구현에서는 API 호출 또는 클라이언트 측 필터링
  };

  const handleBulkRegistration = () => {
    setBulkModalOpen(true);
    console.log('일괄 계좌 등록 모달 열기');
  };

  const handleBulkConfirm = (selectedIds: number[]) => {
    console.log('일괄 승인 처리:', selectedIds);
    
    // 처리 후 목록에서 제거하는 예시 로직
    setWaitingListItems(prev => 
      prev.filter(item => !selectedIds.includes(item.id))
    );
    
    // 실제 구현에서는 API 호출 등 실제 일괄 승인 처리 로직 구현
  };

  // 인터페이스 및 컬럼 정의
  interface Column {
    key: string;
    header: string;
    render?: (value: string, item?: WaitingListItem<BankAccountRegistration>) => React.ReactNode;
  }

  const columns: Column[] = [
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
          value === "은행" 
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
      <ClipboardCheck size={16} className="text-pink-500" />
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
        title = "가맹점 정보 변경 확인";
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
        title="은행 계좌 등록 대기 리스트"
        subtitle="신규 정산 계좌 등록 대기"
        subtitleIcon={<Landmark size={18} className="text-pink-500" />}
        items={waitingListItems}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page:number) => {
          setCurrentPage(page);
          loadPendingAddresses(page); // 해당 페이지로 API 요청
        }}
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
          targetType="정보"
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
