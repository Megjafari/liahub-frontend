export default function KontaktPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Kontakt</h1>
      <p className="text-gray-400 leading-relaxed">
        Har du frågor, feedback eller vill samarbeta? Kontakta oss gärna.
      </p>
      <a
        href="mailto:liahub@meghdadjafari.dev"
        className="text-blue-400 hover:text-blue-300 transition"
      >
        liahub@meghdadjafari.dev
      </a>
    </div>
  )
}