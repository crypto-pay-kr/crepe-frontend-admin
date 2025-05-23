"use client"
import { useState } from "react"
import { X, Upload } from "lucide-react"
import type React from "react"
import { useAuthContext } from "@/context/AuthContext" // AuthContext import 추가

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// 은행 데이터 인터페이스 수정 (API 요구사항에 맞게)
interface BankData {
  email: string;          // id -> email로 변경
  password: string;
  name: string;           // bankName -> name으로 변경
  bankCode: string;
  bankPhoneNum: string;   // managerPhone -> bankPhoneNum으로 변경
  managerName: string;    // managerName 추가
}

// 모달 컴포넌트 props 인터페이스
interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (response: any) => void;  // 선택적 콜백 (성공 응답 처리용)
}

const AddBankModal: React.FC<BankModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { isAuthenticated } = useAuthContext(); // AuthContext 사용
  const [formData, setFormData] = useState<BankData>({
    email: "",
    password: "",
    name: "",
    bankCode: "",
    bankPhoneNum: "",
    managerName: "",
  })

  // 비밀번호 확인용 state (API에 보내지 않음)
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [bankImage, setBankImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null) // 이미지 미리보기 추가
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [errors, setErrors] = useState({
    passwordMatch: false,
  })

  // 입력 필드 값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === "passwordConfirm") {
      setPasswordConfirm(value)
      setErrors({
        ...errors,
        passwordMatch: value !== formData.password,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })

      // 비밀번호 필드 변경 시 확인
      if (name === "password") {
        setErrors({
          ...errors,
          passwordMatch: value !== passwordConfirm && passwordConfirm !== "",
        })
      }
    }
  }

  // 파일 업로드 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setBankImage(file)
      
      // 이미지 미리보기 생성
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 이미지 제거 처리
  const handleRemoveImage = () => {
    setBankImage(null)
    setImagePreview(null)
    // 파일 input 초기화
    const fileInput = document.querySelector('input[name="bankImage"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (errors.passwordMatch) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }
    
    if (!bankImage) {
      setError("은행 CI 이미지를 업로드해주세요.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // FormData 생성
      const formDataToSend = new FormData()
      
      // BankData를 JSON 문자열로 변환하여 첨부
      const bankDataBlob = new Blob([JSON.stringify(formData)], {
        type: 'application/json'
      })
      formDataToSend.append('BankData', bankDataBlob)
      
      // 이미지 파일 첨부
      formDataToSend.append('BankCiImage', bankImage)
      const token = localStorage.getItem('accessToken');
    
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }
      // API 요청
      const response = await fetch(`${API_BASE_URL}/api/admin/bank/signup`, {
        method: 'POST',
        body: formDataToSend,
        
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const result = await response.text()
      
      // 콜백 함수가 제공된 경우 호출
      if (onSubmit) {
        onSubmit(result)
      }

      // 폼 초기화
      setFormData({
        email: "",
        password: "",
        name: "",
        bankCode: "",
        bankPhoneNum: "",
        managerName: "",
      })
      setPasswordConfirm("")
      setBankImage(null)
      setImagePreview(null) // 이미지 미리보기도 초기화
      
      // 모달 닫기
      onClose()
    } catch (err: any) {
      console.error("은행 계정 생성 실패:", err)
      setError(err.message || "은행 계정 생성 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] transform transition-all animate-in zoom-in-95 duration-200 overflow-hidden"
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* 모달 헤더 - 고정 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">은행 추가</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* 모달 내용 - 스크롤 가능 */}
        <div 
          className="p-6 overflow-y-auto custom-scrollbar"
          style={{
            maxHeight: 'calc(90vh - 85px)', // 헤더 높이(73px) + 약간의 여유(12px)
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E0 #F7FAFC',
          }}
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 계정 정보 섹션 */}
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-md">
              <h3 className="text-md font-semibold mb-4 text-gray-800">계정 정보</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">아이디(이메일 형식)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="아이디를 입력해주세요"
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">비밀번호</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="영문,숫자, 특수기호를 최소 하나씩 포함한 8~16자리의 비밀번호"
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">비밀번호 확인</label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={passwordConfirm}
                    onChange={handleChange}
                    placeholder="비밀번호를 다시 한번 입력해주세요"
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                    required
                  />
                  {errors.passwordMatch && 
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      비밀번호가 일치하지 않습니다.
                    </p>
                  }
                </div>
              </div>
            </div>

            {/* 은행 정보 섹션 */}
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-md">
              <h3 className="text-md font-semibold mb-4 text-gray-800">은행 정보</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">은행명</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="은행명을 입력해주세요"
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">은행코드</label>
                  <input
                    type="text"
                    name="bankCode"
                    value={formData.bankCode}
                    onChange={handleChange}
                    placeholder="코드를 입력해주세요"
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">담당자 이름</label>
                  <input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    placeholder="예)김크레페"
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">담당자 휴대폰 번호</label>
                  <input
                    type="tel"
                    name="bankPhoneNum"
                    value={formData.bankPhoneNum}
                    onChange={handleChange}
                    placeholder="예)0212345678 형식으로 입력해주세요 (- 없이)"
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 이미지 업로드 섹션 */}
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-md">
              <h3 className="text-md font-semibold mb-4 text-gray-800">은행 CI 이미지</h3>
              
              <div>
                {/* 이미지가 선택되지 않았을 때 업로드 영역 */}
                {!imagePreview && (
                  <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-6 text-gray-600 hover:text-pink-500 transition-colors border-2 border-dashed border-gray-200 bg-white rounded-md">
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center">
                      <Upload size={20} className="text-pink-500" />
                    </div>
                    <span className="font-medium">첨부파일 업로드</span>
                    <p className="text-xs text-gray-500">PNG, JPG 파일 (최대 5MB)</p>
                    <input
                      type="file"
                      name="bankImage"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                      required
                    />
                  </label>
                )}

                {/* 이미지 미리보기 */}
                {imagePreview && (
                  <div className="space-y-3">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="은행 CI 미리보기"
                        className="w-full h-48 object-contain bg-white border border-gray-200 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="이미지 제거"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 bg-green-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{bankImage?.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const fileInput = document.querySelector('input[name="bankImage"]') as HTMLInputElement
                          fileInput?.click()
                        }}
                        className="text-pink-500 hover:text-pink-600 font-medium"
                      >
                        변경
                      </button>
                    </div>

                    {/* 숨겨진 파일 입력 (이미지가 있을 때도 변경 가능하도록) */}
                    <input
                      type="file"
                      name="bankImage"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 버튼 섹션 */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 p-3 font-medium transition-all flex items-center justify-center border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
                disabled={loading}
              >
                취소
              </button>
              <button
                type="submit"
                className="w-2/3 p-3 font-medium transition-all flex items-center justify-center gap-2 bg-pink-500 text-white hover:bg-pink-600 shadow-sm hover:shadow rounded-md"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    처리 중...
                  </>
                ) : (
                  <span className="text-md">은행 추가하기</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddBankModal