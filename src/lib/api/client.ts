// API 基础地址，可通过环境变量配置
const API_BASE_URL = 'http://localhost:3000/api'

export async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // TODO: 实现 API 请求
  throw new Error('Not implemented')
}

export async function get<T>(endpoint: string): Promise<T> {
  // TODO: 实现 GET 请求
  throw new Error('Not implemented')
}

export async function post<T>(endpoint: string, data: unknown): Promise<T> {
  // TODO: 实现 POST 请求
  throw new Error('Not implemented')
}

