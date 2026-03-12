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
    <div>
      <h1>Hitta din LIA-plats</h1>

      {/* Filters */}
      <div>
        <input
          type="text"
          placeholder="Sök titel eller företag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={tech} onChange={e => setTech(e.target.value)}>
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
        />
      </div>

      {/* Results */}
      {loading && <p>Laddar annonser...</p>}
      {error && <p>{error}</p>}
      {!loading && jobs.length === 0 && (
        <div>
          <p>Inga annonser hittades just nu.</p>
          <a
            href="https://www.linkedin.com/jobs/search/?keywords=LIA+systemutvecklare"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hittade inte vad du söker? Sök på LinkedIn →
          </a>
        </div>
      )}

      {/* Job list */}
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  return (
    <div>
      <h2>{job.title}</h2>
      <p>{job.employer}</p>
      {job.city && <p>{job.city}</p>}

      {/* Tech tags */}
      <div>
        {job.techTags.map(tag => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      {/* Student signals */}
      {job.studentSignals.length > 0 && (
        <div>
          {job.studentSignals.map(signal => (
            <span key={signal}>✅ {signal}</span>
          ))}
        </div>
      )}

      <p>Relevans: {job.relevanceScore}</p>

      <a href={job.url} target="_blank" rel="noopener noreferrer">
        Visa annons →
      </a>
    </div>
  )
}