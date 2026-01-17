import { AppProvider } from '@/providers'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${GeistSans.className} min-h-full bg-gray-50`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}