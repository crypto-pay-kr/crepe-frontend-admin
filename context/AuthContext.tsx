import { createContext, useContext, useState, ReactNode } from "react";
// import { loginApi } from "../api/authApi"; // 실제 API 사용 시 주석 해제

interface AuthContextValue {
    isAuthenticated: boolean;
    login: (loginId: string, password: string) => Promise<void>;
    logout: () => void;
}

// 개발용 더미 데이터
const DUMMY_AUTH_DATA = {
    accessToken: "dummy-access-token-for-development",
    refreshToken: "dummy-refresh-token-for-development",
    role: "ADMIN"
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // 개발용으로 항상 인증됨
    
    const login = async (loginId: string, password: string) => {
        // 개발 단계: 항상 성공하도록 설정
        console.log("개발 모드: 로그인 항상 성공", { loginId, password });
        
        // 더미 데이터 사용
        const { accessToken, refreshToken } = DUMMY_AUTH_DATA;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setIsAuthenticated(true);
        
        // 실제 구현 (개발 완료 후 주석 해제)
        /* 
        try {
            const { accessToken, refreshToken, role } = await loginApi({ loginId, password });
            if (role === 'ADMIN') {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                setIsAuthenticated(true);
            } else {
                throw new Error('관리자 권한이 없습니다.');
            }
        } catch (error) {
            console.error("로그인 에러:", error);
            throw new Error('로그인에 실패했습니다.');
        }
        */
    };
    
    const logout = () => {
        console.log("개발 모드: 로그아웃");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // 개발 단계에서는 로그아웃 후에도 인증 상태 유지 (필요시 아래 주석 해제)
        // setIsAuthenticated(false);
    };
    
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    // 개발 단계: 항상 컨텍스트가 존재하도록 수정
    const context = useContext(AuthContext);
    
    // 컨텍스트가 없어도 개발용 기본값 반환
    if (!context) {
        console.warn('AuthContext가 제공되지 않았지만, 개발 모드에서는 기본값 사용');
        return {
            isAuthenticated: true,
            login: async () => console.log('개발 모드 기본 로그인'),
            logout: () => console.log('개발 모드 기본 로그아웃')
        };
    }
    
    return context;
    
    // 실제 구현 (개발 완료 후 이렇게 수정)
    /*
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('AuthContext가 제공되지 않았습니다.');
    }
    return context;
    */
};