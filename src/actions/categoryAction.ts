'use server'

import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { DEFAULT_CATEGORIES } from '@/lib/constants'

const DATA_DIR = join(process.cwd(), 'data')
const CATEGORIES_FILE = join(DATA_DIR, 'categories.json')

// 确保目录存在
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

// 获取所有分类（包括默认分类和自定义分类）
export async function getCategories(): Promise<string[]> {
  await ensureDataDir()
  
  try {
    if (!existsSync(CATEGORIES_FILE)) {
      // 如果文件不存在，返回默认分类
      return [...DEFAULT_CATEGORIES]
    }
    const content = await readFile(CATEGORIES_FILE, 'utf-8')
    const categories = JSON.parse(content)
    // 合并默认分类和自定义分类，去重
    const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...categories])]
    return allCategories
  } catch (error) {
    console.error('读取分类失败:', error)
    return [...DEFAULT_CATEGORIES]
  }
}

// 添加自定义分类
export async function addCategory(category: string): Promise<boolean> {
  await ensureDataDir()
  
  if (!category.trim()) {
    return false
  }

  // 检查是否是默认分类
  if (DEFAULT_CATEGORIES.includes(category as any)) {
    return false
  }

  try {
    let customCategories: string[] = []
    if (existsSync(CATEGORIES_FILE)) {
      const content = await readFile(CATEGORIES_FILE, 'utf-8')
      customCategories = JSON.parse(content)
    }

    // 检查是否已存在
    if (customCategories.includes(category)) {
      return false
    }

    customCategories.push(category)
    await writeFile(CATEGORIES_FILE, JSON.stringify(customCategories, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('添加分类失败:', error)
    return false
  }
}

// 删除自定义分类（不能删除默认分类）
export async function deleteCategory(category: string): Promise<boolean> {
  await ensureDataDir()
  
  // 不能删除默认分类
  if (DEFAULT_CATEGORIES.includes(category as any)) {
    return false
  }

  try {
    if (!existsSync(CATEGORIES_FILE)) {
      return false
    }

    const content = await readFile(CATEGORIES_FILE, 'utf-8')
    const customCategories = JSON.parse(content)
    const filtered = customCategories.filter((cat: string) => cat !== category)
    
    await writeFile(CATEGORIES_FILE, JSON.stringify(filtered, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('删除分类失败:', error)
    return false
  }
}
