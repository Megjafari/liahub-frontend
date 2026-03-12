import { useState, useEffect } from 'react'
import api from '../services/api'
import { supabase } from '../services/supabase'
import type { User } from '../types'

export function useProfile() {
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setLoading(false)
        return
      }

      try {
        const response = await api.post('/api/Users/me')
        setProfile(response.data)
      } catch {
        console.error('Could not fetch profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const updateProfile = async (data: {
    name?: string
    city?: string
    techStacks?: string[]
  }) => {
    const response = await api.put('/api/Users/me', data)
    setProfile(response.data)
  }

  return { profile, loading, updateProfile }
}