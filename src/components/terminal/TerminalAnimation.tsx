'use client'

import { useState, useEffect, useRef } from 'react'
import TerminalWindow from './TerminalWindow'
import TerminalText from './TerminalText'

/**
 * 终端命令行动画组件
 * 逐字显示命令执行过程，模拟终端操作
 */

interface Command {
  /** 命令文本 */
  cmd: string
  /** 命令输出结果 */
  output: string
  /** 命令执行延迟（毫秒） */
  delay?: number
}

interface TerminalAnimationProps {
  /** 命令序列 */
  commands: Command[]
  /** 动画完成回调 */
  onComplete?: () => void
  /** 是否可跳过动画 */
  skippable?: boolean
}

export default function TerminalAnimation({ 
  commands, 
  onComplete,
  skippable = true 
}: TerminalAnimationProps) {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isSkipped, setIsSkipped] = useState(false)
  const [completedCommands, setCompletedCommands] = useState<Array<{cmd: string, output: string}>>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingRef = useRef(false)

  // 跳过动画
  const handleSkip = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsSkipped(true)
    setIsTyping(false)
    isTypingRef.current = false
    // 立即显示所有命令
    const allCommands = commands.map(cmd => ({ cmd: cmd.cmd, output: cmd.output }))
    setCompletedCommands(allCommands)
    onComplete?.()
  }

  useEffect(() => {
    if (isSkipped) return

    const currentCommand = commands[currentCommandIndex]
    if (!currentCommand) {
      // 所有命令执行完成
      setIsTyping(false)
      isTypingRef.current = false
      onComplete?.()
      return
    }

    // 清理之前的定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // 重置状态，开始新命令
    isTypingRef.current = true
    setDisplayedText('')
    
    // 开始输入命令
    const prompt = 'myphz@archlinux:$ '
    const fullCommand = prompt + currentCommand.cmd
    let charIndex = 0

    // 立即开始第一个字符
    setDisplayedText(fullCommand.substring(0, 1))
    charIndex = 1

    // 然后继续剩余字符
    intervalRef.current = setInterval(() => {
      if (charIndex < fullCommand.length) {
        setDisplayedText(fullCommand.substring(0, charIndex + 1))
        charIndex++
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        isTypingRef.current = false
        // 命令输入完成，等待后显示输出
        setTimeout(() => {
          setDisplayedText('')
          setCompletedCommands(prev => [...prev, { 
            cmd: currentCommand.cmd, 
            output: currentCommand.output 
          }])
          // 移动到下一个命令
          setTimeout(() => {
            setCurrentCommandIndex(prev => prev + 1)
          }, currentCommand.delay || 500)
        }, 300)
      }
    }, 50) // 每个字符的显示间隔

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [currentCommandIndex, commands, isSkipped, onComplete])

  return (
    <TerminalWindow>
      <div className="space-y-2">
        {/* 显示已完成的命令 */}
        {completedCommands.map((cmd, index) => (
          <div key={index} className="space-y-1">
            <div>
              <TerminalText type="prompt">myphz@archlinux:$ </TerminalText>
              <TerminalText type="command">{cmd.cmd}</TerminalText>
            </div>
            {cmd.output && (
              <div className="pl-4">
                <TerminalText type="output">{cmd.output}</TerminalText>
              </div>
            )}
          </div>
        ))}

        {/* 显示正在输入的命令 */}
        {isTyping && !isSkipped && (
          <div>
            <TerminalText type="prompt" showCursor>{displayedText}</TerminalText>
          </div>
        )}

        {/* 跳过按钮 */}
        {skippable && isTyping && !isSkipped && (
          <div className="pt-4">
            <button
              onClick={handleSkip}
              className="text-terminal-text hover:text-terminal-green underline text-sm transition-colors"
            >
              Skip Animation
            </button>
          </div>
        )}
      </div>
    </TerminalWindow>
  )
}


