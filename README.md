# Portfolio Frontend

个人作品集网站，使用 Next.js 15 + React 19 构建。

## CR 品牌接入

导航已使用实心 CR，并可点击返回 `/about`；浏览器图标由 `src/app/icon.tsx`
生成 64px PNG。`src/components/branding/brand-mark.tsx` 与本地 DeerFlow
前端复用同一份 `public/brand/cr-solid.png`
轮廓和 CSS 显示规则。现有导航是黑色底，因此使用白色标志。

初始品牌接入未合并两个站点的路由、登录或数据，也未部署到公网。原来的 ReactBits
图标和头像文件保留。笔记模块同时修正了 React Markdown 的代码块结构与
MDXEditor 默认代码语言参数，以恢复类型检查和生产构建。

## 首页入场终端

根路径 `/` 的入场动画沿用现有首访流程与 `/about` 跳转，窗口视觉参考
DeerFlow 首页 AIO Sandbox 演示：小三色圆点、细边框、灰白等宽文字。
`src/components/terminal/terminal.module.css` 仅作用于这组组件，不改变
个人站其他页面主题，也没有把 DeerFlow 的沙盒或命令执行能力接入这里。
命令只是入场演示，不会真的执行。可点击“跳过动画”或按 Escape 跳过，
减少动态效果偏好会直接进入主页。`/?showAnimation=true` 可以重新预览动画。
脚本加载前使用同款终端占位，并提供无需脚本的“进入主页”链接。

## 个人网站 + Agent 统一入口

个人站保留现有视觉和独立运行方式，DeerFlow 的 `2026` 入口可通过
`CREEPER_SITE_ORIGIN` 将 `/`、`/about`、`/experience`、`/projects`、
`/notes`（含详情）、`/contact` 转发到本站。`/login`、`/workspace/*`
与 `/api/*` 仍由 DeerFlow 处理，不迁移数据库。

导航新增 `agent`，只对跨站入口使用原生 `<a>`；个人站内部导航保持 Next Link。
独立预览可在 `.env.local` 设置
`NEXT_PUBLIC_AGENT_ENTRY_URL=http://localhost:2026/workspace/chats/new`，
正式同源环境则不设置，默认使用相对路径。修改后需要重启开发服务。

本站 JS/CSS/HMR 使用 `/_creeper` 前缀；图片优化器使用
`/_creeper/_next/image`，品牌文件使用 `/_creeper/public/brand/*`，
避免与 Agent 的 `/_next` 及 public 文件冲突。新增公共素材时要显式添加对应路径，
不能以全路径代理掩盖资源归属。Server Actions 仅额外允许本机 2026 来源。

当前只做本地融合，笔记编辑仍无账户鉴权，不能直接公开到互联网。
3101 个人站与 Docker 内的 DeerFlow 需要分别启动；未改动原背景、页面内容、
笔记数据或入场终端。完整配置见 DeerFlow 仓库的 `docs/creeper-personal-site.md`。

## 技术栈

- **Next.js 15** - React 框架
- **React 19** - UI 库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Vercel** - 部署平台

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 项目结构

```
src/
├── app/              # Next.js App Router 页面
├── components/        # React 组件
├── lib/              # 工具函数和类型定义
└── actions/          # Server Actions
```

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. Vercel 会自动检测 Next.js 项目并部署

或者使用 Vercel CLI：

```bash
npm i -g vercel
vercel
```

## 环境变量

创建 `.env.local` 文件：

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```



