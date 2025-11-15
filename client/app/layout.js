import './globals.css'

export const metadata = {
  title: 'Aarambh - Web Development Bootcamp 2025',
  description: 'Join Aarambh\'s intensive web development bootcamp on November 22, 2025. Learn, build, and launch your projects with us.',
  keywords: 'web development, bootcamp, aarambh, coding, programming, next.js, node.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
