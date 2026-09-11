'use server'

import { Note } from '@/lib/types'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const DATA_DIR = join(process.cwd(), 'data')
const NOTES_DIR = join(DATA_DIR, 'notes')
const INDEX_FILE = join(NOTES_DIR, 'index.json')

// 确保目录存在
async function ensureNotesDir() {
  if (!existsSync(NOTES_DIR)) {
    await mkdir(NOTES_DIR, { recursive: true })
  }
}

// 获取所有笔记
export async function getNotes(): Promise<Note[]> {
  await ensureNotesDir()
  
  try {
    if (!existsSync(INDEX_FILE)) {
      return []
    }
    const content = await readFile(INDEX_FILE, 'utf-8')
    const notes = JSON.parse(content)
    // 按创建时间倒序排列
    return notes.sort((a: Note, b: Note) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch (error) {
    console.error('读取笔记列表失败:', error)
    return []
  }
}

// 根据 ID 获取笔记
export async function getNoteById(id: string): Promise<Note | null> {
  await ensureNotesDir()
  
  try {
    const notes = await getNotes()
    return notes.find(note => note.id === id) || null
  } catch (error) {
    console.error('读取笔记失败:', error)
    return null
  }
}

// 创建笔记
export async function createNote(data: {
  title: string
  content: string
  category: string
}): Promise<Note> {
  await ensureNotesDir()
  
  const now = new Date().toISOString()
  const excerpt = data.content
    .replace(/[#*`\[\]]/g, '') // 移除 Markdown 语法符号
    .substring(0, 150)
    .trim() + (data.content.length > 150 ? '...' : '')

  const note: Note = {
    id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: data.title,
    content: data.content,
    excerpt,
    category: data.category,
    createdAt: now,
    updatedAt: now,
  }

  try {
    const notes = await getNotes()
    notes.unshift(note) // 新笔记添加到开头
    
    await writeFile(INDEX_FILE, JSON.stringify(notes, null, 2), 'utf-8')
    return note
  } catch (error) {
    console.error('创建笔记失败:', error)
    throw new Error('创建笔记失败')
  }
}

// 更新笔记
export async function updateNote(id: string, data: {
  title?: string
  content?: string
  category?: string
}): Promise<Note | null> {
  await ensureNotesDir()
  
  try {
    const notes = await getNotes()
    const index = notes.findIndex(note => note.id === id)
    
    if (index === -1) {
      return null
    }

    const updatedNote: Note = {
      ...notes[index],
      ...data,
      excerpt: data.content 
        ? data.content.replace(/[#*`\[\]]/g, '').substring(0, 150).trim() + (data.content.length > 150 ? '...' : '')
        : notes[index].excerpt,
      updatedAt: new Date().toISOString(),
    }

    notes[index] = updatedNote
    
    await writeFile(INDEX_FILE, JSON.stringify(notes, null, 2), 'utf-8')
    return updatedNote
  } catch (error) {
    console.error('更新笔记失败:', error)
    throw new Error('更新笔记失败')
  }
}

// 删除笔记
export async function deleteNote(id: string): Promise<boolean> {
  await ensureNotesDir()
  
  try {
    const notes = await getNotes()
    const filteredNotes = notes.filter(note => note.id !== id)
    
    await writeFile(INDEX_FILE, JSON.stringify(filteredNotes, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('删除笔记失败:', error)
    return false
  }
}
