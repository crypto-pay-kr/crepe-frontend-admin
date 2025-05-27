"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
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
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectAttempts = 5;

  // SSE 연결 설정 (GET 방식)
  const setupSSEConnection = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('토큰이 없어서 SSE 연결을 건너뜁니다.');
      return;
    }

    // 기존 연결이 있다면 해제
    if (eventSourceRef.current) {
      console.log('기존 SSE 연결을 해제합니다.');
      eventSourceRef.current.close();
    }

    // 기존 재연결 타이머 취소
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      console.log('SSE 연결 시도 중...', `${API_BASE_URL}/api/auth/events`);
      console.log('토큰 (앞 50자):', accessToken.substring(0, 50) + '...');
      
      // 토큰을 쿼리 파라미터로 전달 (GET 방식)
      const sseUrl = `${API_BASE_URL}/api/auth/events?token=${encodeURIComponent(accessToken)}`;
      console.log('SSE URL 길이:', sseUrl.length);
      
      // 브라우저 네트워크 요청 확인을 위한 추가 로그
      console.log('💡 개발자 도구 > Network 탭에서 /api/auth/events 요청을 확인해보세요!');
      
      const eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        console.log('✅ SSE 연결이 성공적으로 열렸습니다.');
        console.log('EventSource readyState:', eventSource.readyState); // 1이어야 함
        reconnectAttempts.current = 0; // 성공 시 재연결 카운터 리셋
      };

      // 연결 확인 메시지 (선택적)
      eventSource.addEventListener('connected', (event) => {
        console.log('✅ SSE 연결 확인:', event.data);
      });

      // Keep-alive 메시지 처리 (선택적)
      eventSource.addEventListener('keepalive', (event) => {
        console.log('💓 Keep-alive:', event.data);
      });

      // 모든 메시지 수신 (디버깅용)
      eventSource.onmessage = (event) => {
        console.log('📨 일반 SSE 메시지 수신:', event);
        console.log('   - data:', event.data);
        console.log('   - type:', event.type);
        console.log('   - lastEventId:', event.lastEventId);
      };

      // 중복 로그인 알림 처리
      eventSource.addEventListener('duplicate-login', (event) => {
        console.log('🚨 중복 로그인 감지:', event.data);
        
        // 사용자에게 알림 표시
        alert('다른 기기에서 로그인되어 현재 세션이 종료됩니다.');
        
        // 자동 로그아웃 처리
        handleForceLogout();
      });

      eventSource.onerror = (error) => {
        console.error('❌ SSE 연결 오류:', error);
        console.log('EventSource readyState:', eventSource.readyState);
        console.log('EventSource url:', eventSource.url);
        
        // readyState 설명:
        // 0 = CONNECTING, 1 = OPEN, 2 = CLOSED
        switch(eventSource.readyState) {
          case EventSource.CONNECTING:
            console.log('🔄 SSE 연결 시도 중...');
            break;
          case EventSource.OPEN:
            console.log('✅ SSE 연결이 열려있음');
            break;
          case EventSource.CLOSED:
            console.log('❌ SSE 연결이 닫혔습니다.');
            
            // 자동 재연결 시도 (최대 5회)
            if (reconnectAttempts.current < maxReconnectAttempts) {
              reconnectAttempts.current++;
              const delay = Math.min(1000 * reconnectAttempts.current, 10000); // 최대 10초
              
              console.log(`🔄 ${delay/1000}초 후 재연결 시도 (${reconnectAttempts.current}/${maxReconnectAttempts})`);
              
              reconnectTimeoutRef.current = setTimeout(() => {
                setupSSEConnection();
              }, delay);
            } else {
              console.log('❌ 최대 재연결 시도 횟수 초과');
            }
            break;
          default:
            console.log('❓ 알 수 없는 상태:', eventSource.readyState);
        }
        
        eventSource.close();
      };

      eventSourceRef.current = eventSource;

    } catch (error) {
      console.error('❌ SSE 연결 설정 실패:', error);
    }
  };

  // 강제 로그아웃 처리
  const handleForceLogout = () => {
    console.log('🔄 강제 로그아웃 처리 중...');
    
    // SSE 연결 해제
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    // 토큰 제거 및 상태 업데이트
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    }
    setIsAuthenticated(false);
    
    // 로그인 페이지로 리다이렉트
    console.log('🔄 로그인 페이지로 리다이렉트...');
    window.location.href = '/login';
  };

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');

        if (accessToken) {
          console.log('💾 저장된 토큰 발견, 인증 상태 설정 중...');
          setIsAuthenticated(true);
          
          // SSE 연결 설정
          setupSSEConnection();

          // 토큰 유효성 검증 (선택적)
          try {
            await checkAuth();
          } catch (error) {
            console.error('토큰 검증 실패, 로그아웃 처리:', error);
            logout();
          }
        } else {
          console.log('저장된 토큰이 없습니다.');
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

    // 컴포넌트 언마운트 시 SSE 연결 해제
    return () => {
      console.log('🧹 AuthProvider 언마운트, SSE 연결 정리 중...');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const login = async (loginId: string, password: string, captchaKey?: string, captchaValue?: string) => {
    try {
      console.log('🔐 로그인 시도 중...');
      
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/admin/login`, {
        email: loginId, 
        password,
        captchaKey,
        captchaValue
      });

      const { accessToken, refreshToken, role } = response.data;

      if (role === 'ADMIN') {
        console.log('✅ 관리자 로그인 성공');
        
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        setIsAuthenticated(true);
        
        // 로그인 성공 후 SSE 연결 설정
        setupSSEConnection();
        
        return;
      } else {
        throw new Error('관리자 권한이 없습니다.');
      }
    } catch (error) {
      console.error("❌ 로그인 에러:", error);

      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || '로그인에 실패했습니다.';
        throw new Error(errorMessage);
      } else {
        throw new Error('로그인에 실패했습니다.');
      }
    }
  };

  const logout = () => {
    console.log('🚪 로그아웃 처리 중...');
    
    // SSE 연결 해제
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    }
    setIsAuthenticated(false);
    
    console.log('✅ 로그아웃 완료');
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');

      if (!accessToken) {
        setIsAuthenticated(false);
        return false;
      }

      // 실제 토큰 검증을 원한다면 백엔드 API 호출
      // const response = await axios.post(`${API_BASE_URL}/api/auth/validate-token`, 
      //   { token: accessToken });
      
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