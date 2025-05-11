"use client"

import SuspendedList from "../common/suspended-list";


interface SuspendedBanksListProps {
  onBack: () => void;
}

export default function SuspendedBanksList({ onBack }: SuspendedBanksListProps) {
  // 실제 구현에서는 API를 통해 데이터를 가져올 수 있습니다
  const suspendedBanks = [
    {
      id: 1,
      name: "신한은행",
      suspendedDate: "2025/01/07",
      suspensionPeriod: "30일 이용정지",
      reason: "서비스 이용약관 위반",
    },
    {
      id: 2,
      name: "국민은행",
      suspendedDate: "2025/01/05",
      suspensionPeriod: "60일 이용정지",
      reason: "보안 위반",
    },
    {
      id: 3,
      name: "우리은행",
      suspendedDate: "2025/01/03",
      suspensionPeriod: "30일 이용정지",
      reason: "서비스 이용약관 위반",
    },
    {
      id: 4,
      name: "하나은행",
      suspendedDate: "2024/12/28",
      suspensionPeriod: "90일 이용정지",
      reason: "계약 의무 불이행",
    },
    {
      id: 5,
      name: "농협은행",
      suspendedDate: "2024/12/25",
      suspensionPeriod: "30일 이용정지",
      reason: "서비스 이용약관 위반",
    },
    {
      id: 6,
      name: "기업은행",
      suspendedDate: "2024/12/20",
      suspensionPeriod: "14일 이용정지",
      reason: "서비스 이용약관 위반",
    },
    {
      id: 7,
      name: "SC제일은행",
      suspendedDate: "2024/12/15",
      suspensionPeriod: "30일 이용정지",
      reason: "보안 위반",
    },
    {
      id: 8,
      name: "카카오뱅크",
      suspendedDate: "2024/12/10",
      suspensionPeriod: "7일 이용정지",
      reason: "서비스 이용약관 위반",
    }
  ];

  // 정지 해제 처리
  const handleRemoveSuspension = (ids: number[]) => {
    console.log("은행 이용정지 해제:", ids);
    // 실제 구현에서는 API 호출 등을 통해 이용정지 해제 처리
  };

  return (
    <SuspendedList
      onBack={onBack}
      type="bank"
      items={suspendedBanks}
      onRemoveSuspension={handleRemoveSuspension}
    />
  );
}