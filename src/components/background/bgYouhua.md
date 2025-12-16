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

**文档创建时间**：2024年
**最后更新**：2024年
**优化版本**：v1.0

