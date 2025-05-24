import {Payment} from "@/components/user/payment/PaymentHistory";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL



export const fetchUserPayHistories = async (
    userId: number,
    page = 0,
    size = 10,
    type: string
): Promise<{
    content: Payment[];
    totalPages: number;
    number: number;
}> => {
    const token = sessionStorage.getItem('accessToken');

    const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });
    if (type!="all") {
        queryParams.append('type', type);
    }

    const res = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}/pay-history?${queryParams.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!res.ok) {
        throw new Error('결제 내역 조회 실패');
    }

    return res.json();
};



export const approveRefund = async (payId: number, id: number) => {
    const token = sessionStorage.getItem('accessToken');
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/admin/refund?payId=${payId}&userId=${id}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || '환불 요청 실패');
        }

        const result = await response.text();
        console.log('환불 승인 성공:', result);
        alert('환불 처리가 완료되었습니다.');
    } catch (error) {
        console.error('환불 승인 실패:', error);
        alert('환불 처리 중 오류가 발생했습니다.');
    }
};