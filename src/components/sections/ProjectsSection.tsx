'use client'

import ProjectCard from '@/components/projects/ProjectCard'

/**
 * Projects Section - 项目展示区域
 * 展示个人项目作品
 */

interface Project {
  id: string
  title: string
  description: string
  image?: string
  technologies?: string[]
  link?: string
  github?: string
}

interface ProjectsSectionProps {
  /** 项目列表 */
  projects?: Project[]
}

export default function ProjectsSection({ 
  projects = [] 
}: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold mb-8 text-terminal-green">
          $ projects
        </h2>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                technologies={project.technologies}
                link={project.link}
              />
            ))}
          </div>
        ) : (
          <p className="text-terminal-text">这里将展示我的项目作品...</p>
        )}
      </div>
    </section>
  )
}



