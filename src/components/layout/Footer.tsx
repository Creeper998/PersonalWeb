/**
 * 页脚组件
 * 终端风格页脚，显示版权信息
 */
export default function Footer() {
  return (
    <footer className="border-t border-terminal-border py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-terminal-text/60 text-sm">
          &copy; {new Date().getFullYear()} portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

