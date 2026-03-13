import PageTransition from '../components/PageTransition'

export default function OmPage() {
  return (
    <PageTransition>
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Om LIAhub</h1>
      <p className="text-gray-400 leading-relaxed">
        LIAHub är en plattform för studenter inom tech som letar praktik, LIA eller juniora jobb i Sverige.
      </p>
      <p className="text-gray-400 leading-relaxed">
        Vi hämtar jobbannonser från Arbetsförmedlingens öppna API och rankar dem efter hur väl de matchar din tech stack, så att du slipper gå igenom hundratals irrelevanta annonser.
      </p>
      <p className="text-gray-400 leading-relaxed">
        LIAHub är byggt av en student, för studenter inom tech.
      </p>
    </div>
    </PageTransition>
  )
}