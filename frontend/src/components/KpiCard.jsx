export default function KpiCard({ title, value, accentColor = '#7c3aed' }) {
  return (
    <div style={{
      flex: 1,
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      borderLeft: `4px solid ${accentColor}`
    }}>
      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>
        {title}
      </div>
      <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
        {value}
      </div>
    </div>
  )
}