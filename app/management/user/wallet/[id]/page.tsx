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
    coinName: "리플",
    depositorName: "박한진",
    coinAccount: "olkdjfierjqnkjkdjf3249udnf982k2nelkn",
    tagAccount: "",
    balance: {
      fiat: "34,543 KRW",
      crypto: "10 XRP",
    },
  },
  {
    coinName: "테더",
    depositorName: "박한진",
    coinAccount: "olkdjfierjqnkjkdjf3249udnf982k2nelkn",
    tagAccount: "32324124523-2343423953",
    balance: {
      fiat: "34,543 KRW",
      crypto: "10 XRP",
    },
  },
]
