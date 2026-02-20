import React from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, BarChart2, Layers, Zap } from 'lucide-react'

interface AssetCardProps {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  rsi: number
  trend: string
  macdSignal: string
  confidence: number
  chartData: Array<{ time: string; value: number }>
  category: string
}

const iconMap: Record<string, React.ReactNode> = {
  forex: <BarChart2 className="text-blue-400" />,
  crypto: <Zap className="text-yellow-400" />,
  indices: <Layers className="text-green-400" />,
  commodities: <TrendingUp className="text-orange-400" />,
}

export const AssetCard: React.FC<AssetCardProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  rsi,
  trend,
  macdSignal,
  confidence,
  chartData,
  category,
}) => (
  <motion.div
    className="bg-slate-900 rounded-xl shadow-lg p-4 flex flex-col gap-3 border border-slate-700 hover:shadow-2xl transition-shadow min-w-[320px]"
    whileHover={{ scale: 1.03 }}
    layout
  >
    <div className="flex items-center gap-2 mb-2">
      {iconMap[category]}
      <span className="font-bold text-lg text-slate-100">{name}</span>
      <span className="ml-auto text-xs text-slate-400">{symbol}</span>
    </div>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-extrabold text-emerald-400">${price.toFixed(4)}</span>
      <span className={`text-sm font-bold ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {change >= 0 ? '+' : ''}
        {change.toFixed(4)} ({changePercent.toFixed(2)}%)
      </span>
    </div>
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`colorValue${symbol}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0f172a" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" hide />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff' }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#34d399"
          fill={`url(#colorValue${symbol})`}
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
    <div className="flex flex-wrap gap-2 mt-2">
      <span className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300">
        RSI: <span className="font-bold text-yellow-400">{rsi}</span>
      </span>
      <span className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300">
        Trend: <span className="font-bold text-blue-400">{trend}</span>
      </span>
      <span className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300">
        MACD: <span className="font-bold text-purple-400">{macdSignal}</span>
      </span>
      <span className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300">
        Confidence: <span className="font-bold text-emerald-400">{confidence}%</span>
      </span>
    </div>
  </motion.div>
)

interface TrendsDashboardProps {
  assets: Array<AssetCardProps>
}

export const TrendsDashboard: React.FC<TrendsDashboardProps> = ({ assets }) => {
  // Group assets by category
  const grouped = assets.reduce(
    (acc, asset) => {
      acc[asset.category] = acc[asset.category] || []
      acc[asset.category].push(asset)
      return acc
    },
    {} as Record<string, AssetCardProps[]>
  )

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(grouped).map(([category, group]) => (
        <section key={category} className="w-full">
          <h2 className="text-2xl font-bold mb-4 text-slate-200 flex items-center gap-2">
            {iconMap[category]}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          <div className="flex flex-wrap gap-6">
            {group.map(asset => (
              <AssetCard key={asset.symbol} {...asset} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
