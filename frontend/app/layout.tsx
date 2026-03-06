import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Tech Interviewer from Hell',
  description: 'AI-powered technical interview simulator that pushes you to your limits.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
