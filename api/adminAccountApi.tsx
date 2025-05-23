// const BASE_URL = import.meta.env.VITE_API_SERVER_URL;
interface RawPendingWithdrawAddress {
    id: number;
    createdAt: string;
    depositor: string;
    userType: 'USER' | 'SELLER'| 'BANK';
    currency: string;
    address: string;
    tag: string | null;
    addressRegistryStatus: string;
}

interface PendingAddressApiResponse {
    content: RawPendingWithdrawAddress[];
    totalPages: number;
    totalElements: number;
    number: number; // 현재 페이지 번호
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//출금 주소 등록 요청 조회
export const fetchPendingWithdrawAddresses = async (statuses: string[], page = 0, size = 3, isBankAccount:boolean): Promise<PendingAddressApiResponse> => {
    try {
        const queryString = statuses.map(status => `statuses=${status}`).join('&');

        const response = await fetch(`${API_BASE_URL}/api/admin/address/requests?page=${page}&size=${size}&${queryString}&isBankAccount=${isBankAccount}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiQURNSU4iLCJlbWFpbCI6ImNyZXBlYmFua0BjcmVwZS5jb20iLCJzdWIiOiJjcmVwZWJhbmtAY3JlcGUuY29tIiwiaWF0IjoxNzQ3Nzk3MDYxLCJleHAiOjE3NDc4MDA2NjF9._1_3JuZzSjasNAB19f8o6FppbesEccF091D-dSj87lVbr1gJIIkAuNmuhC8g6QtasoG6SisL7wtogAQwawZ8zQ`
            }
        });

        if (!response.ok) {
            throw new Error(`계좌 목록 호출 실패: ${response.status}`);
        }

        const json = await response.json();

        return json as PendingAddressApiResponse;
    } catch (error) {
        console.error('출금 주소 요청 실패:', error);
        return {
            content: [],
            totalPages: 0,
            totalElements: 0,
            number: 0,
        };
    }
};

//출금 주소 등록 허용
export const approveWithdrawAddress = async (accountId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/address/approve?accountId=${accountId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiQURNSU4iLCJlbWFpbCI6ImNyZXBlYmFua0BjcmVwZS5jb20iLCJzdWIiOiJjcmVwZWJhbmtAY3JlcGUuY29tIiwiaWF0IjoxNzQ3Nzk3MDYxLCJleHAiOjE3NDc4MDA2NjF9._1_3JuZzSjasNAB19f8o6FppbesEccF091D-dSj87lVbr1gJIIkAuNmuhC8g6QtasoG6SisL7wtogAQwawZ8zQ`, // 실제 토큰 삽입
            },
        });

        if (!response.ok) {
            throw new Error(`승인 요청 실패: ${response.status}`);
        }

        return await response.text(); // 메시지 string 반환
    } catch (error) {
        console.error('계좌 승인 실패:', error);
        throw error;
    }
};


// 출금 주소 등록 거절
export const rejectAddressRequest = async (accountId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/address/reject/${accountId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiQURNSU4iLCJlbWFpbCI6ImNyZXBlYmFua0BjcmVwZS5jb20iLCJzdWIiOiJjcmVwZWJhbmtAY3JlcGUuY29tIiwiaWF0IjoxNzQ3Nzk3MDYxLCJleHAiOjE3NDc4MDA2NjF9._1_3JuZzSjasNAB19f8o6FppbesEccF091D-dSj87lVbr1gJIIkAuNmuhC8g6QtasoG6SisL7wtogAQwawZ8zQ`,
            },
        });

        if (!response.ok) {
            throw new Error(`거절 요청 실패: ${response.status}`);
        }

        return await response.text(); // "코인 등록 요청이 거절되었습니다."
    } catch (err) {
        console.error('거절 요청 실패:', err);
        throw err;
    }
};


//출금주소 해지 승인
export const approveUnregisterRequest = async (accountId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/address/unregister/${accountId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiQURNSU4iLCJlbWFpbCI6ImNyZXBlYmFua0BjcmVwZS5jb20iLCJzdWIiOiJjcmVwZWJhbmtAY3JlcGUuY29tIiwiaWF0IjoxNzQ3Nzk3MDYxLCJleHAiOjE3NDc4MDA2NjF9._1_3JuZzSjasNAB19f8o6FppbesEccF091D-dSj87lVbr1gJIIkAuNmuhC8g6QtasoG6SisL7wtogAQwawZ8zQ`,
            },
        });

        if (!response.ok) {
            throw new Error(`해제 승인 실패: ${response.status}`);
        }

        return await response.text();
    } catch (err) {
        console.error('해제 승인 실패:', err);
        throw err;
    }
};