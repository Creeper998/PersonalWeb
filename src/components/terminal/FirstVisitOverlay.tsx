'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
 * 仅在首次访问时显示终端动画
 * 延迟加载，不阻塞首屏渲染
 */
export default function FirstVisitOverlay() {
  const router = useRouter()
  // 初始状态设为 true，避免闪烁，然后在 useEffect 中检查
  const [showAnimation, setShowAnimation] = useState<boolean>(true)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 检查是否首次访问
    const hasVisited = localStorage.getItem('hasVisited')
    
    // 开发模式下，可以通过 URL 参数强制显示动画：?showAnimation=true
    const urlParams = new URLSearchParams(window.location.search)
    const forceShow = urlParams.get('showAnimation') === 'true'
    
    if (forceShow || !hasVisited) {
      // 首次访问或强制显示，显示动画并标记
      setShowAnimation(true)
      if (!hasVisited) {
        localStorage.setItem('hasVisited', 'true')
      }
    } else {
      // 已经访问过，不显示动画
      setShowAnimation(false)
    }
  }, [])

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

