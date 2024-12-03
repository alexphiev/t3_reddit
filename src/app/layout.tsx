import '~/styles/globals.css'

import { Inter } from 'next/font/google'
import { type Metadata } from 'next'

import { ClerkProvider } from '@clerk/nextjs'
import { TRPCReactProvider } from '~/trpc/react'

export const metadata: Metadata = {
  title: 'T3 Reddit',
  description: 'A basic Reddit clone built with T3 Stack',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const localization = {
  signUp: {
    start: {
      title: 'Join the best community ever',
      subtitle: 'Create an account today',
    },
  },
  signIn: {
    start: {
      title: 'Welcome back',
      subtitle: 'Sign in to your account',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider localization={localization}>
      <html lang="en" className={inter.className}>
        <body>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
