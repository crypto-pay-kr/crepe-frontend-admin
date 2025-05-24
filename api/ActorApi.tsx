const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface GetActorInfoResponse {
    actorId: number;
    actorName: string;
    actorEmail: string;
    actorPhoneNum: string;
    actorStatus: string;
}


export const fetchActorsByRole = async (
    role: string,
    page: number = 0,
    size: number = 10
): Promise<{
    content: GetActorInfoResponse[];
    totalPages: number;
    number: number;
}> => {
    const token = sessionStorage.getItem('accessToken');
    const res = await fetch(
        `${API_BASE_URL}/api/admin/actors?role=${role}&page=${page}&size=${size}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // 토큰 필요 시
            }
        }
    );

    if (!res.ok) {
        throw new Error('가맹점 및 유저 목록 불러오기 실패');
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