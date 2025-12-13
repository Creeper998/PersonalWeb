import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 终端风格颜色主题
      colors: {
        terminal: {
          bg: '#000000',           // 终端背景色（纯黑）
          'bg-alt': '#0a0a0a',     // 备用背景色（深灰黑）
          text: '#00ff41',         // 终端文字色（绿色）
          green: '#00ff41',        // 命令绿色
          prompt: '#00ff00',       // 提示符亮绿色
          border: '#1a1a1a',       // 边框色
          header: '#1a1a1a',       // 标题栏背景
        },
      },
      // 终端等宽字体
      fontFamily: {
        mono: ['Courier New', 'Consolas', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config

