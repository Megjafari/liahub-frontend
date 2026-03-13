import { useState, useEffect } from 'react'
import { useApplications } from '../hooks/useApplications'
import { supabase } from '../services/supabase'
import type { Application } from '../types'
import PageTransition from '../components/PageTransition'

const STATUSES = ['Sökt', 'Intervju', 'Erbjudande', 'Avslag']

const STATUS_COLORS: Record<string, string> = {
  'Sökt': 'bg-blue-900 text-blue-300',
  'Intervju': 'bg-yellow-900 text-yellow-300',
  'Erbjudande': 'bg-green-900 text-green-300',
  'Avslag': 'bg-red-900 text-red-300',
}

export default function ApplicationsPage() {
  const { applications, loading, updateStatus, deleteApplication } = useApplications()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  if (!session) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Du måste vara inloggad för att se dina ansökningar.</p>
      </div>
    )
  }

  if (loading) return <p className="text-gray-400">Laddar ansökningar...</p>

  return (
    <PageTransition>
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Mina ansökningar</h1>
        <p className="text-gray-400 mt-2">{applications.length} ansökningar</p>
      </div>

      {applications.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400">Du har inte loggat någon ansökan ännu.</p>
          <p className="text-gray-500 text-sm mt-2">Markera ett jobb som "Sökt" från jobblistan.</p>
        </div>
      )}

      <div className="space-y-4">
        {applications.map(app => (
          <ApplicationCard
            key={app.id}
            application={app}
            onUpdateStatus={updateStatus}
            onDelete={deleteApplication}
          />
        ))}
      </div>
    </div>
    </PageTransition>
  )
}

function ApplicationCard({ application, onUpdateStatus, onDelete }: {
  application: Application
  onUpdateStatus: (id: string, status: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-white">{application.jobTitle}</h2>
          <p className="text-sm text-gray-400 mt-1">{application.employer}</p>
          <p className="text-xs text-gray-500 mt-1">
            Sökt {new Date(application.appliedAt).toLocaleDateString('sv-SE')}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${STATUS_COLORS[application.status]}`}>
          {application.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map(status => (
          <button
            key={status}
            onClick={() => onUpdateStatus(application.id, status)}
            className={`text-xs px-3 py-1 rounded-lg border transition ${
              application.status === status
                ? 'border-blue-500 text-blue-300 bg-blue-900'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <a
          href={`https://arbetsformedlingen.se/platsbanken/annonser/${application.externalJobId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          Visa annons →
        </a>
        <button
          onClick={() => onDelete(application.id)}
          className="text-sm text-red-400 hover:text-red-300 transition"
        >
          Ta bort
        </button>
      </div>
    </div>
  )
}