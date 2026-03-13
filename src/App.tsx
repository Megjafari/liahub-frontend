import { Outlet, Link,} from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './services/supabase'
import type { Session } from '@supabase/supabase-js'
import Footer from './components/Footer'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)


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

  const closeMenu = () => setMenuOpen(false)

  return (
    <div
      className="min-h-screen bg-gray-950 text-white"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.07) 0%, transparent 60%),
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, 40px 40px, 40px 40px'
      }}
    >
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-white">
              LIA<span className="text-blue-500">Hub</span>
            </Link>
            <div className="hidden sm:flex gap-6 text-sm text-gray-400">
              <Link to="/" className="hover:text-white transition">Hitta LIA</Link>
              {session && (
                <>
                  <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
                  <Link to="/sparade" className="hover:text-white transition">Sparade</Link>
                  <Link to="/ansokningar" className="hover:text-white transition">Ansökningar</Link>
                  <Link to="/profil" className="hover:text-white transition">Profil</Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden sm:block">
            {session ? (
              <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition">
                Logga ut
              </button>
            ) : (
              <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
                Logga in med Google
              </button>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden flex flex-col gap-1.5 p-1"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden fixed inset-0 bg-gray-950/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-8 text-lg">
            <button onClick={closeMenu} className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl">✕</button>
            <Link to="/" onClick={closeMenu} className="hover:text-white transition">Hitta LIA</Link>
            {session && (
              <>
                <Link to="/dashboard" onClick={closeMenu} className="hover:text-white transition">Dashboard</Link>
                <Link to="/sparade" onClick={closeMenu} className="hover:text-white transition">Sparade</Link>
                <Link to="/ansokningar" onClick={closeMenu} className="hover:text-white transition">Ansökningar</Link>
                <Link to="/profil" onClick={closeMenu} className="hover:text-white transition">Profil</Link>
              </>
            )}
            {session ? (
              <button onClick={handleLogout} className="text-gray-400 hover:text-white transition">Logga ut</button>
            ) : (
              <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
                Logga in med Google
              </button>
            )}
          </div>
        )}
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}