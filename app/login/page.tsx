"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from "../../context/AuthContext";
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';

function LoginPage() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { login } = useAuthContext();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setErrorMessage(null);
            await login(loginId, password);
            router.push('/dashboard');
        } catch (error) {
            setErrorMessage((error as Error).message);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md relative">
                {/* 카드 */}
                <div className="relative bg-white p-10 rounded-2xl border border-pink-100">
                    {/* 헤더 */}
                    <div className="absolute top-5 left-5">
                        <Link href="/" className="text-gray-500 hover:text-[#F47C98] transition-colors flex items-center gap-1 text-sm">
                            <ArrowLeft size={16} />
                            홈으로
                        </Link>
                    </div>
                    
                    <div className="mt-8 text-center">
                        {/* 로고 */}
                        <div className="flex justify-center">
                            <div className="bg-gradient-to-br from-pink-50 to-white p-5 rounded-full w-28 h-28 flex items-center justify-center mb-4">
                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C98] to-rose-500 font-bold text-3xl">CREPE</div>
                            </div>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">관리자 로그인</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            <span className="inline-flex items-center text-gray-500">
                                <Lock size={14} className="mr-1"/> 
                                관리자 전용 페이지입니다
                            </span>
                        </p>
                    </div>
                    
                    {/* 에러 메시지 */}
                    {errorMessage && (
                        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-600">{errorMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* 로그인 폼 */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="loginId" className="block text-sm font-medium text-gray-700 mb-1">
                                    관리자 아이디
                                </label>
                                <input
                                    id="loginId"
                                    name="loginId"
                                    type="text"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#F47C98] focus:border-[#F47C98] sm:text-sm transition-colors"
                                    placeholder="관리자 아이디를 입력하세요"
                                    value={loginId}
                                    onChange={(e) => setLoginId(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    비밀번호
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#F47C98] focus:border-[#F47C98] sm:text-sm transition-colors"
                                        placeholder="비밀번호를 입력하세요"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#F47C98] focus:ring-[#F47C98] border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    로그인 상태 유지
                                </label>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#F47C98] to-[#E06A88] hover:from-[#E06A88] hover:to-[#D15A78] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F47C98] transition-all duration-200 transform hover:translate-y-px"
                            >
                                관리자 로그인
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;