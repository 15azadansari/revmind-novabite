import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function RevenueChart({ data }) {
  return (
    <div style={{
      backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginTop: '24px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#111827' }}>
        Monthly Net Revenue Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Line type="monotone" dataKey="net_revenue" stroke="#7c3aed" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}