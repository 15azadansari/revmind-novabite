import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#7c3aed', '#059669', '#dc2626', '#2563eb']

export default function CategoryChart({ data }) {
  return (
    <div style={{
      backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginTop: '24px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#111827' }}>
        Net Revenue by Category
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Bar dataKey="net_revenue" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}