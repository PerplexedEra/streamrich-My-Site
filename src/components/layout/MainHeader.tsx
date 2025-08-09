'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { UserNav } from '@/components/user-nav';
import { useSession } from 'next-auth/react';
import { CartIcon } from '@/components/cart/cart-icon';

export function MainHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdmin = session?.user?.role === 'ADMIN';

  // Only show navigation items that have corresponding icons
  const navItems = [
    { name: 'Home', href: '/', icon: 'home' },
    { name: 'Content', href: '/content', icon: 'playCircle' },
    { name: 'Store', href: '/store', icon: 'shoppingBag' },
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    ...(isAdmin ? [{ name: 'Admin Store', href: '/admin/store', icon: 'settings' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">StreamRich</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = Icons[item.icon as keyof typeof Icons] || Icons.arrowRight;
              const isActive = pathname === item.href || 
                             (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-1.5 px-2 py-1.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white',
                    'hover:transition-colors duration-200'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Right side - User navigation and cart */}
        <div className="flex items-center space-x-2">
          <CartIcon />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
