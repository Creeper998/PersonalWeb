import { Project, Experience, Note } from './types'

export const projects: Project[] = []

export const experiences: Experience[] = []

export const notes: Note[] = []

// API 基础地址，可通过环境变量配置
export const API_BASE_URL = 'http://localhost:3000/api'

// 关于我的信息
// 测试中文编码：这是一个测试注释，用于验证 Git 提交时中文是否正常显示
export const aboutMe = {
  nickname: "Creeper", 
  role: "An aspiring full-stack developer in continuous learning and improvement", 
  techStack: ["JavaScript/TypeScript, React/Vue", "Node.js Next.js", "MySQL/MongoDB, Redis"], 
  motto: "Able to write bugs, skilled at fixing them, and keep learning new skills for an hour every day", 
  funFact: "Yes, I'm named after the Creeper from Minecraft—also a coding 'Creeper' who sneaks through the web to gather technical resources and keeps advancing in learning. Eventually, quantitative accumulation will lead to qualitative change, just like a Creeper's spectacular explosion when the time comes!" 
}

