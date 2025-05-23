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
      onDisconnect={handleDisconnectMerchantAccount}
    />
  )
}
