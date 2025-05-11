"use client"

import BankManagement from "@/components/bank/bank-management"
import SuspendedBanksList from "@/components/bank/suspended-bank-list"
import { useState } from "react"

export default function BankManagementPage() {
  const [showSuspendedList, setShowSuspendedList] = useState(false)
  
  return (
    <>
      {showSuspendedList ? (
        <SuspendedBanksList onBack={() => setShowSuspendedList(false)} />
      ) : (
        <BankManagement onShowSuspendedList={() => setShowSuspendedList(true)} />
      )}
    </>
  )
}