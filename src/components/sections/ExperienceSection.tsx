'use client'

import ExperienceTimeline from '@/components/experience/ExperienceTimeline'

/**
 * Experience Section - 经历区域
 * 展示工作经历、教育背景等
 */

interface Experience {
  id: string
  company: string
  position: string
  period: string
  description: string
}

interface ExperienceSectionProps {
  /** 经历列表 */
  experiences?: Experience[]
}

export default function ExperienceSection({ 
  experiences = [] 
}: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold mb-8 text-terminal-green">
          $ experience
        </h2>
        
        {experiences.length > 0 ? (
          <ExperienceTimeline experiences={experiences} />
        ) : (
          <p className="text-terminal-text">这里将展示我的工作经历...</p>
        )}
      </div>
    </section>
  )
}



