'use client'

import styles from './terminal.module.css'

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
  className = '',
}: TerminalWindowProps) {
  return (
    <div className={`${styles.window} ${className}`}>
      {/* 终端窗口标题栏 */}
      {showTitleBar && (
        <div className={styles.titleBar}>
          <div className={styles.windowControls} aria-hidden="true">
            <span className={styles.closeDot} />
            <span className={styles.minimizeDot} />
            <span className={styles.zoomDot} />
          </div>
          <span className={styles.title}>creeper — terminal</span>
        </div>
      )}

      {/* 终端内容区域 */}
      <div className={styles.content}>{children}</div>
    </div>
  )
}
