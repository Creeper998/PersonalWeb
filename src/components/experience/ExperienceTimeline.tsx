'use client'

/**
 * 经历时间线组件
 * 以时间线形式展示工作经历
 */

interface ExperienceItem {
  id: string
  company: string
  position: string
  period: string
  description: string
}

interface ExperienceTimelineProps {
  experiences: ExperienceItem[]
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <div className="space-y-8">
      {experiences.map((exp) => (
        <div 
          key={exp.id} 
          className="border-l-4 border-terminal-green pl-6 relative"
        >
          {/* 时间线节点 */}
          <div className="absolute -left-2 top-0 w-4 h-4 bg-terminal-green rounded-full border-2 border-terminal-bg"></div>
          
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div>
                <h3 className="text-xl font-bold text-terminal-green">
                  {exp.position}
                </h3>
                <p className="text-terminal-prompt">
                  {exp.company}
                </p>
              </div>
              <span className="text-terminal-text/60 text-sm">
                {exp.period}
              </span>
            </div>
            
            <p className="text-terminal-text">
              {exp.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

