import { useState, useEffect } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useNotifications } from '../hooks/useNotifications'
import { supabase } from '../services/supabase'

const TECH_CATEGORIES = {
  'Backend': ['.NET', 'C#', 'ASP.NET', 'Java', 'Spring', 'Python', 'Node.js', 'PHP', 'Go', 'Rust'],
  'Frontend': ['React', 'Angular', 'Vue', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Blazor'],
  'Databas': ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Entity Framework'],
  'Cloud & DevOps': ['Azure', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Linux'],
  'Övrigt': ['Git', 'Scrum', 'Agile', 'REST', 'API', 'MAUI', 'Kotlin', 'Swift']
}

export default function ProfilePage() {
  const { profile, loading, updateProfile } = useProfile()
  const { active, loading: notifLoading, updateSettings } = useNotifications()
  const [session, setSession] = useState<any>(null)
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  useEffect(() => {
    if (profile) {
      setSelectedTechs(profile.techStacks || [])
    }
  }, [profile])

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    )
  }

  const handleSave = async () => {
    await updateProfile({ techStacks: selectedTechs })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!session) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Du måste vara inloggad för att se din profil.</p>
      </div>
    )
  }

  if (loading) return <p className="text-gray-400">Laddar profil...</p>

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Min profil</h1>
        <p className="text-gray-400 mt-2">Fyll i din profil för att få bättre matchningar</p>
      </div>

      {/* Tech stack */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="font-semibold text-white">Min techstack</h2>
          <p className="text-sm text-gray-400 mt-1">Välj de tekniker du kan — används för att matcha annonser</p>
        </div>
        {Object.entries(TECH_CATEGORIES).map(([category, techs]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {techs.map(tech => (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  className={`text-sm px-3 py-1 rounded-lg border transition ${
                    selectedTechs.includes(tech)
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      {!notifLoading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-white">Jobbnotiser</h2>
            <p className="text-sm text-gray-400 mt-1">Få mejl direkt när nya jobb matchar din techstack</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Notifiera mig om nya matchningar</span>
            <button
              onClick={() => updateSettings(!active)}
              className={`relative w-12 h-6 rounded-full transition ${
                active ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                active ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium"
      >
        {saved ? '✓ Sparat!' : 'Spara profil'}
      </button>
    </div>
  )
}