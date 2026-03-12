export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-20 py-10 px-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          © 2026 LIAhub — Hitta techjobb som matchar dina skills
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="/om" className="hover:text-gray-300 transition">Om LIAhub</a>
          <a href="/kontakt" className="hover:text-gray-300 transition">Kontakt</a>
          <a href="/integritetspolicy" className="hover:text-gray-300 transition">Integritetspolicy</a>
        </div>
      </div>
    </footer>
  )
}