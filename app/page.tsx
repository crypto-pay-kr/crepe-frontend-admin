import Link from "next/link"
import { ArrowRight, Shield, Zap, BarChart3, CreditCard } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* 헤더 */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-800">Crepe</span>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            암호화폐 결제의 <span className="text-[#F47C98]">새로운 시대</span>를 열다
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Crepe와 함께 안전하고 빠른 암호화폐 결제 시스템을 경험하세요.
            <br />
            가맹점과 사용자 모두에게 최적화된 솔루션을 제공합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-[#F47C98] text-white rounded-full font-medium hover:bg-[#E06A88] transition-colors flex items-center justify-center gap-2"
            >
              시작하기
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">왜 Crepe인가요?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#FFF8E1] flex items-center justify-center mb-4">
              <Shield className="text-[#F47C98]" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">안전한 거래</h3>
            <p className="text-gray-600">블록체인 기술을 활용한 안전한 거래 시스템으로 사용자의 자산을 보호합니다.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#FFF8E1] flex items-center justify-center mb-4">
              <Zap className="text-[#F47C98]" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">빠른 처리 속도</h3>
            <p className="text-gray-600">최적화된 결제 프로세스로 빠른 거래 처리 속도를 제공합니다.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#FFF8E1] flex items-center justify-center mb-4">
              <BarChart3 className="text-[#F47C98]" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">실시간 분석</h3>
            <p className="text-gray-600">거래 데이터를 실시간으로 분석하여 비즈니스 인사이트를 제공합니다.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#FFF8E1] flex items-center justify-center mb-4">
              <CreditCard className="text-[#F47C98]" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">다양한 결제 옵션</h3>
            <p className="text-gray-600">XRP, USDT, SOL 등 다양한 암호화폐를 통한 결제를 지원합니다.</p>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="bg-black py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">지금 바로 시작하세요</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Crepe와 함께 암호화폐 결제의 새로운 경험을 시작하세요. 간단한 가입 절차로 빠르게 시작할 수 있습니다.
          </p>
          <Link
            href="/register"
            className="px-8 py-3 bg-[#F47C98] text-white rounded-full font-medium hover:bg-[#E06A88] transition-colors inline-flex items-center gap-2"
          >
            무료로 시작하기
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <span className="text-lg font-bold text-gray-800">Crepe</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                회사 소개
              </Link>
              <Link href="/features" className="text-gray-600 hover:text-gray-900">
                주요 기능
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                요금제
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                문의하기
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                이용약관
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                개인정보처리방침
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Crepe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
