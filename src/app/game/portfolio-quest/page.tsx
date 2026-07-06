'use client'

import dynamic from 'next/dynamic'

// Disable SSR entirely — the game uses canvas, localStorage, Web Audio, requestAnimationFrame
const PortfolioQuestGame = dynamic(
  () => import('@/components/game/PortfolioQuestGame'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🎮</div>
          <p className="text-slate-400 text-sm animate-pulse">Loading Portfolio Quest…</p>
        </div>
      </div>
    ),
  }
)

export default function GamePage() {
  return <PortfolioQuestGame />
}
