import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FW AI Mockup',
  description: 'Enhanced ERP solution with AI interactivity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldBeDark = theme === 'dark' || (!theme && systemDark);

                if (shouldBeDark) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="h-full overflow-x-hidden">{children}</body>
    </html>
  )
}
