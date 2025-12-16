'use client'

import { useState, useEffect, useRef } from 'react'

interface FadeInTextProps {
  /** 要显示的文本 */
  children: React.ReactNode
  /** 延迟时间（毫秒） */
  delay?: number
  /** 动画持续时间（毫秒） */
  duration?: number
  /** 动画完成回调 */
  onComplete?: () => void
  /** 是否自动开始 */
  autoStart?: boolean
}

export default function FadeInText({
  children,
  delay = 0,
  duration = 1000,
  onComplete,
  autoStart = true,
}: FadeInTextProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!autoStart) return

    const timer = setTimeout(() => {
      setHasStarted(true)
      setIsVisible(true)
      
      if (onCompleteRef.current) {
        setTimeout(() => {
          onCompleteRef.current?.()
        }, duration)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, duration, autoStart])

  return (
    <div
      className={`transition-opacity ${hasStarted ? 'duration-1000' : ''}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}

