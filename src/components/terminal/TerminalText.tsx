'use client'

import styles from './terminal.module.css'

/**
 * 终端文本组件
 * 用于显示不同类型的终端文本（命令、输出、错误等）
 */

interface TerminalTextProps {
  /** 文本内容 */
  children: React.ReactNode
  /** 文本类型：command(命令), output(输出), error(错误), prompt(提示符) */
  type?: 'command' | 'output' | 'error' | 'prompt'
  /** 是否显示光标闪烁效果 */
  showCursor?: boolean
}

export default function TerminalText({
  children,
  type = 'output',
  showCursor = false,
}: TerminalTextProps) {
  // 根据类型设置不同的颜色
  const colorClasses = {
    command: styles.command,
    output: styles.output,
    error: styles.error,
    prompt: styles.prompt,
  }

  return (
    <span className={colorClasses[type]}>
      {children}
      {showCursor && (
        <span aria-hidden="true" className={styles.cursor}>
          ▍
        </span>
      )}
    </span>
  )
}
