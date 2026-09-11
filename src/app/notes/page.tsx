'use client'

import { useState, useEffect, useMemo } from 'react'
import { useBackground } from '@/contexts/BackgroundContext'
import NoteCard from '@/components/notes/NoteCard'
import NoteEditor from '@/components/notes/NoteEditor'
import CategorySidebar from '@/components/notes/CategorySidebar'
import { Note } from '@/lib/types'
import { getNotes, createNote, deleteNote } from '@/actions/noteAction'
import { getCategories } from '@/actions/categoryAction'

export default function NotesPage() {
  const { backgroundRef } = useBackground()
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 计算每个分类的笔记数量
  const noteCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    notes.forEach(note => {
      counts[note.category] = (counts[note.category] || 0) + 1
    })
    return counts
  }, [notes])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedCategory === '全部') {
      setFilteredNotes(notes)
    } else {
      setFilteredNotes(notes.filter(note => note.category === selectedCategory))
    }
  }, [selectedCategory, notes])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [notesData, categoriesData] = await Promise.all([
        getNotes(),
        getCategories()
      ])
      setNotes(notesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNote = async (data: { title: string; content: string; category: string }) => {
    try {
      await createNote(data)
      await loadData()
      setIsCreating(false)
    } catch (error) {
      console.error('创建笔记失败:', error)
      alert('创建笔记失败')
    }
  }

  const handleDeleteNote = async (id: string) => {
    if (confirm('确定要删除这条笔记吗？')) {
      try {
        const success = await deleteNote(id)
        if (success) {
          await loadData()
        } else {
          alert('删除失败')
        }
      } catch (error) {
        console.error('删除笔记失败:', error)
        alert('删除笔记失败')
      }
    }
  }

  const handleContentClick = (e: React.MouseEvent) => {
    if (backgroundRef.current) {
      backgroundRef.current.handleClick(e.clientX, e.clientY)
    }
  }

  return (
    <div className="min-h-screen flex relative z-10 pointer-events-none">
      {/* 左侧分类侧边栏 */}
      <div className="h-screen sticky top-0 pointer-events-auto">
        <CategorySidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          noteCounts={noteCounts}
        />
      </div>

      {/* 右侧主内容区 */}
      <div className="flex-1 px-4 py-24 relative pointer-events-auto" onClick={handleContentClick}>
        <div className="container mx-auto max-w-7xl">
          {/* 头部：标题和新建按钮 */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-terminal-green">
              $ notes
            </h1>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="px-6 py-2 bg-terminal-green text-terminal-bg rounded hover:bg-terminal-green/80 transition-colors font-medium"
            >
              {isCreating ? '取消' : '+ 新建笔记'}
            </button>
          </div>

          {/* 编辑器 */}
          {isCreating && (
            <div className="mb-8">
              <NoteEditor
                categories={categories}
                onSave={handleCreateNote}
                onCancel={() => setIsCreating(false)}
              />
            </div>
          )}

          {/* 笔记列表 */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-terminal-text">$ loading...</p>
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  id={note.id}
                  title={note.title}
                  excerpt={note.excerpt}
                  createdAt={note.createdAt}
                  category={note.category}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-terminal-text text-lg">
                {selectedCategory === '全部' 
                  ? '还没有笔记，点击"新建笔记"开始记录吧！' 
                  : `该分类下还没有笔记`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
