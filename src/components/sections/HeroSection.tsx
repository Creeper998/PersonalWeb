'use client'

/**
 * Hero Section - 首页顶部展示区域
 * 显示个人介绍和主要信息
 */

interface HeroSectionProps {
  /** 个人名称 */
  name?: string
  /** 职业/角色 */
  role?: string
  /** 简介描述 */
  description?: string
}

export default function HeroSection({ 
  name = 'Your Name',
  role = 'Developer',
  description = 'Building amazing things with code'
}: HeroSectionProps) {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold text-terminal-green">
          {name}
        </h1>
        <p className="text-2xl md:text-3xl text-terminal-text">
          {role}
        </p>
        <p className="text-lg md:text-xl text-terminal-text/80 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  )
}



