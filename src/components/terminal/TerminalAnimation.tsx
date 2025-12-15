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
  const [displayedCommand, setDisplayedCommand] = useState('')
  const [isTypingCommand, setIsTypingCommand] = useState(true)
  const [isSkipped, setIsSkipped] = useState(false)
  const [completedCommands, setCompletedCommands] = useState<Array<{cmd: string, output: string}>>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingRef = useRef(false)
  
  // 提示符常量，所有命令行都使用相同的提示符
  const prompt = 'myphz@archlinux:$ '

  // 跳过动画
  const handleSkip = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsSkipped(true)
    setIsTypingCommand(false)
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
      setIsTypingCommand(false)
      isTypingRef.current = false
      onComplete?.()
      return
    }

    // 清理之前的定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // 重置状态，开始新命令
    isTypingRef.current = true
    setIsTypingCommand(true)
    setDisplayedCommand('')
    
    // 提示符直接显示，等待1秒后再开始输入命令
    const command = currentCommand.cmd
    let charIndex = 0

    // 等待1秒后开始输入命令
    timeoutRef.current = setTimeout(() => {
      // 第一阶段：命令部分逐字显示
      intervalRef.current = setInterval(() => {
        if (charIndex < command.length) {
          setDisplayedCommand(command.substring(0, charIndex + 1))
          charIndex++
        } else {
          // 命令输入完成
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          
          // 立即将命令添加到已完成列表（先不显示输出，避免命令消失）
          setCompletedCommands(prev => [...prev, { 
            cmd: currentCommand.cmd, 
            output: '' // 先不显示输出
          }])
          setIsTypingCommand(false)
          
          // 等待一下，模拟按回车键（200ms），然后显示输出
          setTimeout(() => {
            // 更新已完成命令，添加输出
            setCompletedCommands(prev => {
              const newCommands = [...prev]
              newCommands[newCommands.length - 1] = {
                ...newCommands[newCommands.length - 1],
                output: currentCommand.output
              }
              return newCommands
            })
            
            // 等待后移动到下一个命令
            setTimeout(() => {
              setCurrentCommandIndex(prev => prev + 1)
            }, currentCommand.delay || 500)
          }, 200) // 模拟按回车键的延迟
        }
      }, 120) // 命令输入速度（每个字符间隔120ms，更慢，更像人工敲字）
    }, 1000) // 等待1秒后再开始输入命令

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
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
        {isTypingCommand && !isSkipped && (
          <div>
            <TerminalText type="prompt">{prompt}</TerminalText>
            <TerminalText type="command" showCursor>{displayedCommand}</TerminalText>
          </div>
        )}

        {/* 跳过按钮 - 只要动画未完成就一直显示，避免终端宽度变化 */}
        {skippable && currentCommandIndex < commands.length && !isSkipped && (
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


