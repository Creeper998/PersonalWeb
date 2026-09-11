'use client'

import { useState, useRef } from 'react'
import { MDXEditor, MDXEditorMethods } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  linkPlugin,
  linkDialogPlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  InsertCodeBlock,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
} from '@mdxeditor/editor'

interface NoteEditorProps {
  initialTitle?: string
  initialContent?: string
  initialCategory?: string
  categories: string[]
  onSave: (data: { title: string; content: string; category: string }) => Promise<void>
  onCancel?: () => void
}

export default function NoteEditor({
  initialTitle = '',
  initialContent = '',
  initialCategory = '其他',
  categories,
  onSave,
  onCancel
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [category, setCategory] = useState(initialCategory)
  const [isSaving, setIsSaving] = useState(false)
  const editorRef = useRef<MDXEditorMethods>(null)

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容')
      return
    }
    setIsSaving(true)
    try {
      await onSave({ title, content, category })
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-terminal-bg-alt border border-terminal-border rounded-lg p-6 space-y-4">
      {/* 标题输入 */}
      <div>
        <label className="block text-sm text-terminal-text/60 mb-2">
          $ title:
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入笔记标题..."
          className="w-full bg-terminal-bg border border-terminal-border rounded px-4 py-2 text-terminal-green placeholder:text-terminal-text/40 focus:outline-none focus:border-terminal-green transition-colors"
        />
      </div>

      {/* 分类选择 */}
      <div>
        <label className="block text-sm text-terminal-text/60 mb-2">
          $ category:
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-terminal-bg border border-terminal-border rounded px-4 py-2 text-terminal-green focus:outline-none focus:border-terminal-green transition-colors"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-terminal-bg">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* MDXEditor - 所见即所得编辑器 */}
      <div>
        <label className="block text-sm text-terminal-text/60 mb-2">
          $ content:
        </label>
        <div className="border border-terminal-border rounded overflow-hidden">
          <MDXEditor
            ref={editorRef}
            markdown={content}
            onChange={setContent}
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              markdownShortcutPlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
              codeMirrorPlugin({
                codeBlockLanguages: {
                  js: 'JavaScript',
                  ts: 'TypeScript',
                  css: 'CSS',
                  html: 'HTML',
                  json: 'JSON',
                  md: 'Markdown',
                  python: 'Python',
                  java: 'Java',
                  go: 'Go',
                }
              }),
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <CodeToggle />
                    <InsertCodeBlock />
                    <ListsToggle />
                    <BlockTypeSelect />
                    <CreateLink />
                  </>
                )
              })
            ]}
            contentEditableClassName="prose prose-invert max-w-none p-4 min-h-[500px] text-terminal-text prose-headings:text-terminal-green prose-strong:text-terminal-green prose-code:text-terminal-green prose-pre:bg-terminal-bg prose-pre:border prose-pre:border-terminal-border"
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-terminal-green text-terminal-bg rounded hover:bg-terminal-green/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSaving ? '保存中...' : '保存笔记'}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-terminal-border text-terminal-text rounded hover:border-terminal-green hover:text-terminal-green transition-colors"
          >
            取消
          </button>
        )}
      </div>
    </div>
  )
}
