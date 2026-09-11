import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { BackgroundProvider } from '@/contexts/BackgroundContext'
import BackgroundLayoutClient from '@/components/layout/BackgroundLayoutClient'
import './globals.css'
import './pill-nav.css'

export const metadata: Metadata = {
  title: 'Creeper',
  description: 'Creeper的个人网站(介绍、收录、学习)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <BackgroundProvider>
          <BackgroundLayoutClient />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </BackgroundProvider>
      </body>
    </html>
  )
}
