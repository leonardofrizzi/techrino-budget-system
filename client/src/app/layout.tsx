// src/app/layout.tsx
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Aplicativo de Cotações</title>
        <meta name="description" content="Sistema para gerenciamento de cotações" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
