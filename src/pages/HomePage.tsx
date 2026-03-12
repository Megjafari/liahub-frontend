import { useState } from 'react'
import { useJobs } from '../hooks/useJobs'
import type { Job } from '../types'

const TECH_OPTIONS = [
  '.NET', 'C#', 'React', 'TypeScript', 'JavaScript',
  'Java', 'Python', 'Angular', 'Vue', 'Node.js',
  'SQL', 'PostgreSQL', 'Docker', 'Azure', 'AWS'
]

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [tech, setTech] = useState('')
  const [city, setCity] = useState('')

  const { jobs, loading, error } = useJobs(search, tech, city)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Hitta techjobb som matchar dina skills</h1>
        <p className="text-gray-400 mt-2">Annonser rankade efter hur väl de matchar din profil</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Sök titel eller företag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <select
          value={tech}
          onChange={e => setTech(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Alla tekniker</option>
          {TECH_OPTIONS.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Stad..."
          value={city}
          onChange={e => setCity(e.target.value)}
          className="w-40 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {loading && <p className="text-gray-400">Laddar annonser...</p>}
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

      <div className="space-y-4">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
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
          {job.city && <p className="text-sm text-gray-500">{job.city}</p>}
        </div>
        <div className="flex flex-col items-end gap-1">
          {hasMatchData ? (
            <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${
              matchPercent >= 75 ? 'bg-green-900 text-green-300' :
              matchPercent >= 50 ? 'bg-blue-900 text-blue-300' :
              'bg-gray-800 text-gray-400'
            }`}>
              {matchPercent}% match
            </span>
          ) : (
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full whitespace-nowrap">
              {job.relevanceScore}p relevans
            </span>
          )}
        </div>
      </div>

      {/* Tech tags - max 5 + overflow */}
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

      {/* Student signals */}
      {job.studentSignals.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {job.studentSignals.map(signal => (
            <span key={signal} className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-md">
              ✓ {signal}
            </span>
          ))}
        </div>
      )}

      {/* Why this match */}
      {hasMatchData && (
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="text-xs text-gray-500 hover:text-gray-300 transition"
        >
          {showWhy ? '▲ Dölj matchinfo' : '▼ Varför denna match?'}
        </button>
      )}

      {showWhy && (
        <div className="bg-gray-800 rounded-lg p-3 space-y-2 text-xs">
          {job.matchedSkills.length > 0 && (
            <div>
              <span className="text-green-400 font-medium">Matchar dina skills: </span>
              <span className="text-gray-300">{job.matchedSkills.join(', ')}</span>
            </div>
          )}
          {job.missingSkills.length > 0 && (
            <div>
              <span className="text-yellow-400 font-medium">Saknar du: </span>
              <span className="text-gray-300">{job.missingSkills.join(', ')}</span>
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

      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm text-blue-400 hover:text-blue-300 transition"
      >
        Visa annons →
      </a>
    </div>
  )
}