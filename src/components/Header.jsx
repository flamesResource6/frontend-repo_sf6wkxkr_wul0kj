import { useState } from 'react'

export default function Header({ onRefresh }) {
  const [period, setPeriod] = useState(new Date().toISOString().slice(0,7))

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">API Gateway Chargeback</h1>
        <p className="text-gray-500">Lifecycle, subscriptions, metrics, and billing</p>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600">Period</label>
        <input
          type="month"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={() => onRefresh && onRefresh(period)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
