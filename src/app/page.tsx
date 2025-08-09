'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/logo';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If user is not authenticated, show the unauthenticated home page
  if (status === 'unauthenticated') {
    return <UnauthenticatedHome />;
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated, show the dashboard options
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-end space-x-6">
            <Link 
              href="/dashboard/profile" 
              className="px-4 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              Profile
            </Link>
            <Link 
              href="/api/auth/signout" 
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm"
            >
              Sign Out
            </Link>
          </div>
        </nav>

        <main className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-16">
              <Logo size="lg" centered />
              <p className="mt-4 text-xl text-gray-500">Where content meets value</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <Link 
                href="/content" 
                className="group p-8 rounded-xl bg-white hover:bg-gray-50 transition-all border border-gray-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50"
              >
                <div className="text-5xl mb-6 text-blue-400 group-hover:scale-110 transition-transform">🎵</div>
                <h3 className="text-2xl font-['Bebas_Neue'] tracking-wide text-gray-800 mb-3">STREAM & EARN</h3>
                <p className="text-gray-600">Earn money by streaming content</p>
                <div className="mt-4 text-blue-500 text-sm font-medium group-hover:text-blue-600">Start Streaming →</div>
              </Link>
              
              <Link 
                href="/store" 
                className="group p-8 rounded-xl bg-white hover:bg-gray-50 transition-all border border-gray-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50"
              >
                <div className="text-5xl mb-6 text-blue-400 group-hover:scale-110 transition-transform">🛒</div>
                <h3 className="text-2xl font-['Bebas_Neue'] tracking-wide text-gray-800 mb-3">SHOP</h3>
                <p className="text-gray-600">Discover and purchase content</p>
                <div className="mt-4 text-blue-500 text-sm font-medium group-hover:text-blue-600">Browse Store →</div>
              </Link>
              
              <Link 
                href="/dashboard" 
                className="group p-8 rounded-xl bg-white hover:bg-gray-50 transition-all border border-gray-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50"
              >
                <div className="text-5xl mb-6 text-blue-400 group-hover:scale-110 transition-transform">📊</div>
                <h3 className="text-2xl font-['Bebas_Neue'] tracking-wide text-gray-800 mb-3">DASHBOARD</h3>
                <p className="text-gray-600">Track your earnings and stats</p>
                <div className="mt-4 text-blue-500 text-sm font-medium group-hover:text-blue-600">View Dashboard →</div>
              </Link>
            </div>
            

          </div>
        </main>
      </div>
    );
  }
}

// Unauthenticated home page (will redirect to sign-in)
function UnauthenticatedHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Logo size="lg" />
          <div className="space-x-4">
            <Link 
              href="/auth/signin" 
              className="px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors rounded-md"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup" 
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-['Bebas_Neue'] tracking-wide mb-6">
            <span className="font-bold">STREAM</span>
            <span className="font-normal">RICH</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12">
            Get paid to stream content or promote your own to reach a wider audience.
          </p>
          <div className="space-x-4">
            <Link 
              href="/auth/signup" 
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md text-lg transition-colors inline-block shadow-sm"
            >
              Get Started
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-3 border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-white font-medium rounded-md text-lg transition-colors inline-block"
            >
              Learn More
            </Link>
          </div>
          <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload & Monetize</h3>
            <p className="text-gray-400">Reach new audiences and earn from your content</p>
          </div>
          <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
            <p className="text-gray-400">Access exclusive content from top creators</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 mt-20 py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} StreamRich. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
