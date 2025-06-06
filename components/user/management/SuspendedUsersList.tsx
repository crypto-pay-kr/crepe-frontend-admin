"use client"

import { useEffect, useState } from "react";
import SuspendedList from "@/components/common/suspended-list";
import { fetchActorsByRole, GetActorInfoResponse } from "@/api/ActorApi";
import { changeActorStatus } from "@/api/adminApi";

interface SuspendedUsersListProps {
  onBack: () => void;
}

interface SuspendedUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  suspendedDate: string;
  suspensionPeriod: string;
  reason: string;
  suspensionEndDate?: string;
}

export default function SuspendedUsersList({ onBack }: SuspendedUsersListProps) {
  const [suspendedUsers, setSuspendedUsers] = useState<SuspendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 정지된 유저 목록 조회
  const loadSuspendedUsers = async (pageNum: number = 0) => {
    try {
      setLoading(true);
      const result = await fetchActorsByRole("USER", "SUSPENDED", pageNum, 10);
      
      const transformedUsers: SuspendedUser[] = result.content.map((actor: GetActorInfoResponse) => ({
        id: actor.actorId,
        name: actor.actorName,
        email: actor.actorEmail,
        phone: actor.actorPhoneNum,
        suspendedDate: actor.suspensionInfo?.suspendedAt ? 
            new Date(actor.suspensionInfo.suspendedAt).toLocaleDateString('ko-KR') : "미상",
        suspensionPeriod: actor.suspensionInfo?.suspensionPeriod || "정지중", // 백엔드에서 계산된 값 사용
        reason: actor.suspensionInfo?.reason || "사유 없음",
        suspensionEndDate: actor.suspensionInfo?.suspendedUntil
    }));
      
      setSuspendedUsers(transformedUsers);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("정지된 유저 목록 조회 실패:", error);
      setSuspendedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuspendedUsers();
  }, []);

  const handleRemoveSuspension = async (id: number) => {
    try {
      const request = {
        actorId: id,
        action: "UNSUSPEND" as const
      };
      
      const response = await changeActorStatus(request);
      
      setSuspendedUsers(prev => prev.filter(user => user.id !== id));
    
      const remainingUsers = suspendedUsers.filter(user => user.id !== id);
      if (remainingUsers.length === 0 && page > 0) {
        const newPage = page - 1;
        setPage(newPage);
        await loadSuspendedUsers(newPage);
      } else {
        // 서버에서 최신 정지 목록 다시 가져오기
        await loadSuspendedUsers(page);
      }
      
    } catch (error) {
      console.error("정지 해제 실패:", error);
    }
  };

  // 페이지 변경 처리
  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await loadSuspendedUsers(newPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">정지된 유저 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <SuspendedList
      onBack={onBack}
      type="user"
      items={suspendedUsers}
      onRemoveSuspension={handleRemoveSuspension}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}