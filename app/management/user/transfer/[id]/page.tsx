"use client"

import TransferHistory from "@/components/user/transfer/TransferHistory"
import { useParams } from "next/navigation"


export default function TransferPage() {
  const params = useParams()
    const userId = params.id
  
    return  <TransferHistory 
              userId={userId}
              type="user"
              title="유저 이체내역"
            />
}

