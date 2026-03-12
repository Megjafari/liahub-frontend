import { useSavedJobs } from '../hooks/useSavedJobs'
import { supabase } from '../services/supabase'
import { useState, useEffect } from 'react'

export default function SavedJobsPage() {
  const { savedJobs, loading, unsaveJob } = useSavedJobs()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  if (!session) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Du måste vara inloggad för att se sparade jobb.</p>
      </div>
    )
  }

  if (loading) return <p className="text-gray-400">Laddar sparade jobb...</p>

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Sparade jobb</h1>
        <p className="text-gray-400 mt-2">{savedJobs.length} sparade annonser</p>
      </div>

      {savedJobs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400">Du har inga sparade jobb ännu.</p>
        </div>
      )}

      <div className="space-y-4">
        {savedJobs.map(job => (
          <div key={job.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-white">{job.jobTitle}</h2>
                <p className="text-sm text-gray-400 mt-1">{job.employer}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Sparad {new Date(job.savedAt).toLocaleDateString('sv-SE')}
                </p>
              </div>
              <button
                onClick={() => unsaveJob(job.id)}
                className="text-xs text-red-400 hover:text-red-300 transition whitespace-nowrap"
              >
                Ta bort
              </button>
            </div>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-blue-400 hover:text-blue-300 transition"
            >
              Visa annons →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}