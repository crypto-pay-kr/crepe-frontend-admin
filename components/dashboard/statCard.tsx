import { ReactNode } from "react"

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string
  className?: string
}

export function StatCard({ icon, label, value, className = "" }: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-full w-14 h-14 flex items-center justify-center mb-4 shadow-md">
          {icon}
        </div>
        
        <h3 className="text-gray-600 text-sm font-medium mb-2 text-center">{label}</h3>
        
        <p className="font-bold text-lg text-center text-gray-800">{value}</p>
      </div>
    </div>
  )
}