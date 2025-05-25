"use client"

import { BarChart3, Briefcase, Package, Building2,TrendingUp } from "lucide-react"
import { StatCard } from "@/components/dashboard/statCard";
import { CoinUsageBar } from "@/components/dashboard/coinUsageBar";
import {fetchAllCoinUsage, fetchCoinPrices} from "@/api/dashboard";
import {useEffect, useState} from "react";

export default function BankDashBoard() {
  const [coinUsageList, setCoinUsageList] = useState<CoinUsageDto[]>([]);
  const [coinUsageData, setCoinUsageData] = useState<CoinUsageDto[]>([]);
  const [coinTotal, setCoinTotal] = useState<number | null>(null);
  const [prices, setPrices] = useState<{ [key: string]: number }>({
    "KRW-SOL": 0,
    "KRW-XRP": 0,
    "KRW-USDT": 0,
  });


  interface CoinUsageDto {
    currency: string;
    usageAmount: number;
  }

  const getColorByCoin = (currency: string) => {
    switch (currency.toUpperCase()) {
      case "XRP": return "from-green-500 to-emerald-400";
      case "USDT": return "from-blue-500 to-cyan-400";
      case "SOL": return "from-violet-500 to-purple-400";
      case "KRWT": return "from-pink-500 to-rose-400";
      default: return "from-gray-400 to-gray-500";
    }
  };

  const getKoreanLabel = (currency: string) => {
    switch (currency.toUpperCase()) {
      case "XRP": return "XRP(리플)";
      case "USDT": return "USDT(테더)";
      case "SOL": return "SOL(솔라나)";
      case "KRWT": return "KRWT(K-테더)";
      default: return currency;
    }
  };

  useEffect(() => {
    fetchAllCoinUsage()
        .then(setCoinUsageList)
        .catch(err => console.error(err));
  }, []);

  // 2. 코인 시세 가져오기
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const updatedPrices = await fetchCoinPrices();
        setPrices(updatedPrices);
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalInKRW = coinTotal
      ? Object.entries(coinTotal).reduce((acc, [symbol, amount]) => {
        const numericAmount = typeof amount === "number" ? amount : 0;
        const price = prices[`KRW-${symbol.toUpperCase()}`] ?? 0;
        return acc + numericAmount * price;
      }, 0)
      : 0;



  return (
    <div className="p-8 bg-gray-50">
      <div className="grid grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<BarChart3 size={22} className="text-white" />}
          label="총 통화량"
          value="15,000,000,000,000KRW"
          className="text-center"
        />

        <StatCard 
          icon={<Briefcase size={22} className="text-white" />} 
          label="은행토큰 등록 및 변경 대기" 
          value="12건" 
          className="text-center"
        />

        <StatCard 
          icon={<Package size={22} className="text-white" />} 
          label="총 상품 수" 
          value="78개" 
          className="text-center"
        />

        <StatCard 
          icon={<Building2 size={22} className="text-white" />} 
          label="CBDC 참여 은행 개수" 
          value="14개" 
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
            {coinUsageList.map((coin) => (
                <CoinUsageBar
                    key={coin.currency}
                    coin={getKoreanLabel(coin.currency)}
                    value={coin.usageAmount * (prices[`KRW-${coin.currency.toUpperCase()}`] ?? 0)}
                    maxValue={
                      Math.max(
                          ...coinUsageList.map(c =>
                              c.usageAmount * (prices[`KRW-${c.currency.toUpperCase()}`] ?? 0)
                          ),
                          1
                      )
                    }
                    color={getColorByCoin(coin.currency)}
                />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}