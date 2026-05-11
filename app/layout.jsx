import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Olai — Data and advertising, built as one.',
  description:
    'Olai is a Swedish data and growth consultancy. We run performance media, build the measurement to prove it, and ship the platform that ties it all together.',
  alternates: {
    types: {
      'application/json': [
        { url: '/agents.json', title: 'Agent Action Map' },
      ],
      'text/plain': [
        { url: '/llms.txt', title: 'LLM Context' },
      ],
      'text/markdown': [
        { url: '/agent-instructions.md', title: 'Agent Runbook' },
      ],
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
