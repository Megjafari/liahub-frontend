import { useState, useEffect } from 'react'
import api from '../services/api'
import { supabase } from '../services/supabase'

export function useNotifications() {
  const [active, setActive] = useState(false)
  const [frequency, setFrequency] = useState('daily')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) { setLoading(false); return }
      try {
        const response = await api.get('/api/Notifications')
        setActive(response.data.active)
        setFrequency(response.data.frequency)
      } catch {
        console.error('Could not fetch notification settings')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const updateSettings = async (newActive: boolean, newFrequency?: string) => {
    const response = await api.put('/api/Notifications', {
      active: newActive,
      frequency: newFrequency ?? frequency
    })
    setActive(response.data.active)
    setFrequency(response.data.frequency)
  }

  return { active, frequency, loading, updateSettings }
}