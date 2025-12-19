'use client'

import { useBackground } from '@/contexts/BackgroundContext'

export default function ExperiencePage() {
  const { backgroundRef } = useBackground()

  const handleContentClick = (e: React.MouseEvent) => {
    if (backgroundRef.current) {
      backgroundRef.current.handleClick(e.clientX, e.clientY)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10 pointer-events-none">
      <div className="text-center pointer-events-auto" onClick={handleContentClick}>
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-terminal-green">经历</h1>
        <div className="max-w-4xl">
          <p className="text-terminal-green text-lg md:text-xl">这里将展示我的工作经历...</p>
        </div>
      </div>
    </div>
  )
}
