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
      options: { redirectTo: window.location.origin }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold text-white">
            LIA<span className="text-blue-500">hub</span>
          </Link>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">Hitta LIA</Link>
            {session && (
              <>
                <Link to="/sparade" className="hover:text-white transition">Sparade</Link>
                <Link to="/ansokningar" className="hover:text-white transition">Ansökningar</Link>
                <Link to="/profil" className="hover:text-white transition">Profil</Link>
              </>
            )}
          </div>
        </div>
        {session ? (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Logga ut
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            Logga in med Google
          </button>
        )}
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}