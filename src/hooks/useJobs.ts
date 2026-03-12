import { useState, useEffect } from 'react'
import api from '../services/api'
import { supabase } from '../services/supabase'
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

        // Get user skills if logged in
        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData.session) {
          try {
            const profileResponse = await api.post('/api/Users/me')
            const userSkills: string[] = profileResponse.data.techStacks || []
            if (userSkills.length > 0) {
              params.append('skills', userSkills.join(','))
            }
          } catch {
            // Not logged in or no profile — skip skills
          }
        }

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