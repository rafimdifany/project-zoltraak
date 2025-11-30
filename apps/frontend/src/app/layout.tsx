import type { Metadata } from 'next';
import Script from 'next/script';

import { Providers } from './providers';
import './globals.css';

const themeInitScript = `
(() => {
  try {
    const storageKey = 'zoltraak.theme';
    const stored = window.localStorage.getItem(storageKey);
    const theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.setProperty('color-scheme', theme);
  } catch {
    const root = document.documentElement;
    root.classList.add('dark');
    root.style.setProperty('color-scheme', 'dark');
  }
})();
`;

export const metadata: Metadata = {
  title: {
    default: 'Lunaris | Financial Management for your needs',
    template: '%s | Zoltraak'
  },
  description: 'Personal finance intelligence dashboard with budgeting, assets, and insights.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
