"use client"
import { X } from "lucide-react"

// API 응답 인터페이스
interface JoinCondition {
  ageGroups: string[]
  occupations: string[]
  incomeLevels: string[]
  allAges: boolean
}

interface PreferentialCondition {
  id: number
  title: string
  rate: number
  description: string
}

interface ProductDetail {
  productName: string
  type: string
  baseInterestRate: number
  joinCondition?: JoinCondition | null
  maxParticipants: number
  subscribeCount?: number  // 현재 가입자 수 추가
  maxMonthlyPayment: number
  rateConditions?: PreferentialCondition[]
  guideFile?: string | null      
  imageUrl?: string | null         
  budget: number
  tags?: string[]
  startDate?: string | null
  endDate?: string | null
}

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: ProductDetail | null
  bankName?: string
}

export default function ProductDetailModal({ isOpen, onClose, product, bankName = "은행" }: ProductDetailModalProps) {
  if (!isOpen || !product) return null

  // 상품 타입 한글 변환
  const getProductTypeText = (type: string) => {
    switch (type) {
      case "SAVING":
        return "예금"
      case "INSTALLMENT":
        return "적금"
      case "VOUCHER":
        return "상품권"
      default:
        return type
    }
  }

  // 날짜 포맷팅 (안전한 체크 포함)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return "정보 없음"
    }
    
    try {
      const date = new Date(dateString)
      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        return "정보 없음"
      }
      
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date)
    } catch (error) {
      console.error('Date formatting error:', error)
      return "정보 없음"
    }
  }
  
  // 금액 포맷팅 (안전한 체크 포함)
  const formatAmount = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined) {
      return "0"
    }
    
    try {
      // BigDecimal이 문자열로 올 경우를 대비
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
      
      if (isNaN(numAmount)) {
        return "0"
      }
      
      return new Intl.NumberFormat('ko-KR').format(numAmount)
    } catch (error) {
      console.error('Amount formatting error:', error)
      return "0"
    }
  }

  // 가입률 계산
  const calculateSubscriptionRate = (current: number, max: number) => {
    if (max === 0) return 0
    return Math.round((current / max) * 100)
  }

  // 가입 조건 텍스트 변환 (안전한 체크 포함)
  const formatJoinCondition = (joinCondition: JoinCondition | null | undefined) => {
    if (!joinCondition) {
      return {
        ageText: "정보 없음",
        occupationText: "정보 없음", 
        incomeText: "정보 없음"
      }
    }

    const ageText = joinCondition.allAges ? "모든 연령" : (joinCondition.ageGroups || []).map(age => {
      switch (age) {
        case "YOUTH": return "청년층"
        case "MIDDLE_AGED": return "중장년층"
        case "SENIOR": return "노년층"
        default: return age
      }
    }).join(", ") || "정보 없음"

    const occupationText = (joinCondition.occupations || []).includes("ALL_OCCUPATIONS") 
      ? "모든 직업" 
      : (joinCondition.occupations || []).join(", ") || "정보 없음"

    const incomeText = (joinCondition.incomeLevels || []).includes("NO_LIMIT") 
      ? "소득 제한 없음" 
      : (joinCondition.incomeLevels || []).join(", ") || "정보 없음"

    return { ageText, occupationText, incomeText }
  }

  // 안전한 기본값 설정
  const safeProduct = {
    ...product,
    baseInterestRate: product.baseInterestRate || 0,
    maxParticipants: product.maxParticipants || 0,
    subscribeCount: product.subscribeCount || 0,  // 기본값 0 설정
    maxMonthlyPayment: product.maxMonthlyPayment || 0,
    budget: product.budget || 0,
    tags: product.tags || [],
    rateConditions: product.rateConditions || [],
    startDate: product.startDate || null,
    endDate: product.endDate || null,
    guideFile: product.guideFile || null,
    imageUrl: product.imageUrl || null
  }

  const { ageText, occupationText, incomeText } = formatJoinCondition(product.joinCondition)
  const subscriptionRate = calculateSubscriptionRate(safeProduct.subscribeCount, safeProduct.maxParticipants)

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div 
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 flex flex-col relative overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-200/30 via-purple-200/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200/30 via-cyan-200/20 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
        
        {/* 헤더 - 고정 */}
        <div className="relative flex justify-between items-center p-8 border-b border-gray-100/80 flex-shrink-0 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 rotate-3 hover:rotate-0 transition-transform duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M9 8H15M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">상품 상세</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-gray-600">{bankName}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-105"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 스크롤 가능한 내용 */}
        <div className="relative flex-1 overflow-y-auto" style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: '#E5E7EB #F9FAFB'
        }}>
          <div className="p-8 space-y-8">
            
            {/* 상품 이미지 */}
            {safeProduct.imageUrl && (
              <div className="group relative bg-gradient-to-br from-gray-50 to-slate-50/50 p-6 rounded-2xl border border-gray-200/60 hover:border-gray-300/60 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-slate-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">상품 이미지</h3>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 overflow-hidden">
                    <img 
                      src={safeProduct.imageUrl} 
                      alt={product.productName}
                      className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => window.open(safeProduct.imageUrl!, '_blank')}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-80 text-gray-500"><p>이미지를 불러올 수 없습니다</p></div>';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 기본 정보 */}
            <div className="group relative bg-gradient-to-br from-slate-50 to-blue-50/50 p-6 rounded-2xl border border-slate-200/60 hover:border-blue-300/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">기본 정보</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                    <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">상품명</label>
                    <p className="text-2xl font-black text-gray-900 tracking-tight">{product.productName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                      <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">상품 종류</label>
                      <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                        {getProductTypeText(product.type)}
                      </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                      <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">기본 금리</label>
                      <p className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {safeProduct.baseInterestRate}%
                      </p>
                    </div>
                  </div>

                  {/* 가입자 수 섹션 - 새로 추가 */}
                  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                    <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">가입 현황</label>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-black text-gray-900">
                        {formatAmount(safeProduct.subscribeCount)} / {formatAmount(safeProduct.maxParticipants)}명
                      </span>
                      <span className="text-sm font-bold text-gray-600">
                        {subscriptionRate}% 달성
                      </span>
                    </div>
                    {/* 진행률 바 */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 transition-all duration-500 ease-out relative"
                        style={{ width: `${Math.min(subscriptionRate, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    {subscriptionRate >= 90 && (
                      <div className="mt-2 text-xs font-bold text-orange-600 flex items-center gap-1">
                        ⚠️ 마감 임박
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">월 최대 입금액</label>
                      <p className="text-lg font-black text-gray-900">{formatAmount(safeProduct.maxMonthlyPayment)}원</p>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">상품 기간</label>
                    <p className="text-lg font-bold text-gray-800">
                      {formatDate(safeProduct.startDate)} ~ {formatDate(safeProduct.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 가입 조건 */}
            <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50/50 p-6 rounded-2xl border border-emerald-200/60 hover:border-emerald-300/60 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">가입 조건</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "가입 연령", value: ageText, icon: "👥" },
                    { label: "직업 조건", value: occupationText, icon: "💼" },
                    { label: "소득 조건", value: incomeText, icon: "💰" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/90 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-semibold text-gray-700">{item.label}</span>
                      </div>
                      <span className="font-bold text-gray-900 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 상품 예산 */}
            <div className="group relative bg-gradient-to-br from-violet-50 to-purple-50/50 p-6 rounded-2xl border border-violet-200/60 hover:border-violet-300/60 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">상품 예산</h3>
                </div>
                <div className="text-center py-6 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50">
                  <div className="text-4xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {formatAmount(safeProduct.budget)}
                  </div>
                  <div className="text-lg font-bold text-gray-600 mt-1">WORIT</div>
                </div>
              </div>
            </div>

            {/* 태그 */}
            {safeProduct.tags && safeProduct.tags.length > 0 && (
              <div className="group relative bg-gradient-to-br from-orange-50 to-amber-50/50 p-6 rounded-2xl border border-orange-200/60 hover:border-orange-300/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">상품 태그</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {safeProduct.tags.map((tag, index) => (
                      <div key={index} className="group/tag relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full blur opacity-75 group-hover/tag:opacity-100 transition-opacity duration-200"></div>
                        <span className="relative px-6 py-2 bg-white font-bold text-gray-800 rounded-full border-2 border-orange-200 hover:border-orange-300 transition-all duration-200 hover:scale-105 cursor-default">
                          #{tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 우대 금리 조건 */}
            {safeProduct.rateConditions && safeProduct.rateConditions.length > 0 && (
              <div className="group relative bg-gradient-to-br from-rose-50 to-pink-50/50 p-6 rounded-2xl border border-rose-200/60 hover:border-rose-300/60 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">우대 금리 조건</h3>
                  </div>
                  <div className="grid gap-4">
                    {safeProduct.rateConditions.map((condition, index) => (
                      <div key={condition.id} className="group/condition relative bg-white/70 backdrop-blur-sm p-5 rounded-xl border border-white/50 hover:bg-white/90 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </div>
                              <h4 className="font-bold text-gray-900 text-lg">{condition.title}</h4>
                            </div>
                            {condition.description && (
                              <p className="text-gray-600 font-medium">{condition.description}</p>
                            )}
                          </div>
                          <div className="ml-4 text-right">
                            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black rounded-full text-lg shadow-lg shadow-rose-500/25">
                              +{condition.rate}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 하단 버튼 - 닫기 버튼만 */}
        <div className="relative border-t border-gray-100/80 p-6 flex-shrink-0 bg-white/90 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="w-full px-6 py-4 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative text-lg tracking-wide">닫기</span>
          </button>
        </div>
      </div>
    </div>
  )
}