import { useState, useEffect } from 'react'
import api from '../services/api'
import { supabase } from '../services/supabase'
import type { Job } from '../types'

const PAGE_SIZE = 10

export function useJobs(search: string, tech: string, city: string) {
  const [allJobs, setAllJobs] = useState<Job[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (tech) params.append('tech', tech)
        if (city) params.append('city', city)

        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData.session) {
          try {
            const profileResponse = await api.post('/api/Users/me')
            const userSkills: string[] = profileResponse.data.techStacks || []
            if (userSkills.length > 0) {
              params.append('skills', userSkills.join(','))
            }
          } catch {
            // skip
          }
        }

        const response = await api.get(`/api/Jobs?${params.toString()}`)
        setAllJobs(response.data)
      } catch {
        setError('Kunde inte hämta annonser.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [search, tech, city])

  const jobs = allJobs.slice(0, visibleCount)
  const hasMore = visibleCount < allJobs.length
  const loadMore = () => setVisibleCount(prev => prev + PAGE_SIZE)

  return { jobs, loading, error, hasMore, loadMore, total: allJobs.length }
}