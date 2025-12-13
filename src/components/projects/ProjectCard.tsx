'use client'

/**
 * 项目卡片组件
 * 展示单个项目的信息
 */

interface ProjectCardProps {
  title: string
  description: string
  image?: string
  technologies?: string[]
  link?: string
}

export default function ProjectCard({ 
  title, 
  description, 
  image, 
  technologies, 
  link 
}: ProjectCardProps) {
  return (
    <div className="bg-terminal-bg-alt border border-terminal-border rounded-lg p-6 hover:border-terminal-green transition-colors h-full flex flex-col">
      {image && (
        <div className="mb-4 rounded overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-2 text-terminal-green">
        {title}
      </h3>
      
      <p className="text-terminal-text mb-4 flex-grow">
        {description}
      </p>
      
      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-terminal-bg border border-terminal-border rounded text-sm text-terminal-green"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-green hover:text-terminal-prompt transition-colors text-sm"
        >
          $ view project →
        </a>
      )}
    </div>
  )
}

