'use client'

import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { registerServiceWorker, checkForPWAInstall, setupPWARefresh } from '@/lib/pwa'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker()
    checkForPWAInstall()
    setupPWARefresh()
  }, [])

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
