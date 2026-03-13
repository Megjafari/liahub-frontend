import PageTransition from '../components/PageTransition'

export default function IntegritetspolicyPage() {
  return (
    <PageTransition>
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Integritetspolicy</h1>
      <p className="text-gray-400 leading-relaxed">
        LIAHub samlar in din e-postadress och din tech stack via Google-inloggning för att kunna matcha dig mot relevanta jobbannonser och skicka notiser.
      </p>
      <p className="text-gray-400 leading-relaxed">
        Vi delar aldrig din data med tredje part. Du kan när som helst ta bort ditt konto och all tillhörande data genom att kontakta oss på liahub@meghdadjafari.dev.
      </p>
      <p className="text-gray-400 leading-relaxed">
        Vi använder inga tracking-cookies.
      </p>
    </div>
    </PageTransition>
  )
}