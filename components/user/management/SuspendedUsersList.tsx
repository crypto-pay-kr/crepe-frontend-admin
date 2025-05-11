"use client"

import SuspendedList from "@/components/common/suspended-list";

interface SuspendedUsersListProps {
  onBack: () => void;
}

export default function SuspendedUsersList({ onBack }: SuspendedUsersListProps) {
  // 실제 구현에서는 API를 통해 데이터를 가져올 수 있습니다
  const suspendedUsers = [
    {
      id: 1,
      name: "유저 닉네임",
      suspendedDate: "2025/01/07",
      suspensionPeriod: "7일 이용정지",
      reason: "문의 내역 게인정보 남겨 신고사항 게인거래 유도",
    },
    {
      id: 2,
      name: "유저 닉네임",
      suspendedDate: "2025/01/07",
      suspensionPeriod: "7일 이용정지",
      reason: "문의 내역 게인정보 남겨 신고사항 게인거래 유도",
    },
    {
      id: 3,
      name: "유저 닉네임",
      suspendedDate: "2025/01/07",
      suspensionPeriod: "7일 이용정지",
      reason: "문의 내역 게인정보 남겨 신고사항 게인거래 유도",
    },
    {
      id: 4,
      name: "유저 닉네임",
      suspendedDate: "2025/01/07",
      suspensionPeriod: "7일 이용정지",
      reason: "문의 내역 게인정보 남겨 신고사항 게인거래 유도",
    },
    {
      id: 5,
      name: "유저 닉네임",
      suspendedDate: "2025/01/07",
      suspensionPeriod: "7일 이용정지",
      reason: "문의 내역 게인정보 남겨 신고사항 게인거래 유도",
    },
    {
      id: 6,
      name: "유저 닉네임",
      suspendedDate: "2025/01/07",
      suspensionPeriod: "7일 이용정지",
      reason: "문의 내역 게인정보 남겨 신고사항 게인거래 유도",
    },
    {
      id: 7,
      name: "유저 닉네임",
      suspendedDate: "2025/01/07",
      suspensionPeriod: "7일 이용정지",
      reason: "문의 내역 게인정보 남겨 신고사항 게인거래 유도",
    },
    {
      id: 8,
      name: "유저 닉네임",
      suspendedDate: "2025/01/07",
      suspensionPeriod: "7일 이용정지",
      reason: "문의 내역 게인정보 남겨 신고사항 게인거래 유도",
    },
    {
      id: 9,
      name: "유저 닉네임",
      suspendedDate: "2025/01/07",
      suspensionPeriod: "7일 이용정지",
      reason: "문의 내역 게인정보 남겨 신고사항 게인거래 유도",
    },
    {
      id: 10,
      name: "유저 닉네임",
      suspendedDate: "2025/01/07",
      suspensionPeriod: "7일 이용정지",
      reason: "문의 내역 게인정보 남겨 신고사항 게인거래 유도",
    },
  ];

  // 정지 해제 처리
  const handleRemoveSuspension = (ids: number[]) => {
    console.log("유저 이용정지 해제:", ids);
    // 실제 구현에서는 API 호출 등을 통해 이용정지 해제 처리
  };

  return (
    <SuspendedList
      onBack={onBack}
      type="user"
      items={suspendedUsers}
      onRemoveSuspension={handleRemoveSuspension}
    />
  );
}