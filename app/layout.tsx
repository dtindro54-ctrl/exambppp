import './globals.css';
import './print.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EXAMBPPP | Ujian Digital',
  description: 'Platform ujian digital untuk pengelolaan soal, pelaksanaan tes, dan hasil peserta.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body>{children}</body></html>;
}
