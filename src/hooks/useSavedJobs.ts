import { useState, useEffect } from 'react'
import api from '../services/api'
import { supabase } from '../services/supabase'
import type { SavedJob } from '../types'

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  const fetchSavedJobs = async () => {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      setLoading(false)
      return
    }
    try {
      const response = await api.get('/api/SavedJobs')
      setSavedJobs(response.data)
      setSavedIds(new Set(response.data.map((j: SavedJob) => j.externalJobId)))
    } catch {
      console.error('Could not fetch saved jobs')
    } finally {
      setLoading(false)
    }
  }

  const saveJob = async (job: {
    externalJobId: string
    jobTitle: string
    employer: string
    url: string
  }) => {
    try {
      await api.post('/api/SavedJobs', job)
      await fetchSavedJobs()
    } catch {
      console.error('Could not save job')
    }
  }

  const unsaveJob = async (id: string) => {
    try {
      await api.delete(`/api/SavedJobs/${id}`)
      await fetchSavedJobs()
    } catch {
      console.error('Could not unsave job')
    }
  }

  return { savedJobs, loading, savedIds, saveJob, unsaveJob }
}