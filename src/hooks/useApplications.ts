import { useState, useEffect } from 'react'
import api from '../services/api'
import { supabase } from '../services/supabase'
import type { Application } from '../types'

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      setLoading(false)
      return
    }
    try {
      const response = await api.get('/api/Applications')
      setApplications(response.data)
    } catch {
      console.error('Could not fetch applications')
    } finally {
      setLoading(false)
    }
  }

  const createApplication = async (data: {
    externalJobId: string
    jobTitle: string
    employer: string
  }) => {
    await api.post('/api/Applications', data)
    await fetchApplications()
  }

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/api/Applications/${id}`, { status })
    await fetchApplications()
  }

  const deleteApplication = async (id: string) => {
    await api.delete(`/api/Applications/${id}`)
    await fetchApplications()
  }

  const createManualApplication = async (data: {
  jobTitle: string
  employer: string
  location?: string
  source?: string
  link?: string
  notes?: string
  status?: string
  }) => {
  await api.post('/api/Applications', {
    externalJobId: crypto.randomUUID(),
    isManual: true,
    ...data
  })
  await fetchApplications()
  }

  return { applications, loading, createApplication, createManualApplication, updateStatus, deleteApplication }
}