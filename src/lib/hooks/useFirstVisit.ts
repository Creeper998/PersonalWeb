'use client'

import { useState, useEffect } from 'react'

/**
 * 检查用户是否首次访问网站
 * 使用 localStorage 记录访问状态
 * @returns {boolean} 是否首次访问
 */
export function useFirstVisit(): boolean {
  const [isFirstVisit, setIsFirstVisit] = useState(true)

  useEffect(() => {
    // 检查 localStorage 中是否已有访问记录
    const hasVisited = localStorage.getItem('hasVisited')
    
    if (hasVisited) {
      setIsFirstVisit(false)
    } else {
      // 标记为已访问
      localStorage.setItem('hasVisited', 'true')
    }
  }, [])

  return isFirstVisit
}



