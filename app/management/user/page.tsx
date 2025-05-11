"use client"

import SuspendedUsersList from "@/components/user/management/SuspendedUsersList"
import ModernUserManagement from "@/components/user/management/UserManagement"
import { useState } from "react"


export default function UserManagementPage() {
  const [showSuspendedList, setShowSuspendedList] = useState(false)
  
  return (
    <>
      {showSuspendedList ? (
        <SuspendedUsersList onBack={() => setShowSuspendedList(false)} />
      ) : (
        <ModernUserManagement onShowSuspendedList={() => setShowSuspendedList(true)} />
      )}
    </>
  )
}