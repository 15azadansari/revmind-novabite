const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const getSummary = () =>
  fetch(`${API_URL}/api/summary`).then(r => r.json())

export const getTrends = () =>
  fetch(`${API_URL}/api/trends`).then(r => r.json())

export const getProducts = () =>
  fetch(`${API_URL}/api/products`).then(r => r.json())

export const askChat = (question) =>
  fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  }).then(r => r.json())