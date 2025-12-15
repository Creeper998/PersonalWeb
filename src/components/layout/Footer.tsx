import packageJson from '../../../package.json'

/**
 * 页脚组件
 * 终端风格页脚，显示版权信息和版本号
 */
export default function Footer() {
  return (
    <footer className="border-t border-terminal-border py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-terminal-text/60 text-sm">
          &copy; {new Date().getFullYear()} portfolio. All rights reserved.
        </p>
        <p className="text-terminal-text/40 text-xs mt-2">
          Version {packageJson.version}
        </p>
      </div>
    </footer>
  )
}

