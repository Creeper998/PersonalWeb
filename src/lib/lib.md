# Lib（工具库层）

## 作用：存放通用的工具函数和配置

**Lib = Library（库）**，存放项目中可复用的工具函数、配置、常量等

## 主要职责

### 1. 工具函数（Utils）
存放通用的、可在多个地方使用的函数

**示例**：
- 日期格式化函数
- 字符串处理函数
- 数据验证函数
- 格式化函数

```javascript
// lib/utils/format.js
export function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN');
}

export function formatPrice(price) {
  return `¥${price.toFixed(2)}`;
}

// 在其他地方使用
import { formatDate, formatPrice } from '@/lib/utils/format';
```

### 2. API 请求封装
统一管理所有的 API 请求，封装 HTTP 请求逻辑

**示例**：
- 封装 fetch/axios
- 统一处理请求和响应
- 统一错误处理

```javascript
// lib/api/client.js
export async function request(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response.json();
}

// lib/api/user.js
import { request } from './client';

export function getUser(id) {
  return request(`/api/users/${id}`);
}

export function updateUser(id, data) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
```

### 3. 常量定义
存放项目中使用的常量、配置项

**示例**：
- API 地址
- 配置项
- 枚举值

```javascript
// lib/constants.js
export const API_BASE_URL = 'https://api.example.com';

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
};

export const STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
};
```

### 4. 类型定义（TypeScript）
如果使用 TypeScript，存放类型定义

```typescript
// lib/types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserRole = 'admin' | 'user' | 'guest';
```

### 5. 第三方库的封装
封装第三方库，提供统一的接口

**示例**：
- 封装 localStorage
- 封装 toast 提示
- 封装表单验证库

```javascript
// lib/storage.js
export const storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};
```

## Lib 与其他层的关系

```
Lib（工具库）
    ↓ 提供工具函数
App（页面层） ← 使用 lib 中的 API 封装获取数据
    ↓ 获取数据后通过 props 传递
Components（组件层） ← 使用 lib 中的工具函数处理数据
```

### 实际使用流程

```javascript
// 1. lib/api/user.js - 定义 API 请求
export function getUser(id) {
  return request(`/api/users/${id}`);
}

// 2. app/user/page.js - 页面层使用 lib
import { getUser } from '@/lib/api/user';

function UserPage() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    getUser(123).then(setUser);  // 使用 lib 中的函数
  }, []);

  return <UserCard user={user} />;
}

// 3. components/UserCard.js - 组件层使用 lib
import { formatDate } from '@/lib/utils/format';

function UserCard({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>注册时间：{formatDate(user.createdAt)}</p>  {/* 使用 lib 中的工具函数 */}
    </div>
  );
}
```

## 常见 Lib 目录结构

```
lib/
├── api/          # API 请求封装
│   ├── client.js
│   ├── user.js
│   └── product.js
├── utils/        # 工具函数
│   ├── format.js
│   ├── validate.js
│   └── helper.js
├── constants/    # 常量定义
│   └── index.js
├── types/        # 类型定义（TypeScript）
│   └── index.ts
└── config/       # 配置文件
    └── index.js
```

## 总结

**Lib 层的特点**：
-  **可复用**：多个地方都可以使用
-  **纯函数**：不依赖 UI，只处理数据
-  **独立**：不依赖页面层或组件层
-  **通用**：解决通用问题，不是业务逻辑

**Lib 层的作用**：
- 提供工具函数，避免重复代码
- 统一管理 API 请求
- 存放常量和配置
- 封装第三方库

**与其他层的区别**：
- **Lib**：提供工具，不涉及业务逻辑
- **App**：处理业务逻辑，获取数据
- **Components**：负责 UI 显示和交互

