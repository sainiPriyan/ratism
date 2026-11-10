import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'Ratism', description: 'An independent corner of the internet for games, ideas, memes, experiments and other suspicious activity.', generator: 'v0.app', icons: { icon: '/icon.svg', apple: '/apple-icon.png' } }
export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#101010', width: 'device-width', initialScale: 1 }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
