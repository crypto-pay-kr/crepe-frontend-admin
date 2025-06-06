"use client";
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from "../../context/AuthContext";
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import axios from 'axios';

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface CaptchaResponse {
  captchaKey: string;
  captchaImageUrl: string;
}

function LoginPage() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // CAPTCHA 관련 상태
    const [captchaKey, setCaptchaKey] = useState('');
    const [captchaImageUrl, setCaptchaImageUrl] = useState('');
    const [captchaValue, setCaptchaValue] = useState('');
    const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
    
    // AuthContext 사용 시 예외 처리
    let auth;
    try {
      auth = useAuthContext();
    } catch (e) {
      console.error("AuthContext 오류:", e);
      // 개발 단계에서만 사용할 임시 context - 실 환경에서는 제거
      auth = {
        login: async () => {},
        isAuthenticated: false,
        logout: () => {},
        checkAuth: async () => false
      };
    }
    const { login, isAuthenticated, checkAuth } = auth;
    
    const router = useRouter();

    // 페이지 로드 시 로그인 상태 확인 및 CAPTCHA 생성
    useEffect(() => {
        // 이미 로그인된 상태면 대시보드로 리디렉션
        const checkLoginStatus = async () => {
            const isLoggedIn = await checkAuth();
            if (isLoggedIn) {
                router.push('/management/dashboard');
            }
        };
        
        checkLoginStatus();
        generateCaptcha();
    }, [router, checkAuth]);

    // CAPTCHA 생성 함수
    const generateCaptcha = async () => {
        try {
            setIsCaptchaLoading(true);
            setCaptchaValue(''); // 캡차 이미지 갱신 시 입력값 초기화
            
            // 실제 백엔드 API 호출 - 환경 변수로 API URL 사용
            const response = await axios.get<CaptchaResponse>(`${API_BASE_URL}/api/captcha`);
            
            setCaptchaKey(response.data.captchaKey);
            setCaptchaImageUrl(response.data.captchaImageUrl);
        } catch (error) {
            console.error('CAPTCHA 오류:', error);
            setErrorMessage('보안 코드 새로고침 필요');
        } finally {
            setIsCaptchaLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!captchaKey || !captchaValue) {
            setErrorMessage('보안 코드를 입력해주세요');
            return;
        }
        
        try {
            setIsLoading(true);
            setErrorMessage(null);
            
            // 로그인 요청에 캡차 정보 포함
            await login(loginId, password, captchaKey, captchaValue);
            
            router.push('/management/dashboard');
        } catch (error) {
            if (error instanceof Error) {
                // 에러 메시지 간소화
                const msg = error.message;
                if (msg.includes('관리자 권한이 없습니다')) {
                    setErrorMessage('관리자 권한 없음');
                } else if (msg.includes('로그인에 실패했습니다')) {
                    setErrorMessage('로그인 실패');
                } else {
                    // 긴 에러 메시지 단축
                    setErrorMessage(msg.length > 20 ? msg.substring(0, 20) + '...' : msg);
                }
            } else {
                setErrorMessage('로그인 실패');
            }
            // 로그인 실패 시 새 CAPTCHA 생성
            generateCaptcha();
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-6">
            <div className="w-full max-w-xl relative">
                <div className="relative bg-white p-8 rounded-2xl border border-pink-100">
                    <div className="absolute top-4 left-4">
                        <Link href="/" className="text-gray-500 hover:text-[#F47C98] transition-colors flex items-center gap-1 text-xs">
                            <ArrowLeft size={14} />
                            홈으로
                        </Link>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <div className="flex justify-center">
                            <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-full w-20 h-20 flex items-center justify-center mb-3">
                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C98] to-rose-500 font-bold text-2xl">CREPE</div>
                            </div>
                        </div>
                        <h2 className="mt-2 text-2xl font-bold text-gray-900">관리자 로그인</h2>
                        
                        
                        {/* 매우 작은 에러 메시지 - 헤더 바로 아래 배치 */}
                        {errorMessage && (
                            <div className="mt-1">
                                <span className="inline-flex items-center text-[8px] font-medium text-red-600 bg-red-50 px-1 py-0.5 rounded-sm">
                                    <AlertCircle size={8} className="mr-0.5"/>
                                    {errorMessage}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* 로그인 폼 */}
                    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="loginId" className="block text-xs font-medium text-gray-700 mb-1">
                                    아이디
                                </label>
                                <input
                                    id="loginId"
                                    name="loginId"
                                    type="text"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-4 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#F47C98] focus:border-[#F47C98] sm:text-xs transition-colors"
                                    placeholder="아이디를 입력하세요"
                                    value={loginId}
                                    onChange={(e) => setLoginId(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                                    비밀번호
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-4 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#F47C98] focus:border-[#F47C98] sm:text-xs transition-colors"
                                        placeholder="비밀번호를 입력하세요"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        onClick={togglePasswordVisibility}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            {/* CAPTCHA 영역 */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    보안 코드
                                </label>
                                
                                <div className="flex">
                                    <div className="w-full">
                                        {/* 캡차 이미지 컨테이너 */}
                                        <div className="w-full border border-gray-300 rounded-t-lg overflow-hidden h-32 bg-gray-50 flex items-center justify-center">
                                            {isCaptchaLoading ? (
                                                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#F47C98]"></div>
                                            ) : captchaImageUrl ? (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <img 
                                                        src={captchaImageUrl} 
                                                        alt="보안 코드" 
                                                        className="w-full h-full object-fill"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">이미지 로딩 실패</span>
                                            )}
                                        </div>
                                        
                                        {/* 입력 필드와 새로고침 버튼을 함께 배치 */}
                                        <div className="flex">
                                            <input
                                                type="text"
                                                required
                                                maxLength={8}
                                                className="flex-grow appearance-none rounded-bl-lg rounded-br-none relative block px-4 py-2.5 border border-t-0 border-r-0 border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#F47C98] focus:border-[#F47C98] sm:text-xs transition-colors"
                                                placeholder="보안 코드를 입력하세요"
                                                value={captchaValue}
                                                onChange={(e) => setCaptchaValue(e.target.value)}
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                onClick={generateCaptcha}
                                                className="w-12 border border-t-0 border-l-0 border-gray-300 rounded-br-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
                                                disabled={isCaptchaLoading || isLoading}
                                            >
                                                <RefreshCw size={16} className={isCaptchaLoading ? "animate-spin text-[#F47C98]" : "text-gray-600"} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 세션 기반 로그인 안내 메시지 */}
                        <div className="text-center">
                            <span className="text-xs text-gray-500">
                                🔒 보안을 위해 브라우저 종료 시 자동 로그아웃됩니다
                            </span>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-[#F47C98] to-[#E06A88] hover:from-[#E06A88] hover:to-[#D15A78] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F47C98] transition-all duration-200 transform hover:translate-y-px disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={isLoading || isCaptchaLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5"></span>
                                        로그인 중...
                                    </span>
                                ) : (
                                    "관리자 로그인"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;