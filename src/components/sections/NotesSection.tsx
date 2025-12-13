'use client'

import NoteCard from '@/components/notes/NoteCard'

/**
 * Notes Section - 知识记录区域
 * 展示学习笔记、技术文章等
 */

interface Note {
  id: string
  title: string
  excerpt: string
  createdAt?: string
}

interface NotesSectionProps {
  /** 笔记列表 */
  notes?: Note[]
}

export default function NotesSection({ 
  notes = [] 
}: NotesSectionProps) {
  return (
    <section id="notes" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold mb-8 text-terminal-green">
          $ notes
        </h2>
        
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                excerpt={note.excerpt}
                createdAt={note.createdAt}
              />
            ))}
          </div>
        ) : (
          <p className="text-terminal-text">这里将展示我的学习笔记...</p>
        )}
      </div>
    </section>
  )
}



