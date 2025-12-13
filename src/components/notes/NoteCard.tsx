'use client'

import Link from 'next/link'

/**
 * 笔记卡片组件
 * 展示单个笔记的预览信息
 */

interface NoteCardProps {
  id: string
  title: string
  excerpt: string
  createdAt?: string
}

export default function NoteCard({ 
  id, 
  title, 
  excerpt, 
  createdAt 
}: NoteCardProps) {
  return (
    <Link href={`/notes/${id}`}>
      <div className="bg-terminal-bg-alt border border-terminal-border rounded-lg p-6 hover:border-terminal-green transition-colors h-full">
        <h3 className="text-xl font-bold mb-2 text-terminal-green">
          {title}
        </h3>
        
        <p className="text-terminal-text mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        {createdAt && (
          <p className="text-sm text-terminal-text/60">
            $ date: {createdAt}
          </p>
        )}
      </div>
    </Link>
  )
}

