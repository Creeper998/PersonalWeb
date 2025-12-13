'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * 淡入动画组件
 * 当元素进入视口时触发淡入动画
 * 适配终端风格
 */

interface FadeInSectionProps {
  /** 子组件内容 */
  children: React.ReactNode
  /** 动画延迟时间（毫秒） */
  delay?: number
  /** 触发动画的阈值（0-1） */
  threshold?: number
}

export default function FadeInSection({ 
  children, 
  delay = 0,
  threshold = 0.1
}: FadeInSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 延迟显示，实现淡入效果
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay, threshold])

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  )
}

