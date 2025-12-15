import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import NotesSection from '@/components/sections/NotesSection'
import ContactSection from '@/components/sections/ContactSection'
import FirstVisitOverlayClient from '@/components/terminal/FirstVisitOverlayClient'

/**
 * 首页组件 - 服务端渲染
 * 主要内容在服务端渲染，首屏加载更快
 * 首次访问动画延迟加载，不阻塞首屏
 */
export default function HomePage() {
  return (
    <div className="pt-24">
      {/* 主要内容 - 服务端渲染，首屏立即可见 */}
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
      
      {/* 首次访问覆盖层 - 延迟加载，不阻塞首屏 */}
      <FirstVisitOverlayClient />
    </div>
  )
}

