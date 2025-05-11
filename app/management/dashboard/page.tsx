import { BarChart3, Store, User, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/dashboard/statCard";
import { CoinUsageBar } from "@/components/dashboard/coinUsageBar";

export default function UserDashBoard() {
  return (
    <div className="p-8 bg-gray-50">
      <div className="grid grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<BarChart3 size={22} className="text-white" />}
          label="총 대금 결제량"
          value="10,000,000,000,000,000KRW"
          className="text-center"
        />

        <StatCard 
          icon={<Store size={22} className="text-white" />} 
          label="가맹점 신규 계약 등록 대기" 
          value="35건" 
          className="text-center"
        />

        <StatCard 
          icon={<Store size={22} className="text-white" />} 
          label="총 가맹점 수" 
          value="40명" 
          className="text-center"
        />

        <StatCard 
          icon={<User size={22} className="text-white" />} 
          label="총 개인 유저 수" 
          value="50명" 
          className="text-center"
        />
      </div>

      {/* 통계 섹션 */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <TrendingUp size={20} className="text-pink-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Statistics</h2>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-800">Coin Usage<span className="text-gray-500 text-sm ml-2">(KRW)</span></h3>

            <div className="flex gap-2">
              <button className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-5 py-2 rounded-full text-sm shadow-sm hover:shadow transition-shadow">최근</button>
              <button className="bg-white text-gray-700 px-5 py-2 rounded-full text-sm border border-gray-200 hover:border-pink-200 hover:bg-pink-50 transition-colors">
                3 개월
              </button>
              <button className="bg-white text-gray-700 px-5 py-2 rounded-full text-sm border border-gray-200 hover:border-pink-200 hover:bg-pink-50 transition-colors">
                6 개월
              </button>
              <button className="bg-white text-gray-700 px-5 py-2 rounded-full text-sm border border-gray-200 hover:border-pink-200 hover:bg-pink-50 transition-colors">
                12개월
              </button>
              <button className="bg-white text-gray-700 px-5 py-2 rounded-full text-sm border border-gray-200 hover:border-pink-200 hover:bg-pink-50 transition-colors">
                Total
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <CoinUsageBar coin="XRP(리플)" value={121799} maxValue={150000} color="from-pink-500 to-rose-400" />
            <CoinUsageBar coin="USDT(테더)" value={50799} maxValue={150000} />
            <CoinUsageBar coin="SOL(솔라나)" value={25567} maxValue={150000} />
            <CoinUsageBar coin="KRWT(K-테더)" value={5789} maxValue={150000} />
          </div>
        </div>
      </div>
    </div>
  );
}
