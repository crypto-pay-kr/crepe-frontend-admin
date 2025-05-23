"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from 'axios';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean; 
  login: (loginId: string, password: string, captchaKey?: string, captchaValue?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');

        if (accessToken) {
          setIsAuthenticated(true);

          // 토큰 유효성 검증 (선택적)
          try {
            await checkAuth();
          } catch (error) {
            logout();
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("초기 인증 확인 에러:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); 
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (loginId: string, password: string, captchaKey?: string, captchaValue?: string) => {
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/admin/login`, {
        email: loginId, 
        password,
        captchaKey,
        captchaValue
      });

      const { accessToken, refreshToken, role } = response.data;

      if (role === 'ADMIN') {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        setIsAuthenticated(true);
        return;
      } else {
        throw new Error('관리자 권한이 없습니다.');
      }
    } catch (error) {
      console.error("로그인 에러:", error);

      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || '로그인에 실패했습니다.';
        throw new Error(errorMessage);
      } else {
        throw new Error('로그인에 실패했습니다.');
      }
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    }
    setIsAuthenticated(false);
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');

      if (!accessToken) {
        setIsAuthenticated(false);
        return false;
      }

      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("인증 확인 에러:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('AuthContext가 제공되지 않았습니다.');
  }
  return context;
};