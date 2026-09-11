export interface Project {
  id: string
  title: string
  description: string
  image?: string
  technologies: string[]
  link?: string
  github?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  period: string
  description: string
}

export interface Note {
  id: string
  title: string
  content: string  // Markdown 内容
  excerpt: string
  category: string  // 分类
  createdAt: string
  updatedAt?: string
  tags?: string[]
}

export type NoteCategory = string



