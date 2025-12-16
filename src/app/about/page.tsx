'use client'

import RotatingTags from '@/components/animation/RotatingTags'

export default function AboutPage() {
  const roles = [
    'BUG DEVELOPER',
    'CODE WIZARD',
    'RUST ENJOYER',
    'FULL STACK',
    'PROBLEM SOLVER',
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        {/* 第一行：大号名字 Creeper */}
        <h1 className="text-6xl md:text-8xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
          Creeper
        </h1>

        {/* 第二行：标签依次滚动出现（每个标签都有打字动画效果，绿色中号字体，带光标） */}
        <div className="h-10 md:h-12 flex items-center justify-center">
          <RotatingTags
            tags={roles}
            duration={2000}
            typingSpeed={100}
            showCursor={true}
          />
        </div>

        {/* 第四行：描述文字 */}
        <p className="text-gray-300 text-lg md:text-xl mt-8 max-w-2xl mx-auto">
          XXXXXXXXXXXXXX
        </p>
      </div>
    </div>
  )
}
