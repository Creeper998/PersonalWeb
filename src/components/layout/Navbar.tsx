'use client'

import { useMemo } from 'react'
import PillNav from './PillNav'

/**
 * 导航栏组件
 * 使用 PillNav 实现带填充动画的终端风格导航
 */

export default function Navbar() {
  // 使用 useMemo 稳定化 navItems 的引用，避免每次渲染都创建新数组
  const navItems = useMemo(() => [
    { href: '/about', label: 'about' },
    { href: '/experience', label: 'experience' },
    { href: '/projects', label: 'projects' },
    { href: '/notes', label: 'notes' },
    { href: '/contact', label: 'contact' },
  ], [])

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <PillNav
          items={navItems}
          logoSrc="/reactbits-logo.svg"
          logoAlt="ReactBits Logo"
          // 浅色主题：白色 pill，黑色文字，悬停时黑底白字
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
          initialLoadAnimation={true}
        />
      </div>
    </nav>
  )
}


