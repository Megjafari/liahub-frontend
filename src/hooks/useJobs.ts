import { useState, useEffect } from 'react'
import api from '../services/api'
import type { Job } from '../types'

export function useJobs(search: string, tech: string, city: string) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (tech) params.append('tech', tech)
        if (city) params.append('city', city)

        const response = await api.get(`/api/Jobs?${params.toString()}`)
        setJobs(response.data)
      } catch {
        setError('Kunde inte hämta annonser.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [search, tech, city])

  return { jobs, loading, error }
}