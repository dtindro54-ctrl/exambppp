import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EXAMBPPP',
  description: 'Public exam management platform for admin and participants.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
