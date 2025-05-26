const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const COIN_PRICE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export async function fetchRoleCounts(): Promise<Record<string, number>> {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/role/count`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '역할 수 조회에 실패했습니다.');
    }

    return response.json();
}

export async function fetchCoinTotalCounts(): Promise<Record<string, number>> {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/coin/total`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '역할 수 조회에 실패했습니다.');
    }

    return response.json();
}

export interface CoinUsageDto {
    currency: string;
    usageAmount: number;
}
export async function fetchAllCoinUsage(): Promise<CoinUsageDto[]> {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("인증 토큰이 없습니다");

    const res = await fetch(`${API_BASE_URL}/api/admin/coin/usage`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) throw new Error(await res.text());

    return res.json();
}

// 코인 시세 가져오기
export const fetchCoinPrices = async () => {
    try {
        const response = await fetch(`${COIN_PRICE_URL}`);
        if (!response.ok) {
            throw new Error(`시세 조회 실패: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // 시세 데이터를 객체 형태로 변환
        const updatedPrices = data.reduce((acc: any, item: any) => {
            acc[item.market] = item.trade_price;

            return acc;
        }, {});

        return updatedPrices; // 시세 데이터 반환
    } catch (err) {
        console.error("Error fetching coin prices:", err);
        throw err; // 에러를 호출한 쪽으로 전달
    }
};