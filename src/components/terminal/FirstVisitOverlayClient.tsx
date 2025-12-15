'use client'

import dynamic from 'next/dynamic'

// 在客户端组件中使用 dynamic 和 ssr: false
const FirstVisitOverlay = dynamic(
  () => import('./FirstVisitOverlay'),
  { ssr: false }
)

/**
 * 首次访问覆盖层客户端包装组件
 * 用于在服务端组件中导入，确保只在客户端加载
 */
export default function FirstVisitOverlayClient() {
  return <FirstVisitOverlay />
}

