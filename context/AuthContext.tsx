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
  reissueToken: () => Promise<boolean>; // 추가
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>; // 추가
  manualReconnectSSE: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectAttempts = 5;

  // 토큰 재발행 함수
  const reissueToken = async (): Promise<boolean> => {
    try {
      const refreshToken = sessionStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        console.log('❌ Admin 리프레시 토큰이 없습니다.');
        logout();
        return false;
      }

      console.log('🔄 Admin 토큰 재발행 요청 중...');

      const response = await axios.post(`${API_BASE_URL}/api/auth/reissue`, {
        refreshToken,
        userRole: 'ADMIN' // 백엔드에서 userRole을 요구할 수 있음
      });

      if (response.data.success && response.data.data) {
        console.log('✅ Admin 토큰 재발행 성공');
        
        // 새 토큰들 저장
        sessionStorage.setItem('accessToken', response.data.data.accessToken);
        sessionStorage.setItem('refreshToken', response.data.data.refreshToken);
        
        // SSE 연결도 새 토큰으로 재설정
        setTimeout(() => {
          setupSSEConnection();
        }, 100);
        
        return true;
      } else {
        throw new Error(response.data.message || 'Admin 토큰 재발행 실패');
      }
    } catch (error) {
      console.error('❌ Admin 토큰 재발행 오류:', error);
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('🔄 리프레시 토큰도 만료됨, 로그아웃 처리');
        logout();
      }
      
      return false;
    }
  };

  // API 요청을 위한 fetch 래퍼 함수 (자동 토큰 재발행)
  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const accessToken = sessionStorage.getItem('accessToken');
    
    // 헤더에 토큰 추가
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // 401 오류 시 토큰 재발행 시도
    if (response.status === 401) {
      console.log('🔄 Admin 401 오류 발생, 토큰 재발행 시도');
      
      const reissueSuccess = await reissueToken();
      
      if (reissueSuccess) {
        // 재발행 성공 시 원래 요청 재시도
        const newAccessToken = sessionStorage.getItem('accessToken');
        const retryHeaders = {
          ...options.headers,
          'Authorization': `Bearer ${newAccessToken}`,
          'Content-Type': 'application/json',
        };
        
        response = await fetch(url, {
          ...options,
          headers: retryHeaders,
        });
        
        console.log('✅ Admin 토큰 재발행 후 요청 재시도 성공');
      } else {
        console.log('❌ Admin 토큰 재발행 실패, 로그인 필요');
      }
    }

    return response;
  };

  // Axios 인터셉터 설정 (기존 axios 사용하는 경우)
  useEffect(() => {
    // 요청 인터셉터 - 토큰 자동 첨부
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const accessToken = sessionStorage.getItem('accessToken');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터 - 401 시 자동 토큰 재발행
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          console.log('🔄 Admin Axios 401 오류, 토큰 재발행 시도');
          const reissueSuccess = await reissueToken();
          
          if (reissueSuccess) {
            const newAccessToken = sessionStorage.getItem('accessToken');
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // 컴포넌트 언마운트 시 인터셉터 제거
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // SSE 연결 설정
  const setupSSEConnection = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('🔐 Admin 토큰이 없어서 SSE 연결을 건너뜁니다.');
      return;
    }

    // 기존 연결이 있다면 해제
    if (eventSourceRef.current) {
      console.log('🔄 Admin 기존 SSE 연결을 해제합니다.');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // 기존 재연결 타이머 취소
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      console.log('🔗 Admin SSE 연결 시도 중...', `${API_BASE_URL}/api/auth/events`);
      console.log('🔑 Admin 토큰 (앞 50자):', accessToken.substring(0, 50) + '...');
      
      const sseUrl = `${API_BASE_URL}/api/auth/events?token=${encodeURIComponent(accessToken)}`;
      console.log('📏 Admin SSE URL:', sseUrl);
      
      let connectionStartTime = Date.now();
      const eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        const connectionTime = Date.now() - connectionStartTime;
        console.log(`✅ Admin SSE 연결이 성공적으로 열렸습니다. (${connectionTime}ms)`);
        reconnectAttempts.current = 0;
      };

      // 연결 확인 및 Keep-alive
      eventSource.addEventListener('connected', (event) => {
        console.log('✅ Admin SSE 연결 확인:', event.data);
      });

      eventSource.addEventListener('keepalive', (event) => {
        console.log('💓 Admin Keep-alive:', event.data);
      });

      // 중복 로그인 알림 처리
      eventSource.addEventListener('duplicate-login', (event) => {
        console.log('🚨 Admin 중복 로그인 감지:', event.data);
        alert('다른 기기에서 로그인되어 현재 세션이 종료됩니다.');
        handleForceLogout();
      });

      // 에러 처리
      eventSource.onerror = (error) => {
        const connectionTime = Date.now() - connectionStartTime;
        console.error('❌ Admin SSE 연결 오류:', error);
        console.log(`⏱️ 연결 시도 시간: ${connectionTime}ms`);
        
        if (connectionTime < 100) {
          console.log('⚠️ 빠른 실패 - CORS 또는 네트워크 문제 가능성');
        }
        
        switch(eventSource.readyState) {
          case EventSource.CLOSED:
            console.log('❌ Admin SSE 연결이 닫혔습니다.');
            // SSE 연결 실패 시에도 토큰 재발행 시도
            checkTokenAndReconnect();
            break;
        }
        
        eventSource.close();
      };

      eventSourceRef.current = eventSource;

    } catch (error) {
      console.error('❌ Admin SSE 연결 설정 실패:', error);
    }
  };

  // 토큰 확인 후 재연결 (SSE 전용)
  const checkTokenAndReconnect = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    
    if (!accessToken) {
      console.log('❌ Admin 재연결 시도 중 토큰이 없음');
      return;
    }

    // SSE 연결 실패 시 토큰 재발행 시도
    console.log('🔍 Admin SSE 연결 실패, 토큰 재발행 시도');
    const reissueSuccess = await reissueToken();
    
    if (reissueSuccess) {
      console.log('✅ Admin 토큰 재발행 성공, SSE 재연결');
      // setupSSEConnection은 reissueToken 내부에서 호출됨
    } else {
      // 토큰 재발행 실패 시 일반 재연결 시도
      attemptReconnection();
    }
  };

  // 재연결 시도 로직
  const attemptReconnection = () => {
    if (reconnectAttempts.current < maxReconnectAttempts) {
      reconnectAttempts.current++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current - 1), 30000);
      
      console.log(`🔄 ${delay/1000}초 후 Admin SSE 재연결 시도 (${reconnectAttempts.current}/${maxReconnectAttempts})`);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        setupSSEConnection();
      }, delay);
    } else {
      console.log('❌ Admin SSE 최대 재연결 시도 횟수 초과');
    }
  };

  // 수동 SSE 재연결
  const manualReconnectSSE = () => {
    console.log('🔧 수동 Admin SSE 재연결 시도');
    reconnectAttempts.current = 0;
    setupSSEConnection();
  };

  // 강제 로그아웃 처리
  const handleForceLogout = () => {
    console.log('🔄 Admin 강제 로그아웃 처리 중...');
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    }
    setIsAuthenticated(false);
    
    window.location.href = '/login';
  };

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');

        if (accessToken) {
          console.log('💾 Admin 저장된 토큰 발견, 인증 상태 설정 중...');
          setIsAuthenticated(true);
          
          setTimeout(() => {
            setupSSEConnection();
          }, 100);

          try {
            await checkAuth();
          } catch (error) {
            console.error('Admin 토큰 검증 실패, 토큰 재발행 시도:', error);
            const reissueSuccess = await reissueToken();
            if (!reissueSuccess) {
              logout();
            }
          }
        } else {
          console.log('❌ Admin 저장된 토큰이 없습니다.');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Admin 초기 인증 확인 에러:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); 
      }
    };

    checkLoginStatus();

    return () => {
      console.log('🧹 Admin AuthProvider 언마운트, 정리 중...');
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
      console.log('🔐 Admin 로그인 시도 중...');
      
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
        
        setTimeout(() => {
          setupSSEConnection();
        }, 500);
        
        return;
      } else {
        throw new Error('관리자 권한이 없습니다.');
      }
    } catch (error) {
      console.error("❌ Admin 로그인 에러:", error);

      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || '로그인에 실패했습니다.';
        throw new Error(errorMessage);
      } else {
        throw new Error('로그인에 실패했습니다.');
      }
    }
  };

  const logout = () => {
    console.log('🚪 Admin 로그아웃 처리 중...');
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    }
    setIsAuthenticated(false);
    
    console.log('✅ Admin 로그아웃 완료');
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');

      if (!accessToken) {
        setIsAuthenticated(false);
        return false;
      }

      // 실제 토큰 검증 API 호출 (옵션)
      // const response = await authenticatedFetch(`${API_BASE_URL}/api/auth/validate-token`);
      // if (!response.ok) throw new Error('Token validation failed');
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Admin 인증 확인 에러:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      login, 
      logout, 
      checkAuth,
      reissueToken,        // 추가
      authenticatedFetch,  // 추가
      manualReconnectSSE 
    }}>
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