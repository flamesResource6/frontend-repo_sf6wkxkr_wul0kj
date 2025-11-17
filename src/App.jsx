import { useEffect, useState } from 'react'
import Header from './components/Header'
import OverviewCards from './components/OverviewCards'
import { Table, Section } from './components/Tables'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function api(path, init) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json()
}

export default function App() {
  const [period, setPeriod] = useState(new Date().toISOString().slice(0,7))
  const [overview, setOverview] = useState(null)
  const [apis, setApis] = useState([])
  const [plans, setPlans] = useState([])
  const [subs, setSubs] = useState([])
  const [chargeback, setChargeback] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async (p) => {
    const per = p || period
    setLoading(true)
    setError('')
    try {
      const [ov, apis_, plans_, subs_, cb] = await Promise.all([
        api(`/metrics/overview?period=${per}`),
        api('/apis'),
        api('/plans'),
        api('/subscriptions'),
        api(`/chargeback?period=${per}`)
      ])
      setOverview(ov)
      setApis(apis_)
      setPlans(plans_)
      setSubs(subs_)
      setChargeback(cb.items)
    } catch (e) {
      setError('Failed to load data. Ensure backend is running and DB configured.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const planMap = Object.fromEntries(plans.map(p => [p._id, p]))
  const apiMap = Object.fromEntries(apis.map(a => [a._id, a]))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Header onRefresh={(p)=>{setPeriod(p); load(p)}} />
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded">{error}</div>
        )}
        <OverviewCards data={overview} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section title="APIs">
            <Table
              columns={[
                { header: 'Name', accessor: 'name' },
                { header: 'Version', accessor: 'version' },
                { header: 'Owner', accessor: 'owner' },
                { header: 'Stage', accessor: 'lifecycle_stage' },
                { header: 'Status', accessor: 'status' },
              ]}
              rows={apis}
            />
          </Section>

          <Section title="Plans">
            <Table
              columns={[
                { header: 'Name', accessor: 'name' },
                { header: 'Tier', accessor: 'tier' },
                { header: 'Monthly', accessor: 'monthly_price', render: (v)=> `$${v}` },
                { header: 'Included', accessor: 'included_calls' },
                { header: 'Overage', accessor: 'overage_price_per_call', render: (v)=> `$${v}` },
              ]}
              rows={plans}
            />
          </Section>
        </div>

        <Section title="Active Subscriptions">
          <Table
            columns={[
              { header: 'Consumer', accessor: 'consumer_id' },
              { header: 'API', accessor: 'api_id', render: (v)=> apiMap[v]?.name || v },
              { header: 'Plan', accessor: 'plan_id', render: (v)=> planMap[v]?.name || v },
              { header: 'Status', accessor: 'status' },
              { header: 'Start', accessor: 'start_date', render: (v)=> v ? new Date(v).toLocaleDateString() : '—' },
            ]}
            rows={subs}
          />
        </Section>

        <Section title="Chargeback (Monthly)">
          <Table
            columns={[
              { header: 'Consumer', accessor: 'consumer_id' },
              { header: 'API', accessor: 'api_id', render: (v)=> apiMap[v]?.name || v },
              { header: 'Plan', accessor: 'plan_id', render: (v)=> planMap[v]?.name || v },
              { header: 'Calls', accessor: 'calls' },
              { header: 'Overage', accessor: 'overage_calls' },
              { header: 'Amount', accessor: 'amount', render: (v)=> `$${v}` },
            ]}
            rows={chargeback}
          />
        </Section>

        {loading && <div className="text-center text-gray-500">Loading...</div>}
      </div>
    </div>
  )
}
