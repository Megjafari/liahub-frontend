import { useState, useEffect } from 'react'
import { useJobs } from '../hooks/useJobs'
import { useSavedJobs } from '../hooks/useSavedJobs'
import { useApplications } from '../hooks/useApplications'
import { supabase } from '../services/supabase'
import type { Job } from '../types'
import PageTransition from '../components/PageTransition'
import { useAuthModalContext } from '../context/AuthModalContext'

const TECH_OPTIONS = [
  '.NET', 'C#', 'React', 'TypeScript', 'JavaScript',
  'Java', 'Python', 'Angular', 'Vue', 'Node.js',
  'SQL', 'PostgreSQL', 'Docker', 'Azure', 'AWS'
]

function ProgressRing({ percent }: { percent: number }) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  const color = percent >= 80 ? '#4ade80' : percent >= 50 ? '#facc15' : '#6b7280'

  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={radius} fill="none" stroke="#1f2937" strokeWidth="4" />
      <circle
        cx="26" cy="26" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
      />
      <text x="26" y="31" textAnchor="middle" fontSize="11" fontWeight="bold" fill={color}>
        {percent}%
      </text>
    </svg>
  )
}

function formatJobAge(publishedAt: string | null): string {
  if (!publishedAt) return ''
  const days = Math.floor((Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Publicerad idag'
  if (days === 1) return 'Publicerad igår'
  if (days < 7) return `Publicerad ${days} dagar sedan`
  const weeks = Math.floor(days / 7)
  return `Publicerad ${weeks} ${weeks === 1 ? 'vecka' : 'veckor'} sedan`
}

function JobListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3 animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-800 rounded w-2/3" />
              <div className="h-3 bg-gray-800 rounded w-1/3" />
              <div className="h-3 bg-gray-800 rounded w-1/4" />
            </div>
            <div className="w-12 h-12 bg-gray-800 rounded-full" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-800 rounded w-12" />
            <div className="h-6 bg-gray-800 rounded w-16" />
            <div className="h-6 bg-gray-800 rounded w-10" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-800 rounded w-20" />
            <div className="h-3 bg-gray-800 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [city, setCity] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { savedIds, saveJob, unsaveJob, savedJobs } = useSavedJobs()
  const { applications, createApplication } = useApplications()
  const tech = selectedTechs.join(',')
  const { jobs, loading, error, hasMore, loadMore, total } = useJobs(search, tech, city)
  const appliedIds = new Set(applications.map(a => a.externalJobId))
  const { requireAuth } = useAuthModalContext()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsLoggedIn(!!data.session))
  }, [])

  const toggleTech = (t: string) => {
    setSelectedTechs(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  return (
    <PageTransition>
    <div className="space-y-8">

      {/* Hero */}
      <div className="relative pt-4 pb-2">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 text-blue-400 text-xs px-3 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          För studenter inom tech
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
          Hitta techjobb som matchar<br className="hidden sm:block" /> dina skills
        </h1>
        <p className="text-gray-400 mt-3">
          Annonser rankade efter hur väl de matchar din profil
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {['Rankade efter din tech stack', 'Byggd av en student', 'Annonser från Arbetsförmedlingen API'].map(tag => (
            <span key={tag} className="text-xs text-gray-500 bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Sök titel eller företag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Stad..."
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full sm:w-40 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {!isLoggedIn && (
          <div className="flex flex-wrap gap-2">
            {TECH_OPTIONS.map(t => (
              <button
                key={t}
                onClick={() => toggleTech(t)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                  selectedTechs.includes(t)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <JobListSkeleton />}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && jobs.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <p className="text-gray-400">Inga annonser hittades just nu.</p>
          <a
            href="https://www.linkedin.com/jobs/search/?keywords=LIA+systemutvecklare"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition text-sm"
          >
            Hittade inte vad du söker? Sök på LinkedIn →
          </a>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <p className="text-sm text-gray-500">
          {total} annonser matchar din profil
        </p>
      )}

      <div className="space-y-4">
        {jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            isSaved={savedIds.has(job.externalId)}
            isApplied={appliedIds.has(job.externalId)}
            onSave={() => requireAuth(isLoggedIn, () => saveJob({
              externalJobId: job.externalId,
              jobTitle: job.title,
              employer: job.employer,
              url: job.url
            }))}
            onUnsave={() => requireAuth(isLoggedIn, () => {
              const saved = savedJobs.find(s => s.externalJobId === job.externalId)
              if (saved) unsaveJob(saved.id)
            })}
            onApply={() => requireAuth(isLoggedIn, () => createApplication({
              externalJobId: job.externalId,
              jobTitle: job.title,
              employer: job.employer
            }))}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={loadMore}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg transition text-sm"
          >
            Ladda fler ({total - jobs.length} kvar)
          </button>
        </div>
      )}
    </div>
    </PageTransition>
  )
}

function JobCard({ job, isSaved, isApplied, onSave, onUnsave, onApply }: {
  job: Job
  isSaved: boolean
  isApplied: boolean
  onSave: () => void
  onUnsave: () => void
  onApply: () => void
}) {
  const [showWhy, setShowWhy] = useState(false)
  const hasMatchData = job.matchScore > 0
  const visibleTags = job.techTags.slice(0, 5)
  const extraTags = job.techTags.length - 5
  const matchPercent = Math.round(job.matchScore * 100)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-white">{job.title}</h2>
          <p className="text-sm text-gray-400 mt-1">{job.employer}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {job.city && <p className="text-sm text-gray-500">{job.city}</p>}
            {job.workMode && (
              <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                job.workMode === 'Remote' ? 'bg-purple-900 text-purple-300' :
                job.workMode === 'Hybrid' ? 'bg-teal-900 text-teal-300' :
                'bg-gray-800 text-gray-500'
              }`}>
                {job.workMode}
              </span>
            )}
            {job.publishedAt && (
              <p className="text-xs text-gray-600 whitespace-nowrap">{formatJobAge(job.publishedAt)}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          {hasMatchData ? (
            <ProgressRing percent={matchPercent} />
          ) : (
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full whitespace-nowrap">
              {job.relevanceScore}p relevans
            </span>
          )}
          {hasMatchData && (
            <button
              onClick={() => setShowWhy(!showWhy)}
              className="text-xs text-gray-500 hover:text-gray-300 transition whitespace-nowrap"
            >
              {showWhy ? '▲ Dölj' : '▼ Varför?'}
            </button>
          )}
        </div>
      </div>

      {job.techTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {visibleTags.map(tag => (
            <span
              key={tag}
              className={`text-xs px-2 py-1 rounded-md ${
                job.matchedSkills?.includes(tag)
                  ? 'bg-green-900 text-green-300'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              {tag}
            </span>
          ))}
          {extraTags > 0 && (
            <span className="text-xs bg-gray-800 text-gray-500 px-2 py-1 rounded-md">
              +{extraTags} till
            </span>
          )}
        </div>
      )}

      {job.studentSignals.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {job.studentSignals.map(signal => (
            <span key={signal} className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-md">
              ✓ {signal}
            </span>
          ))}
        </div>
      )}

      {showWhy && (
        <div className="bg-gray-800 rounded-lg p-3 space-y-2 text-xs">
          {job.matchedSkills.length > 0 && (
            <div>
              <span className="text-green-400 font-medium">Matchar dina skills: </span>
              <span className="text-gray-300">{job.matchedSkills.join(', ')}</span>
            </div>
          )}
          {job.studentSignals.length > 0 && (
            <div>
              <span className="text-blue-400 font-medium">Studentsignaler: </span>
              <span className="text-gray-300">{job.studentSignals.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          Visa annonsen →
        </a>
        <div className="flex items-center gap-4">
          <button
            onClick={isSaved ? onUnsave : onSave}
            className={`text-sm transition ${
              isSaved ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {isSaved ? '★ Sparad' : '☆ Spara'}
          </button>
          <button
            onClick={onApply}
            disabled={isApplied}
            className={`text-sm transition ${
              isApplied ? 'text-green-400 cursor-default' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {isApplied ? '✓ Sökt' : 'Markera som sökt'}
          </button>
        </div>
      </div>
    </div>
  )
}
