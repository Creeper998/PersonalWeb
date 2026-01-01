'use client'

import { createContext, useContext, useRef, ReactNode } from 'react'
import { PixelBlastHandle } from '@/components/background/BackgroundEffect'

interface BackgroundContextType {
  backgroundRef: React.RefObject<PixelBlastHandle | null>
}

const BackgroundContext = createContext<BackgroundContextType | null>(null)

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const backgroundRef = useRef<PixelBlastHandle | null>(null)

  return (
    <BackgroundContext.Provider value={{ backgroundRef }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (!context) {
    throw new Error('useBackground must be used within BackgroundProvider')
  }
  return context
}
