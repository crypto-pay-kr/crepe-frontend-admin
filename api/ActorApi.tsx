const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface GetActorInfoResponse {
    actorId: number;
    actorName: string;
    actorEmail: string;
    actorPhoneNum: string;
    actorRole: string; 
    actorStatus: string;
    suspensionInfo?: SuspensionInfo; 
}

export interface SuspensionInfo {
    type: string;
    suspendedAt: string;
    suspendedUntil?: string;
    reason: string;
    suspensionPeriod: string; 
}

export const fetchActorsByRole = async (
    role: string,
    status?: string, 
    page: number = 0,
    size: number = 10
): Promise<{
    content: GetActorInfoResponse[];
    totalPages: number;
    number: number;
}> => {
    const token = sessionStorage.getItem('accessToken');
    
    // URL 파라미터 동적 생성
    const params = new URLSearchParams({
        role,
        page: page.toString(),
        size: size.toString()
    });
    
    // status가 제공된 경우에만 추가
    if (status) {
        params.append('status', status);
    }
    
    const res = await fetch(
        `${API_BASE_URL}/api/admin/actors?${params}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!res.ok) {
        throw new Error('목록 불러오기 실패');
    }

    return res.json();
};

export const fetchUserTransactionHistory = async (
    actorId: number,
    page: number,
    size: number
) => {
    const token = sessionStorage.getItem('accessToken');
    const res = await fetch(
        `${API_BASE_URL}/api/admin/actors/${actorId}/history?page=${page}&size=${size}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        }
    );

    if (!res.ok) {
        throw new Error('거래 내역 조회 실패');
    }

    return res.json();
};