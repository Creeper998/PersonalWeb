'use client'

import Link from 'next/link'
import { MouseEvent } from 'react'

/**
 * 笔记卡片组件
 * 展示单个笔记的预览信息
 */

interface NoteCardProps {
  id: string
  title: string
  excerpt: string
  createdAt?: string
  category?: string
  onDelete?: (id: string) => void
}

export default function NoteCard({ 
  id, 
  title, 
  excerpt, 
  createdAt,
  category,
  onDelete
}: NoteCardProps) {
  const handleDelete = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete) {
      onDelete(id)
    }
  }

  return (
    <div className="relative group">
      <Link href={`/notes/${id}`}>
        <div className="bg-terminal-bg-alt border border-terminal-border rounded-lg p-6 hover:border-terminal-green transition-all h-full flex flex-col cursor-pointer">
          {/* 分类标签 */}
          {category && (
            <span className="inline-block mb-3 px-2 py-1 bg-terminal-green/20 text-terminal-green rounded text-xs w-fit">
              {category}
            </span>
          )}
          
          {/* 标题 */}
          <h3 className="text-xl font-bold mb-3 text-terminal-green group-hover:text-terminal-prompt transition-colors line-clamp-2">
            {title}
          </h3>
          
          {/* 摘要 */}
          <p className="text-terminal-text mb-4 line-clamp-3 flex-grow text-sm">
            {excerpt}
          </p>
          
          {/* 创建时间 */}
          {createdAt && (
            <p className="text-xs text-terminal-text/60">
              $ date: {new Date(createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })}
            </p>
          )}
        </div>
      </Link>
      
      {/* 删除按钮 */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-500/20 rounded transition-all"
          title="删除笔记"
        >
          ×
        </button>
      )}
    </div>
  )
}

