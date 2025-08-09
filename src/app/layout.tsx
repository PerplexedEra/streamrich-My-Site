import type { Metadata, Viewport } from 'next';
import { Inter as FontSans, Bebas_Neue } from 'next/font/google';
// Simple utility function for class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Import the actual Toaster component
import { Toaster } from '@/components/ui/toast';
import dynamic from 'next/dynamic';

// Dynamically import the theme provider with no SSR
const ThemeProvider = dynamic(
  () => import('@/components/providers/theme-provider-new').then((mod) => mod.ThemeProvider),
  { ssr: false }
);
import { SessionProvider } from '@/components/providers/SessionProvider';
import { PayPalProvider } from '@/components/payment/paypal-provider';
import { MainHeader } from '@/components/layout/MainHeader';
import { CartProvider } from '@/contexts/cart-context';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StreamRich - Get Paid to Stream or Share Content',
  description: 'Earn money by streaming content or promote your own content to reach a wider audience.',
  keywords: ['streaming', 'content creation', 'earn money', 'music', 'videos', 'monetization'],
  authors: [{ name: 'StreamRich Team' }],
  creator: 'StreamRich',
  publisher: 'StreamRich',  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://streamrich.app',
    title: 'StreamRich - Get Paid to Stream or Share Content',
    description: 'Earn money by streaming content or promote your own content to reach a wider audience.',
    siteName: 'StreamRich',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreamRich',
    description: 'Get Paid to Stream or Share Content',
    creator: '@streamrich',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// This is a client component that wraps the authenticated layout
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable,
        bebasNeue.variable
      )}>
        <SessionProvider session={session}>
          <CartProvider>
          <PayPalProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col min-h-screen">
                <MainHeader />
                <main className="flex-1">
                  {children}
                </main>
              </div>
              <Toaster />
            </ThemeProvider>
          </PayPalProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
