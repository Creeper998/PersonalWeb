'use client'

import { useBackground } from '@/contexts/BackgroundContext'
import BackgroundEffect from '@/components/background/BackgroundEffect'

export default function BackgroundLayoutClient() {
  const { backgroundRef } = useBackground()
  
  return <BackgroundEffect ref={backgroundRef} />
}
