'use client'

import { useState, useEffect, useRef } from 'react'
import TypewriterText from './TypewriterText'

interface RotatingTagsProps {
  /** 标签数组 */
  tags: string[]
  /** 每个标签显示时长（毫秒） */
  duration?: number
  /** 打字速度（毫秒） */
  typingSpeed?: number
  /** 是否显示光标 */
  showCursor?: boolean
}

export default function RotatingTags({
  tags,
  duration = 2000,
  typingSpeed = 100,
  showCursor = true,
}: RotatingTagsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (tags.length === 0) return

    // 当打字完成后，等待 duration 时间再切换到下一个标签
    if (isTypingComplete) {
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setCurrentIndex((prev) => (prev + 1) % tags.length)
          setIsTypingComplete(false)
        }
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isTypingComplete, tags.length, duration])

  // 确保动画持续循环
  const handleTypingComplete = () => {
    if (isMountedRef.current) {
      setIsTypingComplete(true)
    }
  }

  if (tags.length === 0) return null

  return (
    <div className="h-10 md:h-12 flex items-center justify-center">
      <TypewriterText
        key={currentIndex} // 使用 key 强制重新渲染，重置动画
        text={tags[currentIndex]}
        speed={typingSpeed}
        showCursor={showCursor}
        autoStart={true}
        startDelay={0}
        onComplete={handleTypingComplete}
      />
    </div>
  )
}

