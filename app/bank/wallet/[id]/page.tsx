'use client'
import { useParams, useSearchParams } from "next/navigation"
import AccountInfoComponent from "@/components/common/account/AccountInfo"

export default function BankWallet() {
  // URL 파라미터에서 은행 ID 가져오기
  const params = useParams();
  const bankId = params.id;

  // URL 쿼리 파라미터에서 은행 이름 가져오기
  const searchParams = useSearchParams();
  const bankName = searchParams.get('name') || "은행";

  // 은행용 계좌 연결 해제 처리
  const handleDisconnectBankAccount = (accountId: string, coinName: string) => {
    console.log(`${bankName} ${coinName} 계좌 연결 해제: ${accountId}`);
    // 실제 구현에서는 API 호출 등을 통해 계좌 연결 해제 처리
  }

  return (
    <AccountInfoComponent
      title={`${bankName} 계좌 정보`} // 은행 이름을 제목에 포함
      backPath={`/bank/management/${bankId}?name=${encodeURIComponent(bankName)}`} // 은행 상세 페이지로 돌아가기 (은행 ID와 이름 유지)
      accounts={bankAccounts}
      onDisconnect={handleDisconnectBankAccount}
    />
  )
}

// 은행 계좌 데이터 예시
const bankAccounts = [
  {
    coinName: "리플",
    depositorName: "신한은행",
    coinAccount: "szx87n43jnf98xn3k2ncmw90xmu3n4k2l34n2l",
    tagAccount: "",
    balance: {
      fiat: "2,500,000,000 KRW",
      crypto: "750,000 XRP",
    },
  },
  {
    coinName: "테더",
    depositorName: "신한은행",
    coinAccount: "mn4k2lnm23h45k2n3l4k2n3l4k2m3n4k3mn",
    tagAccount: "98765432100-5432109876",
    balance: {
      fiat: "1,800,000,000 KRW",
      crypto: "1,300,000 USDT",
    },
  },
  {
    coinName: "이더리움",
    depositorName: "신한은행",
    coinAccount: "0x743n5k2n3lk45n2k3l4n5k23nl4k5n2kl34",
    tagAccount: "",
    balance: {
      fiat: "3,200,000,000 KRW",
      crypto: "1,200 ETH",
    },
  },
  {
    coinName: "비트코인",
    depositorName: "신한은행",
    coinAccount: "bc1q7cyrfmvx2s9vl58rxp0rh3tz30zv4rn2m9rrksd23ks",
    tagAccount: "",
    balance: {
      fiat: "5,400,000,000 KRW",
      crypto: "85 BTC",
    },
  },
]