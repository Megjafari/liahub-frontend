import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-20 py-10 px-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          © 2026 LIAHub — Hitta techjobb som matchar dina skills
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <Link to="/om" className="hover:text-gray-300 transition">Om LIAHub</Link>
          <Link to="/kontakt" className="hover:text-gray-300 transition">Kontakt</Link>
          <Link to="/integritetspolicy" className="hover:text-gray-300 transition">Integritetspolicy</Link>
        </div>
      </div>
    </footer>
  )
}
