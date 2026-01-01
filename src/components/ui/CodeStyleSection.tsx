'use client'

import { ReactNode } from 'react'
import FadeInText from '@/components/animation/FadeInText'

interface CodeStyleSectionProps {
  /** 标题文本（如 "AboutMe"） */
  title: string
  /** 内容区域，可以是任何 React 节点 */
  children: ReactNode
  /** 动画延迟时间（毫秒） */
  delay?: number
  /** 动画持续时间（毫秒） */
  duration?: number
  /** 内容区域最小高度 */
  minHeight?: string
  /** 是否显示淡入动画 */
  showAnimation?: boolean
}

export default function CodeStyleSection({
  title,
  children,
  delay = 1800,
  duration = 800,
  minHeight = '200px',
  showAnimation = true,
}: CodeStyleSectionProps) {
  const content = (
    <div className="text-left font-mono">
      <div className="flex items-center">
        <span className="text-[#DD84DD] text-3xl md:text-4xl font-bold">const</span>
        <span className="ml-2 text-3xl md:text-4xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
          {title}
        </span>
        <span className="ml-2 text-white text-3xl md:text-4xl font-bold">=</span>
        <span className="ml-2 text-[#DD84DD] text-3xl md:text-4xl font-bold">{'{'}</span>
      </div>
      <div 
        className="ml-6 mt-2 text-white text-base md:text-lg space-y-4"
        style={{ minHeight }}
      >
        {children}
      </div>
      <div className="text-[#DD84DD] text-3xl md:text-4xl font-bold">{'}'}</div>
    </div>
  )

  return (
    <div className="mt-12 flex justify-start">
      {showAnimation ? (
        <FadeInText delay={delay} duration={duration}>
          {content}
        </FadeInText>
      ) : (
        content
      )}
    </div>
  )
}

