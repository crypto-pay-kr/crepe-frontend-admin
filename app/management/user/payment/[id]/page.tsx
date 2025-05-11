'use client'
import PaymentHistory from "@/components/user/payment/PaymentHistory"
import { useParams } from "next/navigation"

export default function UserPaymentPage() {
  const params = useParams()
  const userId = params.id

  return <PaymentHistory userId={userId} />
}