import { useState } from 'react'
import { askChat } from '../api'

export default function Chat() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError('')
    setAnswer('')

    try {
      const res = await askChat(question)
      if (res.error) {
        setError(res.error)
      } else {
        setAnswer(res.answer)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <h2 style={{ color: '#111827', marginBottom: '20px' }}>Ask RevMind AI</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Which region had the highest net revenue in Q1 2024?"
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '8px',
            border: '1px solid #d1d5db', fontSize: '14px'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px', borderRadius: '8px', border: 'none',
            backgroundColor: '#7c3aed', color: 'white', fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {loading && (
        <div style={{ padding: '20px', color: '#6b7280' }}>
          Analyzing data, please wait...
        </div>
      )}

      {error && (
        <div style={{
          padding: '16px', backgroundColor: '#fee2e2', color: '#991b1b',
          borderRadius: '8px', marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      {answer && !loading && (
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)', lineHeight: '1.6', color: '#111827'
        }}>
          <strong style={{ display: 'block', marginBottom: '8px', color: '#7c3aed' }}>Answer:</strong>
          {answer}
        </div>
      )}
    </div>
  )
}