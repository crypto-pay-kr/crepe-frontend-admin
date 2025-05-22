'use client'
import AccountInfoComponent from "@/components/common/account/AccountInfo"


export default function UserAccountInfo() {
  // 유저용 계좌 연결 해제 처리
  const handleDisconnectUserAccount = (accountId: string, coinName: string) => {
    console.log(`유저 ${coinName} 계좌 연결 해제: ${accountId}`)
    // 실제 구현에서는 API 호출 등을 통해 계좌 연결 해제 처리
  }

  return (
    <AccountInfoComponent
      title="사용자 계좌 정보"
      backPath="/management/user"
      accounts={userAccounts}
      onDisconnect={handleDisconnectUserAccount}
    />
  )
}

// 유저 계좌 데이터 예시
const userAccounts = [
  {
    coinName: "비트코인",
    currency: "BTC", // 추가된 필드
    depositorName: "홍길동",
    coinAccount: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    tagAccount: "",
    balance: {
      fiat: "5,432,100 KRW",
      crypto: "0.15 BTC",
    },
    status: "APPROVED" // 추가된 필드
  },
  {
    coinName: "이더리움",
    currency: "ETH", // 추가된 필드
    depositorName: "홍길동",
    coinAccount: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    tagAccount: "",
    balance: {
      fiat: "2,156,800 KRW",
      crypto: "0.8 ETH",
    },
    status: "APPROVED" // 추가된 필드
  },
  {
    coinName: "리플",
    currency: "XRP", // 추가된 필드
    depositorName: "홍길동",
    coinAccount: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
    tagAccount: "12345678",
    balance: {
      fiat: "987,200 KRW",
      crypto: "2,500 XRP",
    },
    status: "REGISTERING" // 등록 대기 중 상태
  },
  {
    coinName: "도지코인",
    currency: "DOGE", // 추가된 필드
    depositorName: "홍길동",
    coinAccount: "-", // 미등록 상태
    tagAccount: "",
    balance: {
      fiat: "0 KRW",
      crypto: "0 DOGE",
    },
    status: "NOT_REGISTERED" // 미등록 상태
  },
]