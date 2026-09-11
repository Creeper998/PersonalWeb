'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre({ children }) {
            return (
              <pre className="bg-terminal-bg border border-terminal-border rounded p-4 overflow-x-auto">
                {children}
              </pre>
            )
          },
          code({ node: _node, className, children, ...props }) {
            return (
              <code className={`bg-terminal-bg-alt px-1 rounded text-terminal-green [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-inherit ${className || ''}`} {...props}>
                {children}
              </code>
            )
          },
          h1: ({ children }) => <h1 className="text-terminal-green text-3xl font-bold mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-terminal-green text-2xl font-bold mb-3 mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-terminal-green text-xl font-bold mb-2 mt-4">{children}</h3>,
          p: ({ children }) => <p className="text-terminal-text mb-4">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside text-terminal-text mb-4 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside text-terminal-text mb-4 space-y-2">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-terminal-green pl-4 italic text-terminal-text/80 mb-4">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a href={href} className="text-terminal-green hover:underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
