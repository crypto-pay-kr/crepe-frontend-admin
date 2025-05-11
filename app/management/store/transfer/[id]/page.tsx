"use client"

import TransferHistory from "@/components/user/transfer/TransferHistory"
import { useParams } from "next/navigation"


export default function TransferStorePage() {
  const params = useParams()
    const userId = params.id
  
    return <TransferHistory 
              merchantId={userId}
              type="merchant"
              title="가맹점 이체내역"
              backPath={`/management/store`}
            />
}