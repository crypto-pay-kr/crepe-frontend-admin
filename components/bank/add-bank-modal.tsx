"use client"
import { useState } from "react"
import { X, Upload } from "lucide-react"
import type React from "react"

// 은행 데이터 인터페이스 정의
interface BankData {
  id: string;
  password: string;
  passwordConfirm: string;
  bankName: string;
  bankCode: string;
  managerPhone: string;
  bankImage: File | null;
}

// 모달 컴포넌트 props 인터페이스
interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bankData: BankData) => void;
}

const AddBankModal: React.FC<BankModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<BankData>({
    id: "",
    password: "",
    passwordConfirm: "",
    bankName: "",
    bankCode: "",
    managerPhone: "",
    bankImage: null,
  })

  const [errors, setErrors] = useState({
    passwordMatch: false,
  })

  // 입력 필드 값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // 비밀번호 일치 여부 확인
    if (name === "password" || name === "passwordConfirm") {
      if (name === "password") {
        setErrors({
          ...errors,
          passwordMatch: value !== formData.passwordConfirm && formData.passwordConfirm !== "",
        })
      } else {
        setErrors({
          ...errors,
          passwordMatch: value !== formData.password,
        })
      }
    }
  }

  // 파일 업로드 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        bankImage: e.target.files[0],
      })
    }
  }

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    // 폼 초기화
    setFormData({
      id: "",
      password: "",
      passwordConfirm: "",
      bankName: "",
      bankCode: "",
      managerPhone: "",
      bankImage: null,
    })
    // 모달 닫기
    onClose()
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 계정 정보 섹션 */}
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-md">
              <h3 className="text-md font-semibold mb-4 text-gray-800">계정 정보</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">아이디(이메일 형식)</label>
                  <input
                    type="email"
                    name="id"
                    value={formData.id}
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
                    value={formData.passwordConfirm}
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
                    name="bankName"
                    value={formData.bankName}
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
                  <label className="block text-sm font-medium mb-2 text-gray-700">담당자 휴대폰 번호</label>
                  <input
                    type="tel"
                    name="managerPhone"
                    value={formData.managerPhone}
                    onChange={handleChange}
                    placeholder="예)010-0000-0000 형식으로 입력해주세요"
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
                  />
                </label>
                
                {formData.bankImage && (
                  <div className="mt-3 flex items-center text-sm text-gray-600 bg-green-50 p-2 rounded-md">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>선택된 파일: {formData.bankImage.name}</span>
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
              >
                취소
              </button>
              <button
                type="submit"
                className="w-2/3 p-3 font-medium transition-all flex items-center justify-center gap-2 bg-pink-500 text-white hover:bg-pink-600 shadow-sm hover:shadow rounded-md"
              >
                <span className="text-md">은행 추가하기</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// 아래 CSS를 전역 스타일시트에 추가
// 또는 페이지에 <style jsx global>{`...`}</style> 추가
const globalStyles = `
  /* 커스텀 스크롤바 스타일 */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #F7FAFC;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #CBD5E0;
    border-radius: 20px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #A0AEC0;
  }
  
  /* Firefox의 경우 */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #CBD5E0 #F7FAFC;
  }
`;

export default AddBankModal