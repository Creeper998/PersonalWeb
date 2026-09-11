'use client'

import dynamic from 'next/dynamic'
import TerminalWindow from './TerminalWindow'
import styles from './terminal.module.css'

// 在客户端组件中使用 dynamic 和 ssr: false
const FirstVisitOverlay = dynamic(() => import('./FirstVisitOverlay'), {
  ssr: false,
  loading: () => (
    <div className={styles.overlay}>
      <div className="w-full max-w-2xl">
        <TerminalWindow>
          <div className={styles.sequence}>
            <p role="status" className={styles.output}>
              正在打开个人主页…
            </p>
            <div className={styles.footer}>
              <a href="/about" className={styles.skip}>
                进入主页
              </a>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  ),
})

/**
 * 首次访问覆盖层客户端包装组件
 * 用于在服务端组件中导入，确保只在客户端加载
 */
export default function FirstVisitOverlayClient() {
  return <FirstVisitOverlay />
}
