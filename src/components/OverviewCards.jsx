export default function OverviewCards({ data }) {
  const cards = [
    { label: 'Total Calls', value: data?.total_calls ?? '—' },
    { label: 'Avg Latency (ms)', value: data?.avg_latency_ms?.toFixed ? data.avg_latency_ms.toFixed(1) : '—' },
    { label: 'Success Rate', value: data?.success_rate != null ? `${(data.success_rate*100).toFixed(1)}%` : '—' },
    { label: 'APIs', value: data?.apis ?? '—' },
    { label: 'Consumers', value: data?.consumers ?? '—' },
    { label: 'Active Subs', value: data?.active_subscriptions ?? '—' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">{c.label}</p>
          <p className="text-2xl font-bold text-gray-800">{c.value}</p>
        </div>
      ))}
    </div>
  )
}
