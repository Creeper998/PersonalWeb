'use client'

import { useState, useEffect } from 'react'
import { getCategories, addCategory, deleteCategory } from '@/actions/categoryAction'
import { DEFAULT_CATEGORIES } from '@/lib/constants'

interface CategorySidebarProps {
  selectedCategory: string
  onCategorySelect: (category: string) => void
  noteCounts?: Record<string, number>
}

export default function CategorySidebar({
  selectedCategory,
  onCategorySelect,
  noteCounts = {}
}: CategorySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const cats = await getCategories()
      setCategories(cats)
    } catch (error) {
      console.error('加载分类失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      return
    }

    const success = await addCategory(newCategory.trim())
    if (success) {
      setNewCategory('')
      setIsAdding(false)
      await loadCategories()
    } else {
      alert('添加分类失败，可能已存在')
    }
  }

  const handleDeleteCategory = async (category: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    // 不能删除默认分类
    if (DEFAULT_CATEGORIES.includes(category as any)) {
      return
    }

    if (confirm(`确定要删除分类 "${category}" 吗？`)) {
      const success = await deleteCategory(category)
      if (success) {
        await loadCategories()
        // 如果删除的是当前选中的分类，切换到"全部"
        if (selectedCategory === category) {
          onCategorySelect('全部')
        }
      }
    }
  }

  const isDefaultCategory = (category: string) => {
    return DEFAULT_CATEGORIES.includes(category as any)
  }

  return (
    <div
      className={`bg-terminal-bg-alt border-r border-terminal-border h-full flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* 头部：标题和收起按钮 */}
      <div className="p-4 border-b border-terminal-border flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-terminal-green font-bold text-lg">$ categories</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-terminal-text hover:text-terminal-green transition-colors p-1"
          title={isCollapsed ? '展开' : '收起'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* 分类列表 */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto scrollbar-terminal">
          <div className="p-2 space-y-1">
            {/* 全部 */}
            <button
              onClick={() => onCategorySelect('全部')}
              className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center justify-between group ${
                selectedCategory === '全部'
                  ? 'bg-terminal-green text-terminal-bg'
                  : 'text-terminal-text hover:bg-terminal-bg hover:text-terminal-green'
              }`}
            >
              <span>全部</span>
              <span className="text-xs opacity-60">
                {Object.values(noteCounts).reduce((a, b) => a + b, 0)}
              </span>
            </button>

            {/* 分类列表 */}
            {isLoading ? (
              <div className="px-3 py-2 text-terminal-text/60 text-sm">加载中...</div>
            ) : (
              categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center group"
                >
                  <button
                    onClick={() => onCategorySelect(category)}
                    className={`flex-1 text-left px-3 py-2 rounded transition-colors flex items-center justify-between ${
                      selectedCategory === category
                        ? 'bg-terminal-green text-terminal-bg'
                        : 'text-terminal-text hover:bg-terminal-bg hover:text-terminal-green'
                    }`}
                  >
                    <span>{category}</span>
                    <span className="text-xs opacity-60">
                      {noteCounts[category] || 0}
                    </span>
                  </button>
                  {!isDefaultCategory(category) && (
                    <button
                      onClick={(e) => handleDeleteCategory(category, e)}
                      className="opacity-0 group-hover:opacity-100 text-terminal-text/60 hover:text-red-500 px-2 transition-opacity"
                      title="删除分类"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 添加分类 */}
      {!isCollapsed && (
        <div className="p-4 border-t border-terminal-border">
          {isAdding ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCategory()
                  } else if (e.key === 'Escape') {
                    setIsAdding(false)
                    setNewCategory('')
                  }
                }}
                placeholder="输入分类名称..."
                className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-green placeholder:text-terminal-text/40 focus:outline-none focus:border-terminal-green text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddCategory}
                  className="flex-1 px-3 py-1 bg-terminal-green text-terminal-bg rounded text-sm hover:bg-terminal-green/80"
                >
                  添加
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false)
                    setNewCategory('')
                  }}
                  className="px-3 py-1 border border-terminal-border text-terminal-text rounded text-sm hover:border-terminal-green"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full px-3 py-2 border border-terminal-border text-terminal-text rounded hover:border-terminal-green hover:text-terminal-green transition-colors text-sm flex items-center justify-center gap-2"
            >
              <span>+</span>
              <span>添加分类</span>
            </button>
          )}
        </div>
      )}

      {/* 收起状态下的添加按钮 */}
      {isCollapsed && (
        <div className="p-2 border-t border-terminal-border">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full px-2 py-2 border border-terminal-border text-terminal-text rounded hover:border-terminal-green hover:text-terminal-green transition-colors text-sm"
            title="展开以添加分类"
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}
