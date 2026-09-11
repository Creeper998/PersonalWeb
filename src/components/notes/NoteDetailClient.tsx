'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Note } from '@/lib/types'
import { updateNote, deleteNote } from '@/actions/noteAction'
import { getCategories } from '@/actions/categoryAction'
import MarkdownRenderer from './MarkdownRenderer'
import NoteEditor from './NoteEditor'

interface NoteDetailClientProps {
  note: Note
}

export default function NoteDetailClient({ note }: NoteDetailClientProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [currentNote, setCurrentNote] = useState<Note>(note)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const cats = await getCategories()
      setCategories(cats)
    } catch (error) {
      console.error('加载分类失败:', error)
    }
  }

  const handleUpdateNote = async (data: { title: string; content: string; category: string }) => {
    try {
      const updated = await updateNote(currentNote.id, data)
      if (updated) {
        setCurrentNote(updated)
        setIsEditing(false)
      } else {
        alert('更新失败')
      }
    } catch (error) {
      console.error('更新笔记失败:', error)
      alert('更新笔记失败')
    }
  }

  const handleDeleteNote = async () => {
    if (confirm('确定要删除这条笔记吗？')) {
      try {
        const success = await deleteNote(currentNote.id)
        if (success) {
          router.push('/notes')
        } else {
          alert('删除失败')
        }
      } catch (error) {
        console.error('删除笔记失败:', error)
        alert('删除笔记失败')
      }
    }
  }

  return (
    <div className="min-h-screen px-4 py-24 relative z-10">
      <div className="container mx-auto max-w-4xl">
        {/* 返回按钮和操作按钮 */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-terminal-green hover:text-terminal-prompt transition-colors"
          >
            <span>←</span>
            <span>返回笔记列表</span>
          </Link>

          <div className="flex gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-terminal-green text-terminal-bg rounded hover:bg-terminal-green/80 transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={handleDeleteNote}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500/20 transition-colors"
                >
                  删除
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-terminal-border text-terminal-text rounded hover:border-terminal-green transition-colors"
              >
                取消编辑
              </button>
            )}
          </div>
        </div>

        {/* 笔记内容 */}
        {isEditing ? (
          <NoteEditor
            initialTitle={currentNote.title}
            initialContent={currentNote.content}
            initialCategory={currentNote.category}
            categories={categories}
            onSave={handleUpdateNote}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <article className="bg-terminal-bg-alt border border-terminal-border rounded-lg p-8">
            {/* 头部信息 */}
            <div className="mb-8 pb-6 border-b border-terminal-border">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-terminal-green flex-1">
                  {currentNote.title}
                </h1>
                {currentNote.category && (
                  <span className="ml-4 px-3 py-1 bg-terminal-green/20 text-terminal-green rounded text-sm whitespace-nowrap">
                    {currentNote.category}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-terminal-text/60">
                <span>$ created: {new Date(currentNote.createdAt).toLocaleString('zh-CN')}</span>
                {currentNote.updatedAt && (
                  <span>$ updated: {new Date(currentNote.updatedAt).toLocaleString('zh-CN')}</span>
                )}
              </div>
            </div>

            {/* Markdown 内容 */}
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={currentNote.content} />
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
