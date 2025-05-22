'use client'
import { BarChart3, Users, Store, User, ArrowRight, Building2, FileCheck, Wallet, LogOut } from "lucide-react"
import { NavItem } from "./nav-item"
import { usePathname, useRouter } from 'next/navigation'
import { useAuthContext } from "../../context/AuthContext"
import { useState } from "react"

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // AuthContext 사용
  let auth;
  try {
    auth = useAuthContext();
  } catch (e) {
    console.error("AuthContext 오류:", e);
    auth = {
      isAuthenticated: false,
      login: async () => {},
      logout: () => {},
      checkAuth: async () => false
    };
  }
  const { logout } = auth;
  
  // 경로에 따라 탭 상태 설정
  const isManagementPath = pathname.startsWith('/management');
  const isBankPath = pathname.startsWith('/bank');
  
  // 기본 경로(/)에서는 사용자 관리 탭이 선택된 상태로 표시
  const isDefaultPath = pathname === '/' || pathname === '';
  
  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      logout();
      router.push('/login');
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <div className="w-[240px] bg-gray-900 flex flex-col items-center h-screen overflow-hidden sticky top-0 left-0 pt-10 pb-6 shadow-xl">
      {/* 로고 */}
      <div className="mb-10">
        <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-xl w-[120px] h-[120px] flex items-center justify-center shadow-lg">
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 font-bold text-2xl">CREPE</div>
        </div>
      </div>

      {/* 사이트 바로가기 버튼 */}
      <button 
        onClick={() => window.open('/', '_blank')}
        className="flex items-center justify-between bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full py-3 px-5 w-[200px] mb-10 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
      >
        <span className="text-sm font-medium">사이트 바로가기</span>
        <ArrowRight size={16} />
      </button>

      {/* 관리 섹션 라벨 - 가로 배치 */}
      <div className="w-full px-4 mb-6">
        <div className="flex space-x-2">
          <div 
            onClick={() => window.location.href = '/management/dashboard'}
            className={`flex-1 flex justify-center rounded-lg py-2 px-2 text-gray-200 transition-colors cursor-pointer ${
              isManagementPath || isDefaultPath ? 'bg-gradient-to-r from-pink-500 to-rose-400' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <span className="text-sm font-medium">사용자 관리</span>
          </div>
          <div 
            onClick={() => window.location.href = '/bank/dashboard'}
            className={`flex-1 flex justify-center rounded-lg py-2 px-2 text-gray-200 transition-colors cursor-pointer ${
              isBankPath ? 'bg-gradient-to-r from-pink-500 to-rose-400' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <span className="text-sm font-medium">은행 관리</span>
          </div>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex flex-col gap-4 items-start w-full mt-4 px-4 flex-grow">
        {isBankPath ? (
          <>
            <NavItem 
              href="/bank/dashboard" 
              icon={BarChart3} 
              label="대시보드" 
              exact={true}
            />
            <NavItem 
              href="/bank/management" 
              icon={Building2} 
              label="은행 관리" 
              exact={false}
              activeUrls={['/bank/products', '/bank/wallet']}
            />
            <NavItem 
              href="/bank/token" 
              icon={FileCheck} 
              label="은행 토큰 요청 수락" 
              exact={true}
            />
            <NavItem 
              href="/bank/registration" 
              icon={Users} 
              label="등록대기 리스트" 
              exact={true}
            />
          </>
        ) : (
          <>
            <NavItem 
              href="/management/dashboard" 
              icon={BarChart3} 
              label="대시보드" 
              exact={true}
            />
            <NavItem 
              href="/management/user" 
              icon={User} 
              label="유저" 
              exact={false}
            />
            <NavItem 
              href="/management/store" 
              icon={Store} 
              label="가맹점" 
              exact={false}
            />
            <NavItem 
              href="/management/registration" 
              icon={Users} 
              label="등록대기 리스트" 
              exact={true}
            />
          </>
        )}
      </nav>
      
      {/* 로그아웃 버튼 - 하단에 고정 */}
      <div className="w-full px-4 mt-auto">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg py-3 px-4 transition-colors cursor-pointer active:bg-gray-600"
        >
          <div className="flex items-center">
            <LogOut size={18} className="mr-3" />
            <span className="text-sm font-medium">로그아웃</span>
          </div>
          {isLoggingOut && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
        </button>
      </div>
    </div>
  )
}