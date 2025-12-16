'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterTextProps {
  /** 要显示的文本 */
  text: string
  /** 打字速度（毫秒） */
  speed?: number
  /** 是否显示光标 */
  showCursor?: boolean
  /** 完成后回调 */
  onComplete?: () => void
  /** 是否自动开始 */
  autoStart?: boolean
  /** 开始延迟（毫秒） */
  startDelay?: number
}

export default function TypewriterText({
  text,
  speed = 100,
  showCursor = true,
  onComplete,
  autoStart = true,
  startDelay = 0,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const onCompleteRef = useRef(onComplete)

  // 更新 ref，避免依赖项变化导致重新执行
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!autoStart) return

    // 重置状态
    setDisplayedText('')
    setIsTyping(false)

    const timer = setTimeout(() => {
      setIsTyping(true)
      let index = 0

      const typingInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.substring(0, index + 1))
          index++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
          onCompleteRef.current?.()
        }
      }, speed)

      return () => clearInterval(typingInterval)
    }, startDelay)

    return () => clearTimeout(timer)
  }, [text, speed, autoStart, startDelay])

  return (
    <span className="text-terminal-green text-2xl md:text-3xl font-mono inline-block whitespace-nowrap">
      {displayedText}
      {showCursor && (
        <span className="inline-block ml-1 text-terminal-green animate-pulse">|</span>
      )}
    </span>
  )
}

