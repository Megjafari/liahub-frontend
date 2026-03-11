import { Outlet, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './services/supabase'
import type { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div>
      <nav>
        <Link to="/">Hitta LIA</Link>
        {session && (
          <>
            <Link to="/sparade">Sparade</Link>
            <Link to="/ansokningar">Ansökningar</Link>
            <Link to="/profil">Profil</Link>
          </>
        )}
        {session ? (
          <button onClick={handleLogout}>Logga ut</button>
        ) : (
          <button onClick={handleLogin}>Logga in med Google</button>
        )}
      </nav>
      <Outlet />
    </div>
  )
}