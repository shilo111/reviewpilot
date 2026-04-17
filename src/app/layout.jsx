export const metadata = {
  title: 'ReviewPilot - מענה אוטומטי לביקורות',
  description: 'AI מייצר תגובות לביקורות גוגל ואינסטגרם',
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
