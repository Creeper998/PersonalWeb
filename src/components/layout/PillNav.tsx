'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'

interface PillNavItem {
  label: string
  href: string
  ariaLabel?: string
}

interface PillNavProps {
  items: PillNavItem[]
  className?: string
  ease?: string
  baseColor?: string
  pillColor?: string
  hoveredPillTextColor?: string
  pillTextColor?: string
  initialLoadAnimation?: boolean
  logoSrc?: string
  logoAlt?: string
  logoComponent?: React.ReactNode
}

export default function PillNav({
  items,
  className = '',
  ease = 'power3.easeOut',
  // 默认使用浅色主题
  baseColor = '#000000',
  pillColor = '#ffffff',
  hoveredPillTextColor = '#ffffff',
  pillTextColor = '#000000',
  initialLoadAnimation = true,
  logoSrc,
  logoAlt = 'Logo',
  logoComponent,
}: PillNavProps) {
  const resolvedPillTextColor = pillTextColor ?? baseColor
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const circleRefs = useRef<HTMLSpanElement[]>([])
  const tlRefs = useRef<gsap.core.Timeline[]>([])
  const activeTweenRefs = useRef<gsap.core.Tween[]>([])
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const navItemsRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLDivElement | null>(null)
  const logoImgRef = useRef<HTMLImageElement | null>(null)
  const logoComponentRef = useRef<HTMLDivElement | null>(null)
  const logoTweenRef = useRef<gsap.core.Tween | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement | null>(null)
  const hamburgerAnimationsRef = useRef<gsap.core.Tween[]>([])
  const menuAnimationRef = useRef<gsap.core.Tween | null>(null)

  const pathname = usePathname()

  // 使用 useMemo 稳定化 items 的引用，避免不必要的重新渲染
  const itemsKey = useMemo(() => items.map(item => item.href).join(','), [items])

  // 修复：在客户端挂载后设置标记
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // 修复：只在客户端挂载后才执行，确保内容先显示
    if (!isMounted) return

    let fontsReadyPromise: Promise<void> | null = null
    let animationTimer: NodeJS.Timeout | null = null
    let logoAnimation: gsap.core.Tween | null = null
    let navItemsAnimation: gsap.core.Tween | null = null

    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return

        const pill = circle.parentElement as HTMLElement
        const rect = pill.getBoundingClientRect()
        const { width: w, height: h } = rect
        const R = ((w * w) / 4 + h * h) / (2 * h)
        const D = Math.ceil(2 * R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        const originY = D - delta

        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        })

        const label = pill.querySelector<HTMLElement>('.pill-label')
        const white = pill.querySelector<HTMLElement>('.pill-label-hover')

        if (label) gsap.set(label, { y: 0 })
        if (white) gsap.set(white, { y: h + 12, opacity: 0 })

        const index = circleRefs.current.indexOf(circle)
        if (index === -1) return

        // 清理旧的 timeline
        tlRefs.current[index]?.kill()
        const tl = gsap.timeline({ paused: true })

        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 0.5, ease, overwrite: 'auto' },
          0,
        )

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 0.5, ease, overwrite: 'auto' }, 0)
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 })
          tl.to(white, { y: 0, opacity: 1, duration: 0.5, ease, overwrite: 'auto' }, 0)
        }

        tlRefs.current[index] = tl
      })
    }

    layout()

    // 防抖的 resize 处理
    let resizeTimer: NodeJS.Timeout | null = null
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        layout()
      }, 150)
    }
    window.addEventListener('resize', onResize, { passive: true })

    // 处理字体加载
    if ((document as any).fonts?.ready) {
      fontsReadyPromise = (document as any).fonts.ready.then(layout).catch(() => {})
    }

    const menu = mobileMenuRef.current
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 })
    }

    // 修复：只在挂载后且需要动画时才执行
    if (initialLoadAnimation) {
      const logo = logoRef.current
      const navItems = navItemsRef.current

      // 延迟执行动画，确保用户能看到内容
      animationTimer = setTimeout(() => {
        if (logo) {
          gsap.set(logo, { scale: 0 })
          logoAnimation = gsap.to(logo, {
            scale: 1,
            duration: 0.6,
            ease,
          })
        }

        if (navItems) {
          // 修复：使用 scaleX 而不是 width，确保内容始终可见
          gsap.set(navItems, { scaleX: 0, transformOrigin: 'left center' })
          navItemsAnimation = gsap.to(navItems, {
            scaleX: 1,
            duration: 0.6,
            ease,
          })
        }
      }, 100) // 100ms 延迟，确保内容先显示
    }

    // 清理函数：确保所有资源都被正确释放
    return () => {
      // 清理定时器
      if (animationTimer) clearTimeout(animationTimer)
      if (resizeTimer) clearTimeout(resizeTimer)
      
      // 清理 GSAP 动画
      if (logoAnimation) logoAnimation.kill()
      if (navItemsAnimation) navItemsAnimation.kill()
      
      // 清理所有 timeline
      tlRefs.current.forEach(tl => tl?.kill())
      
      // 清理所有 active tween
      activeTweenRefs.current.forEach(tween => tween?.kill())
      
      // 清理移动菜单动画
      hamburgerAnimationsRef.current.forEach(anim => anim?.kill())
      hamburgerAnimationsRef.current = []
      menuAnimationRef.current?.kill()
      
      // 清理 logo 动画
      logoTweenRef.current?.kill()
      
      // 清理事件监听器
      window.removeEventListener('resize', onResize)
      
      // 注意：fonts.ready 的 promise 无法取消，但不会造成内存泄漏
    }
  }, [isMounted, itemsKey, ease, initialLoadAnimation])

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto',
    })
  }

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto',
    })
  }

  const handleLogoEnter = () => {
    const img = logoImgRef.current
    const component = logoComponentRef.current
    const target = img || component
    if (!target) return
    logoTweenRef.current?.kill()
    gsap.set(target, { rotate: 0 })
    logoTweenRef.current = gsap.to(target, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto',
    })
  }

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen
    setIsMobileMenuOpen(newState)

    const hamburger = hamburgerRef.current
    const menu = mobileMenuRef.current

    // 清理之前的动画
    hamburgerAnimationsRef.current.forEach(anim => anim?.kill())
    hamburgerAnimationsRef.current = []
    menuAnimationRef.current?.kill()

    if (hamburger) {
      const lines = hamburger.querySelectorAll<HTMLElement>('.hamburger-line')
      if (newState) {
        hamburgerAnimationsRef.current.push(
          gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease })
        )
        hamburgerAnimationsRef.current.push(
          gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease })
        )
      } else {
        hamburgerAnimationsRef.current.push(
          gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease })
        )
        hamburgerAnimationsRef.current.push(
          gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease })
        )
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' })
        menuAnimationRef.current = gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center',
          },
        )
      } else {
        menuAnimationRef.current = gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            if (menu) {
              gsap.set(menu, { visibility: 'hidden' })
            }
          },
        })
      }
    }
  }

  // 修复：确保路由切换时关闭移动端菜单
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [pathname, isMobileMenuOpen])

  const isExternalLink = (href: string) =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#')

  const isRouterLink = (href: string) => href && !isExternalLink(href)

  const cssVars = {
    ['--base' as string]: baseColor,
    ['--pill-bg' as string]: pillColor,
    ['--hover-text' as string]: hoveredPillTextColor,
    ['--pill-text' as string]: resolvedPillTextColor,
  }

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        {/* Logo 区域：如果传入 logoComponent 则显示组件，否则如果传入 logoSrc 则显示图片 */}
        <div
          className="pill-logo"
          aria-label="Home"
          onMouseEnter={handleLogoEnter}
          ref={(el) => {
            logoRef.current = el
          }}
        >
          {logoComponent ? (
            <div className="w-full h-full flex items-center justify-center" ref={logoComponentRef}>
              {logoComponent}
            </div>
          ) : logoSrc ? (
            <img
              src={logoSrc}
              alt={logoAlt}
              className="w-full h-full object-contain"
              ref={logoImgRef}
            />
          ) : null}
        </div>

        <div 
          className="pill-nav-items desktop-only" 
          ref={navItemsRef}
        >
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href || `item-${i}`} role="none">
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      href={item.href}
                      className={`pill${isActive ? ' is-active' : ''}`}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      <span
                        className="hover-circle"
                        aria-hidden="true"
                        ref={(el) => {
                          if (el) circleRefs.current[i] = el
                        }}
                      />
                      <span className="label-stack">
                        <span className="pill-label">{item.label}</span>
                        <span className="pill-label-hover" aria-hidden="true">
                          {item.label}
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={`pill${isActive ? ' is-active' : ''}`}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      <span
                        className="hover-circle"
                        aria-hidden="true"
                        ref={(el) => {
                          if (el) circleRefs.current[i] = el
                        }}
                      />
                      <span className="label-stack">
                        <span className="pill-label">{item.label}</span>
                        <span className="pill-label-hover" aria-hidden="true">
                          {item.label}
                        </span>
                      </span>
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <button
          className="mobile-menu-button mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={cssVars}>
        <ul className="mobile-menu-list">
          {items.map((item, i) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href || `mobile-item-${i}`}>
                {isRouterLink(item.href) ? (
                  <Link
                    href={item.href}
                    className={`mobile-menu-link${isActive ? ' is-active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className={`mobile-menu-link${isActive ? ' is-active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}


