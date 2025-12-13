'use client'

/**
 * 终端窗口容器组件
 * 提供终端风格的样式和布局
 */

interface TerminalWindowProps {
  /** 子组件内容 */
  children: React.ReactNode
  /** 是否显示窗口标题栏 */
  showTitleBar?: boolean
  /** 自定义类名 */
  className?: string
}

export default function TerminalWindow({ 
  children, 
  showTitleBar = true,
  className = '' 
}: TerminalWindowProps) {
  return (
    <div className={`bg-terminal-bg rounded-lg border border-terminal-border shadow-2xl ${className}`}>
      {/* 终端窗口标题栏 */}
      {showTitleBar && (
        <div className="flex items-center gap-2 px-4 py-2 bg-terminal-header border-b border-terminal-border">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-terminal-text text-sm ml-2">terminal</span>
        </div>
      )}
      
      {/* 终端内容区域 */}
      <div className="p-6 font-mono text-terminal-text">
        {children}
      </div>
    </div>
  )
}



