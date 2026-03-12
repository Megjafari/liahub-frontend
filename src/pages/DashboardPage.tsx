import { useState, useEffect } from 'react'
import { useSavedJobs } from '../hooks/useSavedJobs'
import { useApplications } from '../hooks/useApplications'
import { supabase } from '../services/supabase'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { savedJobs, loading: savedLoading } = useSavedJobs()
  const { applications, loading: appLoading } = useApplications()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  if (!session) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Du måste vara inloggad för att se din dashboard.</p>
      </div>
    )
  }

  if (savedLoading || appLoading) return <p className="text-gray-400">Laddar...</p>

  const statusCounts = {
    'Sökt': applications.filter(a => a.status === 'Sökt').length,
    'Intervju': applications.filter(a => a.status === 'Intervju').length,
    'Erbjudande': applications.filter(a => a.status === 'Erbjudande').length,
    'Avslag': applications.filter(a => a.status === 'Avslag').length,
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-2">Översikt över din jobbsökning</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          label="Sparade jobb"
          value={savedJobs.length}
          color="text-yellow-400"
          link="/sparade"
        />
        <StatCard
          label="Ansökningar"
          value={applications.length}
          color="text-blue-400"
          link="/ansokningar"
        />
        <StatCard
          label="Intervjuer"
          value={statusCounts['Intervju']}
          color="text-green-400"
          link="/ansokningar"
        />
      </div>

      {/* Application status breakdown */}
      {applications.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-white">Ansökningar per status</h2>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{status}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: applications.length > 0 ? `${(count / applications.length) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-sm text-gray-300 w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent applications */}
      {applications.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Senaste ansökningar</h2>
            <Link to="/ansokningar" className="text-sm text-blue-400 hover:text-blue-300 transition">
              Visa alla →
            </Link>
          </div>
          <div className="space-y-3">
            {applications.slice(0, 3).map(app => (
              <div key={app.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{app.jobTitle}</p>
                  <p className="text-xs text-gray-500">{app.employer}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  app.status === 'Intervju' ? 'bg-yellow-900 text-yellow-300' :
                  app.status === 'Erbjudande' ? 'bg-green-900 text-green-300' :
                  app.status === 'Avslag' ? 'bg-red-900 text-red-300' :
                  'bg-blue-900 text-blue-300'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color, link }: {
  label: string
  value: number
  color: string
  link: string
}) {
  return (
    <Link to={link} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition space-y-2 block">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </Link>
  )
}