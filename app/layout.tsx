import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NFT Deployment Tool',
  description: 'Deploy NFTs using CDP SDK and Pinata',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  )
}