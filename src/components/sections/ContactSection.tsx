'use client'

/**
 * Contact Section - 联系我区域
 * 展示联系方式或联系表单
 */

interface ContactSectionProps {
  /** 邮箱地址 */
  email?: string
  /** GitHub 链接 */
  github?: string
  /** 其他社交链接 */
  socialLinks?: Array<{ name: string; url: string }>
}

export default function ContactSection({ 
  email,
  github,
  socialLinks = []
}: ContactSectionProps) {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-4xl font-bold mb-8 text-terminal-green">
          $ contact
        </h2>
        
        <div className="space-y-6 text-terminal-text">
          {email && (
            <div>
              <span className="text-terminal-prompt">$ email:</span>
              <a 
                href={`mailto:${email}`}
                className="ml-2 text-terminal-green hover:underline"
              >
                {email}
              </a>
            </div>
          )}

          {github && (
            <div>
              <span className="text-terminal-prompt">$ github:</span>
              <a 
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-terminal-green hover:underline"
              >
                {github}
              </a>
            </div>
          )}

          {socialLinks.length > 0 && (
            <div>
              <span className="text-terminal-prompt">$ social:</span>
              <div className="mt-2 flex flex-wrap gap-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terminal-green hover:text-terminal-prompt transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {!email && !github && socialLinks.length === 0 && (
            <p>这里将展示联系方式...</p>
          )}
        </div>
      </div>
    </section>
  )
}



