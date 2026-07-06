import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio Quest — Play the Game | Tamilselvan G',
  description:
    "Explore Tamilselvan's portfolio as a pixel RPG! Walk into buildings to discover skills, projects, experience, and more.",
  openGraph: {
    title: 'Portfolio Quest — Interactive Pixel Game',
    description: 'An interactive pixel RPG portfolio experience by Tamilselvan G.',
    type: 'website',
  },
}

export default function GameLayout({ children }: { children: React.ReactNode }) {
  // This layout replaces the children slot inside the root layout.
  // We use a fixed full-screen div that covers the root layout's Navbar & Footer.
  return (
    <>
      {/*
        The root layout still renders Navbar/Footer around us.
        This fixed div covers the entire viewport so the game is full-screen.
        pointer-events-auto on children ensures clicks reach the game.
      */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {children}
      </div>
    </>
  )
}
