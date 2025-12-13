interface NoteDetailPageProps {
  params: {
    id: string
  }
}

export default function NoteDetailPage({ params }: NoteDetailPageProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">笔记详情</h1>
        <p className="text-gray-600 mb-4">笔记 ID: {params.id}</p>
        <p className="text-gray-600">这里将展示笔记的详细内容...</p>
      </article>
    </div>
  )
}

