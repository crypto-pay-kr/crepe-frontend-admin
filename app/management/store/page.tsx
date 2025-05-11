"use client"


import ModernMerchantManagement from "@/components/store/management/StoreManagement"
import SuspendedMerchantsList from "@/components/store/management/SuspendedStoresList"
import { useState } from "react"

export default function MerchantManagementPage() {
  const [showSuspendedList, setShowSuspendedList] = useState(false)
  
  return (
    <>
      {showSuspendedList ? (
        <SuspendedMerchantsList onBack={() => setShowSuspendedList(false)} />
      ) : (
        <ModernMerchantManagement onShowSuspendedList={() => setShowSuspendedList(true)} />
      )}
    </>
  )
}