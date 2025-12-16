import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import './globals.css'
import './pill-nav.css'

export const metadata: Metadata = {
  title: '个人网站',
  description: 'Creeper的个人网站(介绍、收录、学习)',
  icons: {
    icon: '/img/headedImg.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
