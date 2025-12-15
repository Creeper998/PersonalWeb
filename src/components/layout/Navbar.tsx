'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * 导航栏组件
 * 终端风格导航，支持首页内平滑滚动和其他页面路由跳转
 */

export default function Navbar() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  // 导航项配置
  const navItems = [
    { href: '/', label: 'home', section: 'hero' },
    { href: '/', label: 'about', section: 'about' },
    { href: '/', label: 'experience', section: 'experience' },
    { href: '/', label: 'projects', section: 'projects' },
    { href: '/', label: 'notes', section: 'notes' },
    { href: '/', label: 'contact', section: 'contact' },
  ]

  // 处理导航点击
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    if (isHomePage) {
      // 在首页时，平滑滚动到对应 section
      e.preventDefault()
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    // 不在首页时，使用默认的 Link 跳转行为
  }

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 bg-terminal-bg/90 backdrop-blur-sm border border-terminal-border rounded-lg shadow-lg">
      <div className="px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo/品牌 */}
          <Link href="/" className="text-xl font-bold text-terminal-green hover:text-terminal-prompt transition-colors">
            $ portfolio
          </Link>
          
          {/* 导航菜单 */}
          <div className="flex gap-6">
            {navItems.map((item) => (
              <a
                key={item.section}
                href={isHomePage ? `#${item.section}` : `/${item.section}`}
                onClick={(e) => handleNavClick(e, item.section)}
                className="text-terminal-text hover:text-terminal-green transition-colors text-sm"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

