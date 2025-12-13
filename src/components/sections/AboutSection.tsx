'use client'

/**
 * About Section - 关于我区域
 * 展示个人介绍、技能等信息
 */

interface AboutSectionProps {
  /** 关于我的内容 */
  content?: string
  /** 技能列表 */
  skills?: string[]
}

export default function AboutSection({ 
  content = '这里展示关于我的信息...',
  skills = []
}: AboutSectionProps) {
  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold mb-8 text-terminal-green">
          $ about
        </h2>
        
        <div className="space-y-6 text-terminal-text">
          <p className="text-lg leading-relaxed">
            {content}
          </p>

          {skills.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-terminal-prompt">
                $ skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-terminal-bg-alt border border-terminal-border rounded text-terminal-green"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}



