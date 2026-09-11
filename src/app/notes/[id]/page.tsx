import { notFound } from 'next/navigation'
import { getNoteById } from '@/actions/noteAction'
import NoteDetailClient from '@/components/notes/NoteDetailClient'

interface NoteDetailPageProps {
  params: {
    id: string
  }
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const note = await getNoteById(params.id)

  if (!note) {
    notFound()
  }

  return <NoteDetailClient note={note} />
}

