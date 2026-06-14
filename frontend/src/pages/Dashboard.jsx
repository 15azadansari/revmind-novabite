import { useState, useEffect } from 'react'
import { getSummary, getTrends, getCategoryBreakdown } from '../api'
import KpiCard from '../components/KpiCard'
import RevenueChart from '../components/RevenueChart'
import CategoryChart from '../components/CategoryChart'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryData, setCategoryData] = useState([])

 useEffect(() => {
  Promise.all([getSummary(), getTrends(), getCategoryBreakdown()])
    .then(([summaryData, trendsData, categoryDataRes]) => {
      setSummary(summaryData)
      setTrends(trendsData)
      setCategoryData(categoryDataRes)
      setLoading(false)
    })
    .catch(err => {
      console.error(err)
      setLoading(false)
    })
}, [])

  if (loading) return <div style={{ padding: '24px' }}>Loading dashboard...</div>
  if (!summary) return <div style={{ padding: '24px' }}>Failed to load data.</div>

  return (
    <div style={{ padding: '24px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <h2 style={{ color: '#111827', marginBottom: '20px' }}>Dashboard</h2>

      <div style={{ display: 'flex', gap: '20px' }}>
        <KpiCard
          title="Total Net Revenue"
          value={`$${summary.total_net_revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          accentColor="#7c3aed"
        />
        <KpiCard
          title="Gross Profit Margin"
          value={`${summary.gross_margin_pct.toFixed(2)}%`}
          accentColor="#059669"
        />
        <KpiCard
          title="Top Region"
          value={summary.top_region}
          accentColor="#dc2626"
        />
      </div>

      <RevenueChart data={trends} />
      <CategoryChart data={categoryData} />
    </div>
  )
}