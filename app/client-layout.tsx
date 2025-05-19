// app/client-layout.tsx
"use client";

import { usePathname } from 'next/navigation';
import { Sidebar } from "@/components/common/sidebar";

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  // 로그인 페이지에는 사이드바를 표시하지 않음
  if (isLoginPage) {
    return <div className="h-screen">{children}</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}