'use client'

import { useEffect, useState } from 'react'
import RotatingTags from '@/components/animation/RotatingTags'
import TypewriterText from '@/components/animation/TypewriterText'
import FadeInText from '@/components/animation/FadeInText'
import { useBackground } from '@/contexts/BackgroundContext'
import CodeStyleSection from '@/components/ui/CodeStyleSection'

export default function AboutPage() {
  const roles = [
    'BUG DEVELOPER',
    'ASPIRING FULL STACK',
    'PROBLEM SOLVER',
    'Compatibility Handler',
    'Ctrl+C/V Master',
    'JS Logic Novice',
    'Design-to-Code Translator',
  ]

  const [showContent, setShowContent] = useState(false)
  const { backgroundRef } = useBackground()

  useEffect(() => {
    // 页面加载时开始显示内容
    setShowContent(true)
  }, [])

  const handleContentClick = (e: React.MouseEvent) => {
    // 将点击事件传递给背景效果
    if (backgroundRef.current) {
      backgroundRef.current.handleClick(e.clientX, e.clientY)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10 pointer-events-none">
      <div 
        className="text-center space-y-6 max-w-4xl mx-auto pointer-events-auto"
        onClick={handleContentClick}
      >
        {/* 第一行：大号名字 Creeper - 渐入动画 */}
        <FadeInText delay={300} duration={1000}>
          <h1 className="text-6xl md:text-8xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
            Creeper
          </h1>
        </FadeInText>

        {/* 第二行：标签依次滚动出现（每个标签都有打字动画效果，绿色中号字体，带光标）- 无限循环 */}
        <div className="h-10 md:h-12 flex items-center justify-center">
          <FadeInText delay={800} duration={800}>
            <RotatingTags
              tags={roles}
              duration={2000}
              typingSpeed={100}
              showCursor={true}
            />
          </FadeInText>
        </div>

        {/* 第三行：描述文字 - 打字动画，完成后不再循环 */}
        <div className="h-8 md:h-10 flex items-center justify-center mt-8">
          <FadeInText delay={1200} duration={600}>
            <TypewriterText
              text="Building amazing things with code"
              speed={80}
              showCursor={false}
              autoStart={true}
              startDelay={400}
            />
          </FadeInText>
        </div>

        {/* 第四行：AboutMe 部分 - 代码风格 */}
        <CodeStyleSection title="AboutMe" delay={1800} duration={800}>
          {/* 内容占位符，后续添加 */}
          <div className="h-4"></div>
          <div className="h-4"></div>
          <div className="h-4"></div>
          <div className="h-4"></div>
          <div className="h-4"></div>
        </CodeStyleSection>
      </div>
    </div>
  )
}
