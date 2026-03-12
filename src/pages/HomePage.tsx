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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Hitta din LIA-plats</h1>
        <p className="text-gray-400 mt-2">Annonser matchade och rankade efter relevans</p>
      </div>

      {/* Filters */}
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

      {/* States */}
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

      {/* Job list */}
      <div className="space-y-4">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-white">{job.title}</h2>
          <p className="text-sm text-gray-400 mt-1">{job.employer}</p>
          {job.city && <p className="text-sm text-gray-500">{job.city}</p>}
        </div>
        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full whitespace-nowrap">
          {job.relevanceScore}% match
        </span>
      </div>

      {/* Tech tags */}
      {job.techTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {job.techTags.map(tag => (
            <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
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