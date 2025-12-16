'use client'

import { forwardRef } from 'react'
import PixelBlast, { PixelBlastHandle } from './PixelBlast'

const BackgroundEffect = forwardRef<PixelBlastHandle>((props, ref) => {
  return (
    <div className="fixed inset-0 z-0 w-screen h-screen" style={{ backgroundColor: '#1a1b2e', top: 0, left: 0, right: 0, bottom: 0 }}>
      <PixelBlast
        ref={ref}
        variant="circle"
        pixelSize={7}
        color="#9d7fe8"
        patternScale={3}
        patternDensity={1.2}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid={false}
        speed={0.6}
        edgeFade={0.25}
        transparent
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
})

BackgroundEffect.displayName = 'BackgroundEffect'

export default BackgroundEffect
export type { PixelBlastHandle }

