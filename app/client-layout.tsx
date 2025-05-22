"use client";

import { usePathname } from 'next/navigation';
import { Sidebar } from "@/components/common/sidebar";
import { AuthProvider } from '@/context/AuthContext';

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login' || pathname === '/';

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}