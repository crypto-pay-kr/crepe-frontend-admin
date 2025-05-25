"use client"

import { BarChart3, Store, User, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/dashboard/statCard";
import { CoinUsageBar } from "@/components/dashboard/coinUsageBar";
import { useRouter } from 'next/navigation';
import {useEffect, useState} from "react";
import {fetchCoinTotalCounts, fetchAllCoinUsage, fetchRoleCounts, fetchCoinPrices} from "@/api/dashboard";

export default function UserDashBoard() {
  const router = useRouter();
  const [roleCounts, setRoleCounts] = useState<{ USER: number; SELLER: number }>({ USER: 0, SELLER: 0 });
  const [coinTotal, setCoinTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coinUsageData, setCoinUsageData] = useState<CoinUsageDto[]>([]);
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
      default: return "from-gray-400 to-gray-500";
    }
  };

  const getKoreanLabel = (currency: string) => {
    switch (currency.toUpperCase()) {
      case "XRP": return "XRP(리플)";
      case "USDT": return "USDT(테더)";
      case "SOL": return "SOL(솔라나)";
      default: return currency;
    }
  };

  useEffect(() => {
    fetchRoleCounts()
        .then((data) => {
          setRoleCounts({
            USER: data.USER || 0,
            SELLER: data.SELLER || 0
          });
        })
  }, []);

  useEffect(() => {
    fetchCoinTotalCounts()
        .then((data) => {
          setCoinTotal(data.userCoinTotal);
        })
        .catch((err) => {
          setError(err.message || "조회 실패");
        });
  }, []);


  const [coinUsageList, setCoinUsageList] = useState<CoinUsageDto[]>([]);

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


  const totalUsageInKRW = coinUsageList.reduce((acc, coin) => {
    const price = prices[`KRW-${coin.currency.toUpperCase()}`] ?? 0;
    return acc + coin.usageAmount * price;
  }, 0);

  console.log(coinUsageList);


  return (
      <div className="p-8 bg-gray-50">
        <div className="grid grid-cols-4 gap-6 mb-12">
          <StatCard
              icon={<BarChart3 size={22} className="text-white" />}
              label="총 대금 결제량"
              value={
                totalUsageInKRW > 0
                    ? `${totalUsageInKRW.toLocaleString()} KRW`
                    : "로딩 중..."
              }
              className="text-center"
          />

          <StatCard
              icon={<Store size={22} className="text-white" />}
              label="총 가맹점 수"
              value={`${roleCounts.SELLER}명`}
              className="text-center"
          />

          <StatCard
              icon={<User size={22} className="text-white" />}
              label="총 개인 유저 수"
              value={`${roleCounts.USER}명`}
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

