'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import TerminalAnimation from './TerminalAnimation'
import TerminalWindow from './TerminalWindow'

const terminalCommands = [
  { 
    cmd: 'pwd', 
    output: '/home/daniel/Documents',
    delay: 500
  },
  { 
    cmd: 'cd portfolio', 
    output: '',
    delay: 500
  },
  { 
    cmd: 'ls', 
    output: 'node_modules/  package.json  public/  src/  next.config.js  tailwind.config.ts  tsconfig.json',
    delay: 800
  },
  { 
    cmd: 'npm run dev', 
    output: '> portfolio-frontend@1.0.0 dev\n> next dev\n\n   ▲ Next.js 15.5.9\n   - Local:        http://localhost:3000\n   - Network:      http://192.168.124.21:3000\n\n ✓ Starting...\n ✓ Ready in 2.8s',
    delay: 1000
  },
]

/**
 * 首次访问覆盖层组件
 * 每次关闭页面重新打开时显示终端动画
 * 使用 sessionStorage 和页面可见性 API 来检测页面关闭
 * 只在根路径 / 时显示和跳转
 */
export default function FirstVisitOverlay() {
  const router = useRouter()
  const pathname = usePathname()
  // 初始状态设为 true，避免闪烁，然后在 useEffect 中检查
  const [showAnimation, setShowAnimation] = useState<boolean>(true)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // 只在根路径 / 时显示动画和跳转
    if (pathname !== '/') {
      setShowAnimation(false)
      return
    }
    
    // 开发模式下，可以通过 URL 参数清除标记：?clearAnimation=true
    const urlParams = new URLSearchParams(window.location.search)
    const clearAnimation = urlParams.get('clearAnimation') === 'true'
    if (clearAnimation) {
      sessionStorage.removeItem('animationShown')
    }
    
    // 检查当前会话是否已显示动画（使用 sessionStorage）
    // sessionStorage 在标签页关闭时会自动清除，所以每次新打开页面时都是空的
    const hasShownInSession = sessionStorage.getItem('animationShown')
    
    // 开发模式下，可以通过 URL 参数强制显示动画：?showAnimation=true
    const forceShow = urlParams.get('showAnimation') === 'true'
    
    // 如果强制显示或未在当前会话显示过，显示动画
    if (forceShow || !hasShownInSession) {
      // 未在当前会话显示过或强制显示，显示动画并标记
      setShowAnimation(true)
      if (!hasShownInSession && !forceShow) {
        // 标记已显示（强制显示时不标记，方便测试）
        // 延迟标记，确保动画已经开始显示
        setTimeout(() => {
          sessionStorage.setItem('animationShown', 'true')
        }, 500)
      }
    } else {
      // 当前会话已显示过（可能是刷新页面），不显示动画，直接跳转到 about 页面
      setShowAnimation(false)
      // 延迟一下再跳转，确保组件渲染完成
      setTimeout(() => {
        router.replace('/about')
      }, 100)
    }

    // 监听页面可见性变化，当页面隐藏时清除 sessionStorage 标记
    // 这样下次打开页面时就会重新显示动画
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面被隐藏（关闭或切换标签），清除标记
        // 延迟清除，确保页面完全关闭后再清除
        setTimeout(() => {
          sessionStorage.removeItem('animationShown')
        }, 100)
      }
    }

    // 监听页面卸载事件，清除标记
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('animationShown')
    }

    // 监听页面关闭事件（pagehide 比 beforeunload 更可靠）
    const handlePageHide = () => {
      sessionStorage.removeItem('animationShown')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [router, pathname])

  const handleAnimationComplete = () => {
    // 终端命令动画结束后，先展示一小段加载动画，再跳转到 about 页面
    setIsLoading(true)
    setTimeout(() => {
      setShowAnimation(false)
      // 跳转到 about 页面
      router.push('/about')
    }, 1500)
  }

  // 组件还未挂载时，不渲染（避免 hydration mismatch）
  if (!mounted) return null
  
  // 不需要显示动画时，返回 null
  if (!showAnimation) return null

  return (
    <div className="fixed inset-0 z-50 bg-terminal-bg min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-4xl">
        {!isLoading ? (
          <TerminalAnimation
            commands={terminalCommands}
            onComplete={handleAnimationComplete}
            skippable={true}
          />
        ) : (
          <TerminalWindow>
            <div className="space-y-6 py-8">
              {/* 加载文本和动画 */}
              <div className="flex items-center justify-center gap-3">
                <span className="text-terminal-prompt">$</span>
                <span className="text-terminal-text">Loading Creeper</span>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse [animation-delay:0s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse [animation-delay:0.4s]" />
                </div>
              </div>
              
              {/* 进度条 */}
              <div className="w-full max-w-md mx-auto">
                <div className="h-1 bg-terminal-bg-alt rounded-full overflow-hidden">
                  <div className="h-full bg-terminal-green rounded-full animate-[loading_1.5s_ease-in-out_infinite] origin-left" />
                </div>
              </div>
              
              {/* 状态信息 */}
              <div className="text-center space-y-2">
                <p className="text-terminal-text text-sm opacity-75">
                  Initializing components...
                </p>
                <div className="flex items-center justify-center gap-2 text-terminal-green text-xs">
                  <span className="animate-spin">⟳</span>
                  <span>Preparing your experience</span>
                </div>
              </div>
            </div>
          </TerminalWindow>
        )}
      </div>
    </div>
  )
}
