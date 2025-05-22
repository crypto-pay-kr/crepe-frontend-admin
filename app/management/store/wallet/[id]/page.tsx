"use client"

import AccountInfoComponent from "@/components/common/account/AccountInfo"



export default function MerchantAccountInfo() {
  // 가맹점용 계좌 연결 해제 처리
  const handleDisconnectMerchantAccount = (accountId: string, coinName: string) => {
    console.log(`가맹점 ${coinName} 계좌 연결 해제: ${accountId}`)
    // 실제 구현에서는 API 호출 등을 통해 계좌 연결 해제 처리
  }

  return (
    <AccountInfoComponent
      title="가맹점 계좌 정보"
      backPath="/management/store"
      accounts={merchantAccounts}
      onDisconnect={handleDisconnectMerchantAccount}
    />
  )
}

// 가맹점 계좌 데이터 예시
const merchantAccounts = [
  {
    coinName: "비트코인",
    currency: "BTC", // 추가된 필드
    depositorName: "비트코인마트",
    coinAccount: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    tagAccount: "",
    balance: {
      fiat: "12,543,000 KRW",
      crypto: "0.3 BTC",
    },
    status: "APPROVED" // 추가된 필드
  },
  {
    coinName: "이더리움",
    currency: "ETH", // 추가된 필드
    depositorName: "비트코인마트",
    coinAccount: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    tagAccount: "",
    balance: {
      fiat: "3,421,000 KRW",
      crypto: "1.5 ETH",
    },
    status: "APPROVED" // 추가된 필드
  },
]