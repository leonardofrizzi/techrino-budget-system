import './globals.css'
import { Inter } from 'next/font/google'

// Use uma fonte do Google Fonts em vez da Geist
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Techrino - Sistema de Orçamentos',
  description: 'Sistema de gerenciamento de orçamentos Techrino',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
