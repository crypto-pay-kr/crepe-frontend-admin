"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from 'axios';

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (loginId: string, password: string, captchaKey?: string, captchaValue?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      // sessionStorage에서 토큰 가져오기
      const accessToken = sessionStorage.getItem('accessToken');

      if (accessToken) {
        // 토큰이 있으면 로그인 상태로 설정
        setIsAuthenticated(true);

        // 토큰 유효성 검증 (선택적)
        try {
          await checkAuth();
        } catch (error) {
          // 토큰이 만료되었거나 유효하지 않은 경우 로그아웃
          logout();
        }
      } else {
        // 토큰이 없으면 로그아웃 상태
        setIsAuthenticated(false);
      }
    };

    checkLoginStatus();
  }, []);

  // 로그인 함수
  const login = async (loginId: string, password: string, captchaKey?: string, captchaValue?: string) => {
    try {
      // 관리자 로그인 API 엔드포인트로 변경
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/admin/login`, {
        email: loginId, // API에서는 'email'로 요청하도록 되어 있음
        password,
        captchaKey,
        captchaValue
      });

      const { accessToken, refreshToken, role } = response.data;

      if (role === 'ADMIN') {
        // sessionStorage에 토큰 저장 (보안성 향상)
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        setIsAuthenticated(true);
        return;
      } else {
        throw new Error('관리자 권한이 없습니다.');
      }
    } catch (error) {
      console.error("로그인 에러:", error);

      // 서버 응답에서 오류 메시지 추출
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || '로그인에 실패했습니다.';
        throw new Error(errorMessage);
      } else {
        throw new Error('로그인에 실패했습니다.');
      }
    }
  };

  // 로그아웃 함수
  const logout = () => {
    if (typeof window !== 'undefined') {
      // sessionStorage에서 토큰 제거
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    }
    setIsAuthenticated(false);
  };

  // 토큰 유효성 검증 함수
  const checkAuth = async (): Promise<boolean> => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');

      if (!accessToken) {
        setIsAuthenticated(false);
        return false;
      }

      // 현재는 토큰이 있으면 로그인 상태로 간주
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("인증 확인 에러:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
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