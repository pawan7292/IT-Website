'use client'
import { useState } from 'react'

export default function LeadsDashboard() {
  const [password, setPassword]           = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  function handleLogin() {
    if (password === 'digitalmarmat2024') {
      setIsAuthenticated(true)
    } else {
      alert('Wrong password')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md w-80">
          <h1 className="text-xl font-bold mb-1 text-center">WhatsApp Leads</h1>
          <p className="text-center text-gray-400 text-sm mb-6">Admin access only</p>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-navy text-white py-3 rounded-xl font-bold hover:opacity-90 transition text-sm"
            style={{ background: '#0B1F3A' }}
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#0B1F3A' }}>WhatsApp Leads Dashboard</h1>
        <p className="text-gray-400 text-sm mb-8">Leads collected by the AI chatbot</p>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-semibold mb-3 text-gray-700">Where to find your leads right now</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-500 text-sm">
            <li>Go to <strong>Vercel Dashboard → your project → Logs</strong></li>
            <li>Search for <code className="bg-gray-100 px-1 rounded">[NEW LEAD]</code></li>
            <li>Each lead also arrives as an email to <strong>techdigitalmarmat@gmail.com</strong></li>
          </ol>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold mb-3 text-gray-700">To show leads in real-time here</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-500 text-sm">
            <li>Create a free <strong>Supabase</strong> project and add a <code className="bg-gray-100 px-1 rounded">leads</code> table</li>
            <li>In <code className="bg-gray-100 px-1 rounded">emailLead()</code> inside the whatsapp route, insert a row instead of (or in addition to) sending the email</li>
            <li>Fetch and display rows from Supabase on this page</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
