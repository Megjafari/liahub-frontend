import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition shadow-lg"
      aria-label="Tillbaka till toppen"
    >
      ↑
    </button>
  )
}