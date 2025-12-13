'use client'

import { useState } from 'react'
import { useFirstVisit } from '@/lib/hooks/useFirstVisit'
import TerminalAnimation from '@/components/terminal/TerminalAnimation'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import NotesSection from '@/components/sections/NotesSection'
import ContactSection from '@/components/sections/ContactSection'

/**
 * 首页组件
 * 单页面布局，包含所有主要 section
 * 首次访问时显示终端命令行动画
 */

// 终端动画的命令序列
const terminalCommands = [
  { 
    cmd: 'pwd', 
    output: '/home/daniel/Documents',
    delay: 500
  },
  { 
    cmd: 'cd portfolio', 
    output: '',
    delay: 500
  },
  { 
    cmd: 'ls', 
    output: 'node_modules/  package.json  public/  src/  next.config.js  tailwind.config.ts  tsconfig.json',
    delay: 800
  },
  { 
    cmd: 'npm run dev', 
    output: '> portfolio-frontend@1.0.0 dev\n> next dev\n\n  ▲ Next.js 15.0.0\n  - Local:http://localhost:3000\n  - Ready in 1.2s',
    delay: 1000
  },
]

export default function HomePage() {
  const isFirstVisit = useFirstVisit()
  const [showAnimation, setShowAnimation] = useState(isFirstVisit)

  // 动画完成后的回调
  const handleAnimationComplete = () => {
    setShowAnimation(false)
  }

  return (
    <div className="pt-16">
      {/* 终端动画 - 仅在首次访问时显示 */}
      {showAnimation && (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-4xl">
            <TerminalAnimation
              commands={terminalCommands}
              onComplete={handleAnimationComplete}
              skippable={true}
            />
          </div>
        </div>
      )}

      {/* 主要内容 - 动画完成后或非首次访问时显示 */}
      {!showAnimation && (
        <>
          <HeroSection 
            name="Your Name"
            role="Developer"
            description="Building amazing things with code"
          />
          <AboutSection 
            content="这里展示关于我的信息..."
            skills={['React', 'Next.js', 'TypeScript', 'Tailwind CSS']}
          />
          <ExperienceSection />
          <ProjectsSection />
          <NotesSection />
          <ContactSection 
            email="your.email@example.com"
            github="https://github.com/yourusername"
          />
        </>
      )}
    </div>
  )
}

