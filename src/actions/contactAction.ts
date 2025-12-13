'use server'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  // TODO: 实现表单提交逻辑
  return {
    success: false,
    message: 'Not implemented',
  }
}



