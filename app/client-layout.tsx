"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from "@/components/common/sidebar";
import { AuthProvider, useAuthContext } from '@/context/AuthContext';

// 내부 컴포넌트로 분리하여 AuthContext 사용
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthContext();
  
  const isLoginPage = pathname === '/login' || pathname === '/';

  useEffect(() => {
    // 로딩이 완료된 후에만 리다이렉트 처리
    if (!isLoading) {
      // 로그인된 사용자가 로그인 페이지에 접근하려고 할 때 리다이렉트
      if (isAuthenticated && isLoginPage) {
        router.push('/dashboard'); // 또는 원하는 기본 페이지로 리다이렉트
      }
      // 로그인하지 않은 사용자가 보호된 페이지에 접근하려고 할 때 리다이렉트
      else if (!isAuthenticated && !isLoginPage) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  // 로딩 중일 때는 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 리다이렉트 처리 중일 때는 아무것도 렌더링하지 않음
  if (isAuthenticated && isLoginPage) {
    return null;
  }

  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return (
    <>
      {isLoginPage ? (
        <div className="h-screen">{children}</div>
      ) : (
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      )}
    </>
  );
}

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}