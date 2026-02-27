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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var shouldBeDark = theme === 'dark' || (theme === 'system' && systemDark);
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-full overflow-x-hidden">{children}</body>
    </html>
  )
}
