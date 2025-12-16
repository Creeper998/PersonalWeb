'use client'

import { useRef } from 'react'
import BackgroundEffect, { PixelBlastHandle } from '@/components/background/BackgroundEffect'

export default function ContactPage() {
  const backgroundRef = useRef<PixelBlastHandle>(null)

  const handleContentClick = (e: React.MouseEvent) => {
    if (backgroundRef.current) {
      backgroundRef.current.handleClick(e.clientX, e.clientY)
    }
  }

  return (
    <>
      <BackgroundEffect ref={backgroundRef} />
      <div className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10 pointer-events-none">
        <div className="text-center pointer-events-auto" onClick={handleContentClick}>
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-terminal-green">联系我</h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-terminal-green text-lg md:text-xl">这里将展示联系方式或联系表单...</p>
          </div>
        </div>
      </div>
    </>
  )
}

