# Portfolio Frontend

个人作品集网站，使用 Next.js 15 + React 19 构建。

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



