const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
export interface SuspensionRequest {
  actorId: number;
  action: "SUSPEND" | "UNSUSPEND";
  suspensionRequest?: {
    type: "TEMPORARY" | "PERMANENT";
    days?: number;
    reason: string;
  };
}

export interface SuspensionResponse {
  userId: number;
  message: string;
  actorStatus: "ACTIVE" | "SUSPENDED";
  suspensionInfo?: {
    type: "TEMPORARY" | "PERMANENT";
    startDate: string;
    endDate?: string;
    reason: string;
  };
}

export const changeActorStatus = async (request: SuspensionRequest): Promise<SuspensionResponse> => {
  const token = sessionStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/api/admin/actor/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error('정지 처리 중 오류가 발생했습니다.');
  }

  return response.json();
};