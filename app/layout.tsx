import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const assetUrl = (path: string) =>
  process.env.GITHUB_PAGES === 'true' ? `https://alpaymus.github.io/kadro${path}` : path

export const metadata: Metadata = {
  title: 'Kadro Yönetimi',
  description: 'İnsan kaynakları kadro planlama ve organizasyon yönetimi.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: assetUrl('/icon-light-32x32.png'),
        media: '(prefers-color-scheme: light)',
      },
      {
        url: assetUrl('/icon-dark-32x32.png'),
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: assetUrl('/icon.svg'),
        type: 'image/svg+xml',
      },
    ],
    apple: assetUrl('/apple-icon.png'),
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f7f8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
