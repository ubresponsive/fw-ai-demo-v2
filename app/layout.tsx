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
      <body className="h-full overflow-x-hidden">{children}</body>
    </html>
  )
}
