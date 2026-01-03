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
  /** 是否启用删除动画 */
  enableDeleting?: boolean
  /** 删除前的等待时间（毫秒） */
  deleteDelay?: number
  /** 删除速度（毫秒） */
  deleteSpeed?: number
  /** 删除完成回调 */
  onDeleteComplete?: () => void
}

export default function TypewriterText({
  text,
  speed = 100,
  showCursor = true,
  onComplete,
  autoStart = true,
  startDelay = 0,
  enableDeleting = false,
  deleteDelay = 2000,
  deleteSpeed = 50,
  onDeleteComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const onCompleteRef = useRef(onComplete)
  const onDeleteCompleteRef = useRef(onDeleteComplete)

  // 更新 ref，避免依赖项变化导致重新执行
  useEffect(() => {
    onCompleteRef.current = onComplete
    onDeleteCompleteRef.current = onDeleteComplete
  }, [onComplete, onDeleteComplete])

  useEffect(() => {
    if (!autoStart) return

    // 重置状态
    setDisplayedText('')
    setIsTyping(false)
    setIsDeleting(false)

    const timer = setTimeout(() => {
      setIsTyping(true)
      let index = 0

      // 打字动画
      const typingInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.substring(0, index + 1))
          index++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
          onCompleteRef.current?.()

          // 如果启用删除，等待 deleteDelay 后开始删除
          if (enableDeleting) {
            const deleteTimer = setTimeout(() => {
              setIsDeleting(true)
              let deleteIndex = text.length

              const deletingInterval = setInterval(() => {
                if (deleteIndex > 0) {
                  setDisplayedText(text.substring(0, deleteIndex - 1))
                  deleteIndex--
                } else {
                  clearInterval(deletingInterval)
                  setIsDeleting(false)
                  onDeleteCompleteRef.current?.()
                }
              }, deleteSpeed)

              return () => clearInterval(deletingInterval)
            }, deleteDelay)

            return () => clearTimeout(deleteTimer)
          }
        }
      }, speed)

      return () => clearInterval(typingInterval)
    }, startDelay)

    return () => clearTimeout(timer)
  }, [text, speed, autoStart, startDelay, enableDeleting, deleteDelay, deleteSpeed])

  return (
    <span className="text-terminal-green text-2xl md:text-3xl font-mono inline-block whitespace-nowrap">
      {displayedText}
      {showCursor && (
        <span className="inline-block ml-1 text-terminal-green animate-pulse">|</span>
      )}
    </span>
  )
}

