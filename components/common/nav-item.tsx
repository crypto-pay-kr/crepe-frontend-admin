'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

// 네비게이션 아이템 타입
interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  exact?: boolean;
  activeUrls?: string[]; // 추가 활성화 URL 배열
}

// 네비게이션 아이템 컴포넌트
export function NavItem({ 
  href, 
  icon: Icon, 
  label, 
  exact = true, 
  activeUrls = [] 
}: NavItemProps) {
  const pathname = usePathname()
  
  // 활성화 상태 확인
  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href) || activeUrls.some(url => pathname.startsWith(url))
  
  return (
    <Link href={href} className="w-full">
      <button 
        className={`flex items-center gap-3 w-full py-2 px-5 rounded-lg cursor-pointer active:scale-95 transition-all ${
          isActive 
            ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md" 
            : "text-gray-300 hover:bg-gray-800"
        }`}
      >
        <Icon size={18} />
        <span className="text-sm font-medium">{label}</span>
      </button>
    </Link>
  )
}