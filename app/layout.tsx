import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ChatBot from '@/components/ChatBot'
import NotificationSystem from '@/components/NotificationSystem'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'
import MarketTicker from '@/components/MarketTicker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'J Supreme Market Institute | Elite Trading Education',
  description:
    'Master institutional trading strategies. Learn order blocks, liquidity theory, and smart money concepts from J Supreme.',
  keywords:
    'trading education, order blocks, smart money concepts, institutional trading, forex trading, market structure',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Navigation />
        <MarketTicker />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
        <ChatBot />
        <NotificationSystem />
        <KeyboardShortcuts />
      </body>
    </html>
  )
}
