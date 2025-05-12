interface CoinUsageBarProps {
  coin: string
  value: number
  maxValue: number
  color?: string
}

export function CoinUsageBar({ coin, value, maxValue, color = "from-pink-500 to-rose-400" }: CoinUsageBarProps) {
  // 퍼센트 계산
  const percentage = (value / maxValue) * 100
  
  // 화폐 형식으로 포맷팅
  const formattedValue = new Intl.NumberFormat('ko-KR').format(value)
  
  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full bg-gradient-to-r ${color} mr-2`}></span>
          <span className="font-medium text-gray-800">{coin}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-gray-800">{formattedValue} KRW</span>
          <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden backdrop-blur-sm p-0.5">
        <div 
          className={`bg-gradient-to-r ${color} h-full rounded-full shadow-inner transition-all duration-500 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}