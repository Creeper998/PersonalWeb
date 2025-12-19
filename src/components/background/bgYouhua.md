# 背景效果性能优化文档

## 使用场景

在个人作品集网站中，使用 WebGL 实现的交互式像素背景效果（PixelBlast）。该效果：
- 覆盖整个屏幕作为背景
- 支持点击产生涟漪扩散效果
- 使用 Three.js 和 WebGL 进行实时渲染
- 每帧都在执行渲染（约 60fps）

## 问题表现

### 症状
1. **帧率下降**：页面运行一段时间后，帧率明显下降
2. **点击响应变慢**：点击后响应延迟增加
3. **动画不流畅**：页面动画出现卡顿
4. **时间特征**：运行不到 1 分钟就开始出现卡顿
5. **点击相关性**：点击次数越多，响应越慢

### 系统资源
- **内存占用**：不大（系统内存正常）
- **GPU 资源**：疑似积累导致性能下降

## 排除问题所在

### 1. 检查资源释放
- ✅ 几何体（Geometry）已正确释放：`geometry.dispose()`
- ✅ 材质（Material）已正确释放：`material.dispose()`
- ✅ 渲染器（Renderer）已正确释放：`renderer.dispose()`
- ✅ 效果合成器（Composer）已正确释放：`composer.dispose()`
- ✅ 纹理（Texture）已正确释放：`texture.dispose()`
- ✅ 事件监听器已正确移除
- ✅ 页面可见性监听已正确实现

**结论**：资源释放不是主要问题。

### 2. 检查渲染循环
- ✅ 页面不可见时已暂停渲染
- ✅ resize 事件已添加防抖
- ✅ console.log 已移除

**结论**：基础优化已到位，但问题仍然存在。

### 3. 深入分析点击效果
通过分析 shader 代码发现：
- 每帧都在遍历所有点击位置（最多 10 个）
- 即使点击很久了，shader 仍在计算涟漪效果
- 旧的点击位置不会被清理，一直占用计算资源

**结论**：问题根源在于点击效果的处理逻辑。

## 导致出现这个问题的原因

### 核心问题：点击效果无限期计算

#### Shader 代码逻辑（优化前）
```glsl
for (int i = 0; i < MAX_CLICKS; ++i){
  vec2 pos = uClickPos[i];
  if (pos.x < 0.0) continue;  // 只跳过无效点击
  float t = max(uTime - uClickTimes[i], 0.0);
  // ... 计算涟漪效果
  // 没有时间限制，即使 t 很大也会计算
}
```

#### 问题分析
1. **循环覆盖机制**：点击位置使用循环覆盖（`clickIx = (ix + 1) % MAX_CLICKS`），最多保存 10 个点击
2. **无限期计算**：即使点击已经过去很久（比如 10 秒），shader 仍会计算该点击的涟漪效果
3. **衰减但不清除**：虽然有衰减函数 `exp(-dampT * t)`，但不会完全归零，shader 仍在计算
4. **累积效应**：点击越多，shader 需要同时计算的涟漪效果越多，GPU 负担呈线性增长

#### 性能影响
- **每帧计算量**：最多同时计算 10 个涟漪效果
- **GPU 负担**：即使涟漪已经衰减到几乎看不见，GPU 仍在进行复杂计算
- **累积问题**：长时间运行后，旧的点击位置累积，导致 GPU 持续高负载

## 如何进行优化

### 优化方案：添加时间限制

在 shader 中添加时间检查，超过一定时间的点击不再计算。

#### 优化后的代码
```glsl
for (int i = 0; i < MAX_CLICKS; ++i){
  vec2 pos = uClickPos[i];
  if (pos.x < 0.0) continue;
  float cellPixelSize = 8.0 * pixelSize;
  vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
  float t = max(uTime - uClickTimes[i], 0.0);
  
  // 性能优化：超过 3 秒的点击不再计算，减少 GPU 负担
  if (t > 3.0) continue;  // ← 关键优化
  
  float r = distance(uv, cuv);
  float waveR = speed * t;
  float ring  = exp(-pow((r - waveR) / thickness, 2.0));
  float atten = exp(-dampT * t) * exp(-dampR * r);
  feed = max(feed, ring * atten * uRippleIntensity);
}
```

#### 优化原理
1. **时间阈值**：设置 3 秒的时间限制
2. **早期退出**：超过 3 秒的点击直接跳过，不进行任何计算
3. **视觉效果**：3 秒后涟漪已经衰减到几乎看不见，不影响用户体验
4. **性能提升**：大幅减少 GPU 计算量，最多只计算最近 3 秒内的点击

#### 其他优化措施
1. **页面可见性监听**：页面不可见时暂停渲染
2. **resize 防抖**：减少频繁的渲染器大小调整
3. **移除调试日志**：减少不必要的控制台输出
4. **资源释放**：确保所有 Three.js 资源正确释放

## 总结能学到的东西

### 1. WebGL/Shader 性能优化原则

#### 关键原则
- **早期退出（Early Exit）**：在 shader 中尽早跳过不需要的计算
- **时间限制**：对于有时效性的效果，设置合理的时间阈值
- **避免无限期计算**：即使有衰减，也要设置明确的过期时间

#### 实践建议
```glsl
// ❌ 不好的做法：无限期计算
float t = max(uTime - uClickTimes[i], 0.0);
// 即使 t 很大也会计算

// ✅ 好的做法：添加时间限制
float t = max(uTime - uClickTimes[i], 0.0);
if (t > MAX_EFFECT_DURATION) continue;  // 早期退出
```

### 2. 性能问题排查流程

#### 排查步骤
1. **观察症状**：帧率、响应时间、资源占用
2. **检查基础优化**：资源释放、事件监听、渲染循环
3. **深入分析**：检查 shader 代码、算法逻辑
4. **定位根源**：找到真正导致性能下降的代码
5. **针对性优化**：针对问题根源进行优化

#### 排查工具
- 浏览器性能分析器（Performance Profiler）
- GPU 使用率监控
- 帧率监控
- 内存分析工具

### 3. WebGL 性能优化技巧

#### Shader 优化
- **减少循环次数**：尽可能减少循环中的计算
- **早期退出**：使用 `continue` 或 `break` 跳过不需要的计算
- **避免分支过多**：虽然现代 GPU 支持分支，但仍有性能影响
- **合理使用 uniform**：避免频繁更新 uniform 值

#### Three.js 优化
- **资源释放**：确保所有资源正确释放（geometry、material、texture、renderer）
- **对象复用**：尽可能复用 Three.js 对象，避免频繁创建和销毁
- **渲染优化**：使用 `autoPauseOffscreen` 在页面不可见时暂停渲染
- **事件防抖**：对 resize 等频繁事件进行防抖处理

### 4. 如何预防类似问题

#### 开发阶段
1. **性能测试**：在开发过程中定期进行性能测试
2. **长时间运行测试**：测试长时间运行后的性能表现
3. **压力测试**：测试极端情况（大量点击、频繁交互）
4. **代码审查**：审查 shader 代码，检查是否有无限期计算

#### 设计阶段
1. **设置合理的过期时间**：对于有时效性的效果，在设计时就考虑过期机制
2. **限制最大数量**：对于可累积的效果，设置合理的最大数量限制
3. **性能预算**：为每个效果设置性能预算，避免过度消耗资源

#### 监控阶段
1. **性能监控**：在生产环境中监控帧率、GPU 使用率等指标
2. **用户反馈**：关注用户反馈，及时发现性能问题
3. **定期优化**：定期回顾和优化性能关键代码

### 5. 最佳实践总结

#### Shader 代码
```glsl
// ✅ 好的实践
for (int i = 0; i < MAX_ITEMS; ++i) {
  if (isInvalid(item[i])) continue;  // 早期退出
  if (isExpired(item[i])) continue;  // 时间限制
  // 只计算有效的、未过期的项目
  computeEffect(item[i]);
}
```

#### JavaScript 代码
```typescript
// ✅ 好的实践
// 1. 资源释放
useEffect(() => {
  const resource = createResource();
  return () => {
    resource.dispose();  // 确保释放
  };
}, []);

// 2. 事件防抖
const debouncedHandler = debounce(handler, 150);

// 3. 页面可见性
useEffect(() => {
  const handleVisibility = () => {
    if (document.hidden) pause();
    else resume();
  };
  document.addEventListener('visibilitychange', handleVisibility);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}, []);
```

## 优化效果

### 优化前
- 运行不到 1 分钟开始卡顿
- 点击次数越多，响应越慢
- 帧率持续下降
- GPU 持续高负载

### 优化后
- 长时间运行流畅
- 点击响应快速
- 帧率稳定
- GPU 负载合理

## 相关文件

- `PixelBlast.tsx` - 主要实现文件
- `BackgroundEffect.tsx` - 背景效果包装组件
- `PixelBlast.css` - 样式文件

## 参考资料

- [Three.js 文档 - 资源释放](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects)
- [WebGL 性能优化最佳实践](https://webglfundamentals.org/webgl/lessons/webgl-performance.html)
- [Shader 优化技巧](https://www.khronos.org/opengl/wiki/Performance_Tips)

---

## 案例二：路由切换导致的性能问题

### 问题表现

#### 症状
1. **导航栏切换卡顿**：点击导航栏切换页面时，页面响应越来越慢
2. **累积效应**：切换次数越多，卡顿越明显
3. **时间特征**：每次路由切换后性能都会下降一点
4. **内存泄漏特征**：长时间使用后，页面变得非常卡顿

#### 系统资源
- **内存占用**：可能逐渐增加（多个实例累积）
- **GPU 资源**：多个 `requestAnimationFrame` 循环同时运行
- **CPU 资源**：多个 WebGL 渲染器同时工作

### 查找原因的思路

#### 第一步：怀疑导航栏动画
- 检查 `PillNav` 组件的 `useEffect` 依赖项
- 检查 GSAP 动画是否正确清理
- 检查事件监听器是否正确移除

**初步结论**：导航栏动画有优化空间，但不是主要问题。

#### 第二步：检查背景效果
- 发现每个页面都有 `<BackgroundEffect />` 组件
- 检查路由切换时组件是否被正确卸载
- 检查 `requestAnimationFrame` 循环是否被正确停止

**关键发现**：每个页面都创建独立的 `BackgroundEffect` 实例！

### 排查办法

#### 1. 代码审查
```bash
# 搜索所有使用 BackgroundEffect 的地方
grep -r "BackgroundEffect" src/app/
```

**发现**：
- `about/page.tsx` - 有 BackgroundEffect
- `contact/page.tsx` - 有 BackgroundEffect
- `projects/page.tsx` - 有 BackgroundEffect
- `experience/page.tsx` - 有 BackgroundEffect
- `notes/page.tsx` - 有 BackgroundEffect

**问题**：每个页面都创建了独立的实例！

#### 2. 检查清理逻辑
```typescript
// PixelBlast.tsx 的清理函数
return () => {
  if (threeRef.current && mustReinit) {
    // ❌ 问题：提前返回，没有清理资源！
    return;
  }
  // 下面的清理代码不会执行
  cancelAnimationFrame(t.raf!);
  // ...
};
```

**发现**：当 `mustReinit` 为 true 时，清理函数提前返回，导致资源未清理。

#### 3. 性能分析
- 使用浏览器 Performance 工具
- 观察 `requestAnimationFrame` 调用次数
- 检查 WebGL 上下文数量

**发现**：路由切换后，旧的 `requestAnimationFrame` 循环没有被停止。

### 导致出现这个问题的原因

#### 核心问题：多个实例同时运行

##### 问题 1：每个页面都创建新实例
```tsx
// ❌ 问题代码：每个页面都这样写
export default function AboutPage() {
  const backgroundRef = useRef<PixelBlastHandle>(null)
  return (
    <>
      <BackgroundEffect ref={backgroundRef} />  // 创建新实例
      {/* ... */}
    </>
  )
}
```

**影响**：
- 路由从 `/about` 切换到 `/contact` 时：
  1. `/about` 页面的 `BackgroundEffect` 应该卸载
  2. `/contact` 页面的 `BackgroundEffect` 被创建
  3. 但如果清理不彻底，两个实例可能同时运行

##### 问题 2：清理逻辑有 bug
```typescript
// ❌ 问题代码
return () => {
  if (threeRef.current && mustReinit) {
    // 只清理事件监听器，然后提前返回
    // requestAnimationFrame 循环没有被停止！
    return;
  }
  // 正确的清理代码在这里，但不会执行
  cancelAnimationFrame(t.raf!);
};
```

**影响**：
- 当组件重新初始化时，旧的动画循环没有被停止
- 导致多个 `requestAnimationFrame` 循环同时运行
- 每个循环都在渲染 WebGL 场景，GPU 负担翻倍

##### 问题 3：Next.js 路由切换特性
- Next.js 使用客户端路由，组件可能不会完全卸载
- 如果清理不彻底，旧的实例会继续运行
- 多个页面组件可能同时存在于内存中

### 什么场景会出现这个问题

#### 典型场景
1. **单页应用（SPA）路由切换**
   - Next.js App Router
   - React Router
   - 其他客户端路由方案

2. **组件在多个页面复用**
   - 背景效果组件
   - 全局动画组件
   - 音频/视频播放器

3. **需要清理资源的组件**
   - WebGL/Canvas 组件
   - WebSocket 连接
   - 定时器/动画循环

#### 触发条件
- 用户频繁切换路由
- 组件清理逻辑不完整
- 使用 `useEffect` 但没有正确清理

### 解决方案

#### 方案 1：使用 Context 共享实例（推荐）

##### 创建 BackgroundContext
```typescript
// contexts/BackgroundContext.tsx
'use client'

import { createContext, useContext, useRef, ReactNode } from 'react'
import { PixelBlastHandle } from '@/components/background/BackgroundEffect'

interface BackgroundContextType {
  backgroundRef: React.RefObject<PixelBlastHandle>
}

const BackgroundContext = createContext<BackgroundContextType | null>(null)

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const backgroundRef = useRef<PixelBlastHandle>(null)
  return (
    <BackgroundContext.Provider value={{ backgroundRef }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (!context) {
    throw new Error('useBackground must be used within BackgroundProvider')
  }
  return context
}
```

##### 在 layout 中使用
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BackgroundProvider>
          <BackgroundLayoutClient />  {/* 只在这里创建一次 */}
          <Navbar />
          <main>{children}</main>
          <Footer />
        </BackgroundProvider>
      </body>
    </html>
  )
}
```

##### 在页面中使用
```tsx
// app/about/page.tsx
export default function AboutPage() {
  const { backgroundRef } = useBackground()  // 使用共享的 ref
  
  const handleClick = (e) => {
    backgroundRef.current?.handleClick(e.clientX, e.clientY)
  }
  
  return <div onClick={handleClick}>...</div>
}
```

**优势**：
- ✅ 只创建一个实例
- ✅ 所有页面共享同一个背景效果
- ✅ 路由切换时不会重复创建/销毁
- ✅ 性能最优

#### 方案 2：修复清理逻辑

##### 修复前
```typescript
return () => {
  if (threeRef.current && mustReinit) {
    // ❌ 提前返回，资源未清理
    return;
  }
  // 清理代码...
};
```

##### 修复后
```typescript
return () => {
  // ✅ 无论什么情况，都要清理资源
  if (!threeRef.current) return;
  const t = threeRef.current;
  
  // 确保停止动画循环（最重要！）
  if (t.raf !== undefined && t.raf !== null) {
    cancelAnimationFrame(t.raf);
    t.raf = undefined;
  }
  
  // 清理所有资源...
  t.renderer.dispose();
  // ...
  
  threeRef.current = null;
};
```

**关键点**：
- ✅ 无论 `mustReinit` 是否为 true，都要清理
- ✅ 优先停止 `requestAnimationFrame` 循环
- ✅ 确保所有资源都被释放

### 能学到什么

#### 1. React Context 的使用场景

##### 适用场景
- **全局状态共享**：主题、用户信息、配置
- **单例组件**：背景效果、音频播放器、WebSocket 连接
- **避免重复创建**：昂贵的组件（WebGL、Canvas）

##### 最佳实践
```typescript
// ✅ 好的实践：使用 Context 共享单例
const GlobalProvider = ({ children }) => {
  const expensiveRef = useRef(null)
  return (
    <Context.Provider value={{ expensiveRef }}>
      {children}
    </Context.Provider>
  )
}

// ❌ 不好的实践：每个组件都创建实例
const Component = () => {
  const expensiveRef = useRef(null)  // 每个组件都创建
  return <ExpensiveComponent ref={expensiveRef} />
}
```

#### 2. 组件清理的重要性

##### 必须清理的资源
1. **动画循环**
   ```typescript
   const raf = requestAnimationFrame(animate)
   // 必须清理
   return () => cancelAnimationFrame(raf)
   ```

2. **事件监听器**
   ```typescript
   window.addEventListener('resize', handler)
   // 必须清理
   return () => window.removeEventListener('resize', handler)
   ```

3. **WebGL 资源**
   ```typescript
   const renderer = new THREE.WebGLRenderer()
   // 必须清理
   return () => {
     renderer.dispose()
     geometry.dispose()
     material.dispose()
   }
   ```

4. **定时器**
   ```typescript
   const timer = setTimeout(fn, 1000)
   // 必须清理
   return () => clearTimeout(timer)
   ```

##### 清理函数的最佳实践
```typescript
useEffect(() => {
  // 初始化资源
  const resource = createResource()
  
  return () => {
    // ✅ 好的实践：无论什么情况都清理
    if (resource) {
      resource.cleanup()
    }
    
    // ❌ 不好的实践：条件性清理
    if (someCondition) {
      return  // 提前返回，资源未清理
    }
    resource.cleanup()
  }
}, [dependencies])
```

#### 3. Next.js 路由切换的特性

##### 客户端路由的特点
- 组件可能不会完全卸载
- 多个页面组件可能同时存在
- 需要手动清理资源

##### 最佳实践
```typescript
// ✅ 好的实践：在 layout 中创建单例
export default function Layout({ children }) {
  return (
    <Provider>
      <SingletonComponent />  {/* 只创建一次 */}
      {children}  {/* 页面切换不影响单例 */}
    </Provider>
  )
}

// ❌ 不好的实践：在每个页面创建
export default function Page() {
  return <ExpensiveComponent />  {/* 每次切换都创建 */}
}
```

#### 4. 性能问题排查流程

##### 系统化排查步骤
1. **观察症状**：卡顿、内存增长、帧率下降
2. **定位范围**：是特定操作还是全局问题
3. **检查资源**：是否有资源泄漏
4. **检查实例**：是否有重复创建
5. **检查清理**：清理逻辑是否完整
6. **验证修复**：修复后是否解决问题

##### 排查工具
- **浏览器 DevTools**
  - Performance 面板：查看帧率和调用栈
  - Memory 面板：检查内存泄漏
  - Network 面板：检查资源加载

- **代码分析**
  - 搜索组件使用位置
  - 检查 `useEffect` 清理函数
  - 检查 `ref` 和实例管理

#### 5. 性能优化原则

##### 原则 1：避免重复创建
```typescript
// ✅ 好的实践：单例模式
const globalInstance = useRef(null)

// ❌ 不好的实践：每次渲染都创建
const instance = new ExpensiveClass()
```

##### 原则 2：及时清理资源
```typescript
// ✅ 好的实践：完整的清理
useEffect(() => {
  const resource = create()
  return () => {
    resource.cleanup()  // 确保清理
  }
}, [])

// ❌ 不好的实践：不清理或条件性清理
useEffect(() => {
  const resource = create()
  // 没有清理函数
}, [])
```

##### 原则 3：共享昂贵资源
```typescript
// ✅ 好的实践：使用 Context 共享
const { sharedResource } = useSharedResource()

// ❌ 不好的实践：每个组件都创建
const resource = useRef(new ExpensiveResource())
```

### 优化效果对比

#### 优化前
- ❌ 每个页面都创建 `BackgroundEffect` 实例
- ❌ 路由切换时旧的实例可能没有完全清理
- ❌ 多个 `requestAnimationFrame` 循环同时运行
- ❌ 切换 5 次路由后明显卡顿
- ❌ GPU 使用率持续上升

#### 优化后
- ✅ 整个应用只有一个 `BackgroundEffect` 实例
- ✅ 路由切换时不会重复创建/销毁
- ✅ 只有一个 `requestAnimationFrame` 循环
- ✅ 切换任意次数路由都流畅
- ✅ GPU 使用率稳定

### 相关文件

- `contexts/BackgroundContext.tsx` - Context 实现
- `components/layout/BackgroundLayoutClient.tsx` - 客户端包装组件
- `app/layout.tsx` - 在 layout 中使用 Context
- `components/background/PixelBlast.tsx` - 修复清理逻辑

### 参考资料

- [React Context API](https://react.dev/reference/react/createContext)
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Three.js 资源释放](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects)
- [useEffect 清理函数](https://react.dev/reference/react/useEffect#cleanup)

---
