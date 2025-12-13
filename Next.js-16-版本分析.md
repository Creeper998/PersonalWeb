# Next.js 16 版本


### 1. **新增Cache Components（缓存组件）**
- 全新的缓存编程模型，使用 `"use cache"` 指令
  - 显式缓存，完全可选（opt-in）  ???
  - 自动生成缓存键
  - 完成 Partial Pre-Rendering (PPR部分预渲染) 的实现  ---> 消除Next静态、动态渲染的二元选择，可允许部分静态页面渲染为动态渲染，又不影响完全静态页面的初始加载
  - 默认所有动态代码在请求时执行（更符合全栈框架预期）

---

### 2. **新增Next.js DevTools MCP**
- Model Context Protocol 集成（模型上下文）， 可直接用于AI 辅助调试

---

### 3. **proxy.ts（替代 middleware.ts）**
- **变更**：`middleware.ts` → `proxy.ts`
- **原因**：明确网络边界，统一在 Node.js 运行时运行

```typescript
// proxy.ts
// 这一段代码是 Next.js 16 中用于替代 middleware.ts 的 proxy.ts 文件示例。它的作用是在收到请求时，将用户重定向到 /home 路径。



// - 定义并导出一个名为 proxy 的函数，接收 request 参数（类型为 NextRequest）。
export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url));
}// - 使用 NextResponse.redirect 方法，将请求重定向到新的 URL（/home）。
// - new URL('/home', request.url) 生成基于当前请求的完整 /home 路径。
```


---

### 4. **新增Turbopack（稳定版）**
- 开发和生产构建的默认打包工具
- 生产构建、 Fast Refresh（热更新）更快
- **新增文件系统缓存（Beta）**：
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};
```

---

### 5. **日志改进**
- **开发请求日志**：显示编译和渲染时间
- **构建日志**：显示每个构建步骤的耗时

---

### 6. **新增React 19.2相关组件的支持**
- View Transitions
- `useEffectEvent()`
- `<Activity/>` 组件


---

### 7. **改进的缓存 API**
- 新的 `updateTag()` 方法
- 改进的 `revalidateTag()`（需要 `cacheLife` 参数）
---



## 二、与 Next.js 15 的主要区别

### 1. **默认打包工具不同**
 - Next15 --> Webpack
 - Next16 --> Turbopack 默认使用，可以用webpack回退


---

### 2. **中间件不同**
 - Next15 --> `middleware.ts`（Edge 运行时）
 - Next16 --> `proxy.ts`（推荐，Node.js 运行时）

---

### 3. **异步参数访问**
 - Next15 --> 同步：`params`, `searchParams`
 - Next16 --> 异步：`await params`, `await searchParams`

 **同步和异步？**
  - 同步：（立即得到结果）
  - 异步：就像点外卖，你下单后需要等待，外卖到了才能拿到（需要等待才能得到结果）

**代码对比：**
```typescript
// Next.js 15 - 同步方式（立即获取）
export default function Page({ params }) {
  const id = params.id;  // 直接使用，不需要等待
  return <div>{id}</div>;
}

// Next.js 16 - 异步方式（需要等待）
export default async function Page({ params }) {
  const { id } = await params;  // 必须等待 params 准备好
  return <div>{id}</div>;
}
```
---

### 4. **API 变更**
 - `cookies()`, `headers()`, `draftMode()`：Next15 --> 同步，Next16 --> 异步（需要 await）
 - `revalidateTag()`：Next15 --> 单参数，Next16 --> 需要 `cacheLife` 参数
 - `next/image`：Next15 --> 支持本地 src 带查询字符串，Next16 --> 需要配置 `images.localPatterns`

---

## Next16目前缺点
- 破坏性变更，多个破坏性变更需要代码迁移
- BUG多，不稳定，近期出现高危漏洞
- 文档和社区资源可能还不够完善

- 必须使用异步参数访问
  ```typescript
  // Next.js 15（不再工作）
  export default function Page({ params, searchParams }) {
    return <div>{params.id}</div>;
  }

  //  Next.js 16（必须异步）
  export default async function Page({ params, searchParams }) {
    const { id } = await params;
    const { query } = await searchParams;
    return <div>{id}</div>;
  }
  ```

- Turbopack 兼容性
  - 某些自定义 Webpack 配置可能不兼容


## 总结
### Next.js 16 的优势
- 更快的构建速度（Turbopack 稳定版）
- 更明确的缓存模型（Cache Components）
- 更好的开发体验（改进的日志、MCP 集成）
- React 19.2 支持
- 清晰的网络边界（proxy.ts）

- [Next.js 16 官方博客](https://nextjs.org/blog/next-16)
- [升级指南](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Cache Components 文档](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)
- [proxy.ts 文档](https://nextjs.org/docs/app/getting-started/proxy)

